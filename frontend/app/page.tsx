import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, GraduationCap, FileText, Briefcase, MessageSquare, DollarSign, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Resource } from '@/lib/supabase'

async function getFeaturedScholarships() {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('category', 'scholarship')
    .order('created_at', { ascending: false })
    .limit(3)
  
  if (error) console.error('Error:', error)
  return (data as Resource[]) || []
}

async function getResourceCounts() {
  const { count: scholarshipCount } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
    .eq('category', 'scholarship')

  const { count: jobCount } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
    .eq('category', 'job')

  return { scholarshipCount: scholarshipCount || 0, jobCount: jobCount || 0 }
}

export default async function Home() {
  const featuredScholarships = await getFeaturedScholarships()
  const { scholarshipCount, jobCount } = await getResourceCounts()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Nepali Abroad Helper
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/scholarships" className="text-gray-600 hover:text-blue-600 transition">
              Scholarships
            </Link>
            <Link href="/visa-guide" className="text-gray-600 hover:text-blue-600 transition">
              Visa Guide
            </Link>
            <Link href="/jobs" className="text-gray-600 hover:text-blue-600 transition">
              Jobs
            </Link>
            <Link href="/ask-ai" className="text-gray-600 hover:text-blue-600 transition">
              Ask AI
            </Link>
          </div>
          <Button asChild>
            <Link href="/scholarships">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            Free • Curated • AI-Powered
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Stop Paying Consultancies.<br />
            <span className="text-blue-600">Start Your Canada Journey Free.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Access {scholarshipCount} verified scholarships, complete visa guides, and AI-powered answers—all in one place. No hidden fees. No scattered information.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg">
              <Link href="/scholarships">
                Browse Scholarships <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg">
              <Link href="/ask-ai">
                Ask AI Assistant
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <span>{scholarshipCount} Scholarships</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <span>{jobCount} Job Resources</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Updated Weekly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-red-50 border-y border-red-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              The Problem: Education Consultancies Charge NPR 50,000 - 200,000
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              For information that's already free online. We've curated everything you need from official sources—completely free.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600">❌ Scattered across 100+ websites</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600">❌ Outdated or incorrect information</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600">❌ No personalized guidance</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need in One Place</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Verified Scholarships</CardTitle>
              <CardDescription>
                Curated from official university and government sources. Includes deadlines, amounts, and eligibility.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" asChild className="px-0">
                <Link href="/scholarships">Browse {scholarshipCount} scholarships →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Step-by-Step Visa Guide</CardTitle>
              <CardDescription>
                Official IRCC requirements, document checklists, processing times, and application tips.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" asChild className="px-0">
                <Link href="/visa-guide">View visa guide →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Job Opportunities</CardTitle>
              <CardDescription>
                Part-time jobs, co-op programs, and post-graduation work permit information for international students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" asChild className="px-0">
                <Link href="/jobs">Explore job resources →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-bold mb-4">Ask Our AI Assistant Anything</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Get instant, personalized answers about scholarships, visa requirements, and studying in Canada. Powered by RAG technology with verified data.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/ask-ai">
              Try AI Assistant (Coming Soon)
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Scholarships */}
      {featuredScholarships.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Scholarships</h2>
            <Button variant="outline" asChild>
              <Link href="/scholarships">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredScholarships.map((scholarship) => (
              <Card key={scholarship.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{scholarship.category}</Badge>
                    {scholarship.amount && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {scholarship.amount}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {scholarship.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {scholarship.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {scholarship.deadline && (
                    <p className="text-sm text-gray-600 mb-4">
                      Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                  {scholarship.url && (
                    <Button variant="link" asChild className="px-0">
                      <a href={scholarship.url} target="_blank" rel="noopener noreferrer">
                        Learn More <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Canada Journey?</h2>
          <p className="text-xl mb-8 text-slate-300">
            Join hundreds of Nepali students who are navigating their Canada dreams for free.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/scholarships">
              Get Started Now <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Nepali Abroad Helper</h3>
              <p className="text-sm text-gray-600">
                Free, curated, and AI-powered platform helping Nepali students study in Canada.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/scholarships" className="text-gray-600 hover:text-blue-600">Scholarships</Link></li>
                <li><Link href="/visa-guide" className="text-gray-600 hover:text-blue-600">Visa Guide</Link></li>
                <li><Link href="/jobs" className="text-gray-600 hover:text-blue-600">Jobs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-600 hover:text-blue-600">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            © 2025 Nepali Abroad Helper. All information sourced from official channels.
          </div>
        </div>
      </footer>
    </div>
  )
}