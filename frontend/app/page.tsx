'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, GraduationCap, FileText, Briefcase, MessageSquare, DollarSign, Clock, Menu, X, Check, Sparkles } from 'lucide-react'

// Server component wrapper for data fetching
export default function Home() {
  return <HomePage />
}

function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Using placeholder data - in production would fetch from server
  const scholarshipCount = 25
  const jobCount = 15

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Enhanced Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold font-heading bg-gradient-primary bg-clip-text text-transparent">
            Admitto
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            <Link href="/scholarships" className="text-gray-700 hover:text-primary transition-smooth font-medium">
              Scholarships
            </Link>
            <Link href="/visa-guide" className="text-gray-700 hover:text-primary transition-smooth font-medium">
              Visa Guide
            </Link>
            <Link href="/jobs" className="text-gray-700 hover:text-primary transition-smooth font-medium">
              Jobs
            </Link>
            <Link href="/ask-ai" className="text-gray-700 hover:text-primary transition-smooth font-medium">
              Ask AI
            </Link>
            <Link href="/document-review" className="text-gray-700 hover:text-primary transition-smooth font-medium">
              Document Review
            </Link>
          </div>

          <div className="hidden md:block">
            <Button asChild className="bg-primary hover:bg-primary/90 transition-smooth">
              <Link href="/scholarships">Get Started</Link>
            </Button>
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
              <Button asChild className="mt-2">
                <Link href="/scholarships" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative container mx-auto px-4 py-16 md:py-24 text-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
        </div>

        <div className="max-w-5xl mx-auto">
          <Badge className="mb-6 px-4 py-2 bg-gradient-primary text-white border-0 animate-slide-down" variant="secondary">
            <Sparkles className="h-4 w-4 mr-2 inline" />
            Free • Curated • AI-Powered
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-gray-900 mb-6 leading-tight animate-slide-up">
            Stop Paying Consultancies.<br />
            <span className="gradient-text">Start Your Canada Journey Free.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto animate-slide-up delay-100">
            Access {scholarshipCount} verified scholarships, complete visa guides, and AI-powered answers—all in one place. No hidden fees. No scattered information.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up delay-200">
            <Button size="lg" asChild className="text-lg bg-primary hover:bg-primary/90 hover-scale">
              <Link href="/scholarships">
                Browse Scholarships <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg border-primary text-primary hover:bg-primary/10 hover-scale">
              <Link href="/ask-ai">
                Ask AI Assistant
              </Link>
            </Button>
          </div>

          {/* Enhanced Social Proof */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm animate-fade-in delay-300">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-semibold">{scholarshipCount} Scholarships</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="font-semibold">{jobCount} Job Resources</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-semibold">Updated Weekly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-gradient-to-r from-red-50 to-orange-50 border-y border-red-100/50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-4">
              The Problem: Education Consultancies Charge NPR 50,000 - 200,000
            </h2>
            <p className="text-gray-700 text-base md:text-lg mb-8">
              For information that&apos;s already free online. We&apos;ve curated everything you need from official sources—completely free.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <Card className="hover-lift border-red-200 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 font-medium">Scattered across 100+ websites</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift border-red-200 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 font-medium">Outdated or incorrect information</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift border-red-200 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 font-medium">No personalized guidance</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-12 md:mb-16">Everything You Need in One Place</h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <Card className="hover-lift border-blue-200 bg-gradient-to-br from-blue-50 to-white transition-smooth">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="font-heading text-xl">Verified Scholarships</CardTitle>
              <CardDescription className="text-base">
                Curated from official university and government sources. Includes deadlines, amounts, and eligibility.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" asChild className="px-0 text-primary font-semibold">
                <Link href="/scholarships">Browse {scholarshipCount} scholarships <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-lift border-green-200 bg-gradient-to-br from-green-50 to-white transition-smooth">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="font-heading text-xl">Step-by-Step Visa Guide</CardTitle>
              <CardDescription className="text-base">
                Official IRCC requirements, document checklists, processing times, and application tips.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" asChild className="px-0 text-accent font-semibold">
                <Link href="/visa-guide">View visa guide <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-lift border-purple-200 bg-gradient-to-br from-purple-50 to-white transition-smooth">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-warm rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="font-heading text-xl">Job Opportunities</CardTitle>
              <CardDescription className="text-base">
                Part-time jobs, co-op programs, and post-graduation work permit information for international students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" asChild className="px-0 text-secondary font-semibold">
                <Link href="/jobs">Explore job resources <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced AI Feature Highlight */}
      <section className="relative bg-gradient-primary text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <MessageSquare className="h-16 w-16 mx-auto mb-6 animate-float" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">Ask Our AI Assistant Anything</h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-95">
            Get instant, personalized answers about scholarships, visa requirements, and studying in Canada. Powered by RAG technology with verified data.
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-primary hover:bg-white/90 font-semibold hover-scale">
            <Link href="/ask-ai">
              Try AI Assistant
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">Ready to Start Your Canada Journey?</h2>
          <p className="text-lg md:text-xl mb-8 text-slate-300 max-w-2xl mx-auto">
            Join hundreds of Nepali students who are navigating their Canada dreams for free.
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-slate-900 hover:bg-white/90 font-semibold text-lg hover-scale">
            <Link href="/scholarships">
              Get Started Now <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-b from-slate-50 to-slate-100 border-t py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold font-heading text-lg mb-4 bg-gradient-primary bg-clip-text text-transparent">Admitto</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Free, curated, and AI-powered platform helping students study abroad.
              </p>
            </div>
            <div>
              <h4 className="font-semibold font-heading mb-4 text-gray-900">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/scholarships" className="text-gray-600 hover:text-primary transition-smooth">Scholarships</Link></li>
                <li><Link href="/visa-guide" className="text-gray-600 hover:text-primary transition-smooth">Visa Guide</Link></li>
                <li><Link href="/jobs" className="text-gray-600 hover:text-primary transition-smooth">Jobs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold font-heading mb-4 text-gray-900">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-600 hover:text-primary transition-smooth">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-primary transition-smooth">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold font-heading mb-4 text-gray-900">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-gray-600 hover:text-primary transition-smooth">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-primary transition-smooth">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-gray-600">
            <p className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              All information sourced from official channels • © 2025 Admitto
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}