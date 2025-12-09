'use client'

import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { deleteProduct } from '@/store/slices/productsSlice'
import { addToCart } from '@/store/slices/cartSlice'
import { Product } from '@/store/slices/productsSlice'
import Link from 'next/link'
import ConfirmModal from './ConfirmModal'

export default function ProductList() {
  const products = useAppSelector((state) => state.products.products)
  const dispatch = useAppDispatch()
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; productId: string | null }>({
    isOpen: false,
    productId: null,
  })

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ isOpen: true, productId: id })
  }

  const handleDeleteConfirm = () => {
    if (deleteModal.productId) {
      dispatch(deleteProduct(deleteModal.productId))
      setDeleteModal({ isOpen: false, productId: null })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, productId: null })
  }

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product))
  }

  const placeholderImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=60'

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-soft border border-gray-100">
        <p className="text-gray-600 text-lg mb-4">No products found.</p>
        <Link
          href="/add"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-semibold shadow-soft"
        >
          Add Your First Product
        </Link>
      </div>
    )
  }

  const productToDelete = deleteModal.productId
    ? products.find((p) => p.id === deleteModal.productId)
    : null

  return (
    <>
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Product"
        message={
          productToDelete
            ? `Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`
            : 'Are you sure you want to delete this product?'
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmButtonColor="red"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const imageSrc = product.imageUrl?.trim() || placeholderImage
          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-soft border border-gray-100 flex flex-col overflow-hidden hover:-translate-y-1 transition-transform"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = placeholderImage
                  }}
                />
                <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div>
                  <p className="text-sm text-gray-500">#{product.id.substring(0, 6)}</p>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                </div>
                <p className="text-xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
                <div className="mt-auto flex gap-3">
                  <Link
                    href={`/edit/${product.id}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-semibold text-secondary border border-secondary rounded-lg hover:bg-secondary hover:text-white transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(product.id)}
                    className="flex items-center justify-center px-3 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-soft"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

