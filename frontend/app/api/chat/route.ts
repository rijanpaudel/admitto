// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// If you hit issues with edge, you can comment this out
export const runtime = 'edge'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Supabase client with service role (for RPC)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface Resource {
  resource_id: string
  title: string
  institution?: string
  description?: string
  amount?: string
  url?: string
  category: string
  similarity: number
}

function inferCategoryFromQuestion(question: string): string | null {
  const q = question.toLowerCase()

  if (q.includes('visa') || q.includes('study permit')) return 'visa'
  if (q.includes('scholarship') || q.includes('funding')) return 'scholarship'
  if (q.includes('job') || q.includes('work') || q.includes('pgwp')) return 'job'
  if (q.includes('university') || q.includes('universities') || q.includes('co-op')) return 'university'

  return null
}

async function retrieveRelevantResources(queryEmbedding: number[], question: string): Promise<Resource[]> {
  const matchCategory = inferCategoryFromQuestion(question)

  const { data, error } = await supabase.rpc('match_resources', {
    query_embedding: queryEmbedding,
    match_threshold: 0.2,
    match_count: 5,
    match_category: matchCategory,
  })

  if (error) {
    console.error('Supabase RPC error:', error)
    return []
  }

  console.log('Retrieved resources:', data?.length || 0)
  return (data || []) as Resource[]
}


function formatContext(resources: Resource[]): string {
  if (resources.length === 0) {
    return 'No relevant resources from the database were found for this question.'
  }

  return resources
    .map((r, idx) => {
      let s = `[${idx + 1}] ${r.title}`
      if (r.institution) s += ` (${r.institution})`
      s += '\n'
      if (r.description) s += `Description: ${r.description}\n`
      if (r.amount) s += `Amount: ${r.amount}\n`
      if (r.url) s += `URL: ${r.url}\n`
      s += `Category: ${r.category}\n`
      s += `Relevance: ${(r.similarity * 100).toFixed(1)}%\n`
      return s
    })
    .join('\n---\n\n')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages = body.messages as Message[]

    if (!messages || messages.length === 0) {
      return new NextResponse('Messages are required', { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]
    const userQuery = lastMessage.content as string

    console.log('User query:', userQuery)

    // 1) Get query embedding via OpenAI embeddings API
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: userQuery,
      encoding_format: 'float',
    })

    const queryEmbedding = embeddingResponse.data[0].embedding
    console.log('Embedding generated, length:', queryEmbedding.length)

    // 2) Retrieve relevant resources
    const relevantResources = await retrieveRelevantResources(queryEmbedding, userQuery)
    relevantResources.forEach((r, i) =>
      console.log(`[${i + 1}] ${r.title} -> ${r.similarity?.toFixed(3)}`)
    )

    // 3) Build context and system prompt
    const context = formatContext(relevantResources)
    console.log('Context length:', context.length)

    const systemMessage = `You are an AI assistant for "Admitto", helping students study abroad globally.

Use the context below as your primary source of truth.
If the context does not fully answer the question, do your best with the closest matches and explain any limitations.
Always cite sources using [1], [2], etc. that correspond to the numbered items in the context.

If a user asks for "the best" option and the context does not contain explicit rankings, list the most relevant options you have and say that these are examples based on available information, not an absolute ranking.

Context:
${context}
`


    // 4) Create streaming response with OpenAI
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        ...messages.map(m => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    })

    // 5) Create custom streaming response
    const encoder = new TextEncoder()

    const customStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              const data = `data: ${JSON.stringify({
                choices: [{
                  delta: { content }
                }]
              })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    // 6) Return response with custom headers
    return new NextResponse(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Retrieved-Resources': JSON.stringify(
          relevantResources.map(r => ({
            id: r.resource_id,
            title: r.title,
            url: r.url,
            category: r.category,
            similarity: r.similarity,
          }))
        ),
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}