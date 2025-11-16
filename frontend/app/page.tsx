import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Resource } from '@/lib/supabase'

async function getRecentResources() {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)
  
  if (error) {
    console.error('Error fetching resources:', error)
    return []
  }
  
  return data as Resource[]
}

export default async function Home() {
  const resources = await getRecentResources()

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Nepali Abroad Helper
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your Complete Guide to Studying in Canada 🇨🇦
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Find scholarships, navigate visa processes, and discover job opportunities - all in one place
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/scholarships"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Scholarships
            </Link>
            <Link 
              href="/visa-guide"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Visa Information
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold mb-2">Scholarships</h3>
            <p className="text-gray-600">
              Discover fully-funded and partial scholarships from top Canadian universities
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">✈️</div>
            <h3 className="text-xl font-bold mb-2">Visa Guidance</h3>
            <p className="text-gray-600">
              Step-by-step guide to Canadian study permits and visa applications
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold mb-2">Job Opportunities</h3>
            <p className="text-gray-600">
              Find part-time jobs and internships available for international students
            </p>
          </div>
        </div>

        {/* Recent Resources */}
        {resources.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Latest Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                  <div className="text-sm text-blue-600 font-semibold mb-2 uppercase">
                    {resource.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                  {resource.url && (
                    <a 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Learn More →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Nepali Abroad Helper - Empowering Nepali Students</p>
        </div>
      </footer>
    </main>
  )
}