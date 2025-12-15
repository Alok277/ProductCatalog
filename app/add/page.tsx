import Header from '@/components/Header'
import ProductForm from '@/components/ProductForm'

export default function AddProduct() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProductForm />
      </main>
    </div>
  )
}




