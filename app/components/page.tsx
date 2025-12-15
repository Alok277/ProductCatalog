import Header from '@/components/Header'
import ComponentsShowcase from '@/components/ComponentsShowcase'

export default function ComponentsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Components</h1>
            {/* <p className="text-gray-600 mt-1">Reusable inputs with success/error/disabled states.</p> */}
          </div>
        </div>
        <ComponentsShowcase />
      </main>
    </div>
  )
}

