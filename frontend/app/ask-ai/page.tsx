import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AskAIPage() {
  return (
    <div className="min-h-screen bg-slate-50">
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

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <Badge className="mb-4">Coming Soon</Badge>
          <MessageSquare className="h-20 w-20 mx-auto mb-6 text-blue-600" />
          <h1 className="text-4xl font-bold mb-4">AI Assistant</h1>
          <p className="text-xl text-gray-600 mb-8">
            Get instant, personalized answers about scholarships, visas, and studying in Canada. 
            Powered by RAG technology with verified official data.
          </p>
          
          <Card className="text-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                What You'll Be Able to Ask:
              </CardTitle>
              <CardDescription className="space-y-2 mt-4">
                <p>• "Which scholarships am I eligible for with 85% GPA?"</p>
                <p>• "How much money do I need to show for study permit?"</p>
                <p>• "What are the best universities for Computer Science?"</p>
                <p>• "Can I work while studying in Canada?"</p>
                <p>• "Compare UBC vs University of Toronto for Engineering"</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <p className="mt-8 text-gray-600">
            We're building this feature next! Check back soon.
          </p>
        </div>
      </div>
    </div>
  )
}