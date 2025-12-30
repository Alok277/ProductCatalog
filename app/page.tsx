import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <Link
            href="/add"
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-semibold shadow-soft"
          >
            Add New Product
          </Link>
        </div>
        <ProductList />
      </main>
    </div>
  );
}
