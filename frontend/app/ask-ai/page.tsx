'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Send, Sparkles, Loader2, ExternalLink } from 'lucide-react'

const EXAMPLE_QUESTIONS = [
  "What scholarships are available for undergraduate Computer Science students?",
  "How do I apply for a Canadian study permit?",
  "Can international students work while studying in Canada?",
  "Which universities offer the best co-op programs?",
  "What is the Vanier scholarship and who is eligible?",
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface Source {
  id: string
  title: string
  url: string
}

export default function AskAIPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retrievedSources, setRetrievedSources] = useState<Source[]>([])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault()
    
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Extract sources from headers
      const sourcesHeader = response.headers.get('X-Retrieved-Resources')
      if (sourcesHeader) {
        try {
          const sources = JSON.parse(sourcesHeader)
          setRetrievedSources(sources)
        } catch (e) {
          console.error('Failed to parse sources:', e)
        }
      }

      // Read the streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: ''
      }

      setMessages(prev => [...prev, assistantMessage])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                if (parsed.choices?.[0]?.delta?.content) {
                  assistantContent += parsed.choices[0].delta.content
                  setMessages(prev => 
                    prev.map(m => 
                      m.id === assistantMessage.id 
                        ? { ...m, content: assistantContent }
                        : m
                    )
                  )
                }
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleExampleClick = (question: string) => {
    setInput(question)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Nepali Abroad Helper
          </Link>
          <div className="flex gap-6">
            <Link href="/scholarships" className="text-gray-600 hover:text-blue-600 transition">
              Scholarships
            </Link>
            <Link href="/visa-guide" className="text-gray-600 hover:text-blue-600 transition">
              Visa Guide
            </Link>
            <Link href="/jobs" className="text-gray-600 hover:text-blue-600 transition">
              Jobs
            </Link>
            <Link href="/ask-ai" className="text-blue-600 font-medium">
              Ask AI
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">AI Assistant</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Ask anything about studying in Canada. Powered by verified data from 30+ official sources.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Example Questions */}
          {messages.length === 0 && (
            <Card className="mb-6 p-6">
              <h3 className="text-lg font-semibold mb-4">Try asking:</h3>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_QUESTIONS.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-left h-auto py-2 px-3"
                    onClick={() => handleExampleClick(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </Card>
          )}

          {/* Chat Messages */}
          <Card className="mb-6 min-h-[500px] flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Start a conversation by asking a question!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="text-sm font-semibold mb-1">
                          {message.role === 'user' ? 'You' : 'AI Assistant'}
                        </div>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Sources Section */}
            {retrievedSources.length > 0 && messages.length > 0 && (
              <div className="border-t p-4 bg-slate-50">
                <p className="text-sm font-semibold mb-2">Sources used:</p>
                <div className="flex flex-wrap gap-2">
                  {retrievedSources.map((source, idx) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs"
                    >
                      <Badge variant="secondary" className="hover:bg-gray-300 transition">
                        [{idx + 1}] {source.title}
                        <ExternalLink className="ml-1 h-3 w-3 inline" />
                      </Badge>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about scholarships, visas, jobs, or universities..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {error && (
                <p className="text-red-600 text-sm mt-2">
                  Error: {error}. Please try again.
                </p>
              )}
            </div>
          </Card>

          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200 p-4">
            <p className="text-sm text-blue-900">
              <strong>How it works:</strong> Your question is matched against 30+ curated resources
              using AI embeddings. The assistant generates answers based only on verified information
              with source citations. All data is from official university and government sources.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}