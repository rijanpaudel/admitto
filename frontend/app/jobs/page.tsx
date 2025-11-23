'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Resource } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, ExternalLink, Clock, Check, CheckCircle, GraduationCap, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from "next/image";

export default function JobsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [jobResources, setJobResources] = useState<Resource[]>([])

  useEffect(() => {
    async function fetchJobResources() {
      const { data } = await supabase
        .from('resources')
        .select('*')
        .eq('category', 'job')
        .order('created_at', { ascending: false })

      setJobResources((data as Resource[]) || [])
    }

    fetchJobResources()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Image
              src="/images/admitto-logo.png"
              alt="Admitto logo"
              width={120}
              height={0}
              sizes="100vw"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-smooth"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white animate-slide-down">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link
                href="/scholarships"
                className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-smooth font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Scholarships
              </Link>
              <Link
                href="/visa-guide"
                className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-smooth font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Visa Guide
              </Link>
              <Link
                href="/jobs"
                className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-smooth font-medium text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link
                href="/ask-ai"
                className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-smooth font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ask AI
              </Link>
              <Link
                href="/document-review"
                className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-smooth font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Document Review
              </Link>
            </div>
          </div>
        )}
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