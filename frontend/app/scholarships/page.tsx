'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Resource } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
//import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Calendar, ArrowRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from "next/image";
//import { ScholarshipFilters } from '@/components/scholarship-filters'

export default function ScholarshipsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scholarships, setScholarships] = useState<Resource[]>([])

  useEffect(() => {
    async function fetchScholarships() {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category', 'scholarship')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching scholarships:', error)
        return
      }

      setScholarships(data as Resource[])
    }

    fetchScholarships()
  }, [])

  // helper to safely check includes on possible string or array fields
  const fieldIncludes = (field: unknown, needle: string) => {
    if (typeof field === 'string') return field.includes(needle)
    if (Array.isArray(field)) return field.includes(needle)
    return false
  }

  const undergrad = scholarships.filter(s =>
    fieldIncludes(s.metadata?.level, 'Undergraduate') || fieldIncludes(s.tags, 'undergraduate')
  )
  const graduate = scholarships.filter(s =>
    fieldIncludes(s.metadata?.level, 'Masters') || fieldIncludes(s.metadata?.level, 'PhD') ||
    fieldIncludes(s.tags, 'graduate') || fieldIncludes(s.tags, 'doctoral')
  )

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
            <Link href="/scholarships" className="text-blue-600 font-medium">
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
                className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-smooth font-medium text-blue-600"
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
                className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-smooth font-medium"
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
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Canada Scholarships for Nepali Students
          </h1>
          <p className="text-xl opacity-90 max-w-2xl">
            {scholarships.length} verified scholarships from official sources. All free to apply.
          </p>
        </div>
      </section>

      {/* Filters & Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({scholarships.length})</TabsTrigger>
            <TabsTrigger value="undergraduate">Undergraduate ({undergrad.length})</TabsTrigger>
            <TabsTrigger value="graduate">Graduate ({graduate.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <ScholarshipGrid scholarships={scholarships} />
          </TabsContent>

          <TabsContent value="undergraduate" className="space-y-6">
            <ScholarshipGrid scholarships={undergrad} />
          </TabsContent>

          <TabsContent value="graduate" className="space-y-6">
            <ScholarshipGrid scholarships={graduate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ScholarshipGrid({ scholarships }: { scholarships: Resource[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {scholarships.map((scholarship) => (
        <Card key={scholarship.id} className="hover:shadow-lg transition">
          <CardHeader>
            <div className="flex justify-between items-start mb-3">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                {typeof scholarship.metadata?.level === 'string' ? scholarship.metadata.level : 'Scholarship'}
              </Badge>
              {scholarship.amount && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {scholarship.amount}
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">{scholarship.title}</CardTitle>
            {scholarship.institution && (
              <p className="text-sm text-gray-600 font-medium">{scholarship.institution}</p>
            )}
            <CardDescription className="mt-2">
              {scholarship.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scholarship.deadline && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Deadline:</span>
                <span>{new Date(scholarship.deadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {(Array.isArray(scholarship.tags) ? scholarship.tags.slice(0, 4) : []).map((tag) => (
                <Badge key={String(tag)} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {scholarship.tags?.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {scholarship.url && (
              <Button className="w-full" asChild>
                <a href={scholarship.url} target="_blank" rel="noopener noreferrer">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}