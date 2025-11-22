import { supabase } from '@/lib/supabase'
import type { Resource } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, ExternalLink, Clock, Check, CheckCircle, GraduationCap } from 'lucide-react'
import Link from 'next/link'

async function getJobResources() {
  const { data } = await supabase
    .from('resources')
    .select('*')
    .eq('category', 'job')
    .order('created_at', { ascending: false })

  return (data as Resource[]) || []
}

export default async function JobsPage() {
  const jobResources = await getJobResources()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Admitto
          </Link>
          <div className="flex gap-6">
            <Link href="/scholarships" className="text-gray-600 hover:text-blue-600 transition">
              Scholarships
            </Link>
            <Link href="/visa-guide" className="text-gray-600 hover:text-blue-600 transition">
              Visa Guide
            </Link>
            <Link href="/jobs" className="text-blue-600 font-medium">
              Jobs
            </Link>
            <Link href="/ask-ai" className="text-gray-600 hover:text-blue-600 transition">
              Ask AI
            </Link>
            <Link href="/document-review" className="text-gray-600 hover:text-blue-600 transition">
              Document Review
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Jobs for International Students
          </h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Find part-time jobs, co-op programs, and post-graduation opportunities in Canada.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Work Rules Info */}
        <Card className="mb-12 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover-lift transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Clock className="h-6 w-6 text-primary" />
              Work Rules for International Students
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>20 hours per week</strong> during academic sessions (classes in progress)</span>
            </p>
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Full-time</strong> during scheduled breaks (summer, winter holidays)</span>
            </p>
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>No work permit required</strong> if you have valid study permit</span>
            </p>
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>On-campus or off-campus</strong> work both allowed</span>
            </p>
            <p className="text-sm text-gray-700 mt-4">Note: You can start working once your studies begin, not before.</p>
          </CardContent>
        </Card>

        {/* Job Resources Grid */}
        <h2 className="text-3xl font-bold mb-6">Job Boards & Resources</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {jobResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  <Badge variant="secondary">
                    {typeof resource.metadata?.job_type === 'string'
                      ? resource.metadata.job_type
                      : typeof resource.metadata?.resource_type === 'string'
                        ? resource.metadata.resource_type
                        : 'Job Resource'}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <CardDescription className="mt-2">{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {resource.url && (
                  <Button className="w-full" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      Visit Site <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Post-Graduation Info */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover-lift transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <GraduationCap className="h-6 w-6 text-green-600" />
              Post-Graduation Work Permit (PGWP)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium">After completing your studies, you can work in Canada full-time:</p>
            <ul className="space-y-2 ml-4 list-none">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Program 8-12 months → 8-month work permit</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Program 2+ years → 3-year work permit</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Apply within 180 days of graduation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Pathway to permanent residence through Express Entry</span>
              </li>
            </ul>
            <Button className="mt-4" variant="outline" asChild>
              <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html"
                target="_blank" rel="noopener noreferrer">
                Learn More About PGWP <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}