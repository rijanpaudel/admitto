import { supabase } from '@/lib/supabase'
import type { Resource } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, CheckCircle2, DollarSign } from 'lucide-react'
import Link from 'next/link'

async function getVisaResources() {
  const { data } = await supabase
    .from('resources')
    .select('*')
    .eq('category', 'visa')
    .order('created_at', { ascending: false })

  return (data as Resource[]) || []
}

export default async function VisaGuidePage() {
  const visaResources = await getVisaResources()

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
            <Link href="/visa-guide" className="text-blue-600 font-medium">
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
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Canada Study Permit Guide
          </h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Complete step-by-step guide to applying for your Canadian study permit. All official sources.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Timeline Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-8">Application Process</h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Get Acceptance Letter from DLI',
                description: 'Apply to a Designated Learning Institution and receive your letter of acceptance. This is mandatory for study permit.',
                duration: '2-6 months'
              },
              {
                step: 2,
                title: 'Obtain PAL/TAL Attestation Letter',
                description: 'Get Provincial or Territorial Attestation Letter from the province where you\'ll study (Quebec requires CAQ).',
                duration: '4-8 weeks'
              },
              {
                step: 3,
                title: 'Gather Required Documents',
                description: 'Proof of identity (passport), proof of financial support, academic transcripts, language test scores (IELTS/TOEFL), medical exam results.',
                duration: '2-4 weeks'
              },
              {
                step: 4,
                title: 'Apply Online via IRCC',
                description: 'Create IRCC account, complete application form, upload documents, pay CAD $150 application fee.',
                duration: '1-2 days'
              },
              {
                step: 5,
                title: 'Biometrics Appointment',
                description: 'Book and attend biometrics appointment at VAC in Kathmandu (fingerprints and photo). Fee: CAD $85.',
                duration: '1-2 weeks'
              },
              {
                step: 6,
                title: 'Wait for Decision',
                description: 'IRCC processes your application. Check processing times regularly. You may be asked for additional documents.',
                duration: '8-12 weeks from Nepal'
              },
              {
                step: 7,
                title: 'Receive Study Permit',
                description: 'Get approval letter, then receive study permit at Canadian port of entry when you arrive.',
                duration: 'Upon arrival'
              }
            ].map((item) => (
              <Card key={item.step} className="hover:shadow-lg transition">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-800 font-bold text-lg">{item.step}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold">{item.title}</h3>
                        <Badge variant="outline">{item.duration}</Badge>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-6">Required Documents Checklist</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Valid passport (6+ months validity)',
                  'Letter of acceptance from DLI',
                  'PAL/TAL attestation letter',
                  'Proof of financial support (bank statements, scholarship letters)',
                  'Academic transcripts and certificates',
                  'IELTS/TOEFL scores (minimum 6.0 overall)',
                  'Medical examination results',
                  'Police clearance certificate',
                  'Statement of purpose',
                  'Passport-size photographs',
                  'Proof of payment (application + biometrics fees)',
                  'Family information form (IMM 5707)'
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{doc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Official Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Official Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {visaResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <Badge className="w-fit mb-2" variant="secondary">
                    {String(resource.metadata?.resource_type || 'Official')}
                  </Badge>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline" asChild>
                    <a href={resource.url || '#'} target="_blank" rel="noopener noreferrer">
                      Visit Official Site <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Financial Requirements */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/50 hover-lift transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                <DollarSign className="h-6 w-6 text-yellow-600" />
                Financial Requirements (2025)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Tuition:</strong> First year tuition fees (varies by program, typically $15,000-$30,000 CAD)</p>
              <p><strong>Living Expenses:</strong> $20,635 CAD per year (outside Quebec) or $11,000 CAD per year (Quebec)</p>
              <p><strong>Total for 1 year:</strong> Approximately $35,000-$50,000 CAD</p>
              <p className="text-sm text-gray-700 mt-4">Note: You must show you have this amount available in bank statements or scholarship letters</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}