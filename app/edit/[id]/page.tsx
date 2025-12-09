import Header from '@/components/Header'
import ProductForm from '@/components/ProductForm'

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProductForm productId={id} />
      </main>
    </div>
  )
}

