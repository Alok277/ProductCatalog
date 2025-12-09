'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { addProduct, updateProduct } from '@/store/slices/productsSlice'
import { Product } from '@/store/slices/productsSlice'

interface ProductFormProps {
  productId?: string
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const products = useAppSelector((state) => state.products.products)
  
  const existingProduct = productId
    ? products.find((p) => p.id === productId)
    : null

  const [formData, setFormData] = useState({
    name: existingProduct?.name || '',
    price: existingProduct?.price.toString() || '',
    category: existingProduct?.category || '',
    imageUrl: existingProduct?.imageUrl || '',
  })

  const [errors, setErrors] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
  })

  const validateForm = () => {
    const newErrors = {
      name: '',
      price: '',
      category: '',
      imageUrl: '',
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required'
    } else {
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Price must be a positive number'
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }

    if (formData.imageUrl.trim()) {
      const validUrl = /^https?:\/\/.+/i.test(formData.imageUrl.trim())
      if (!validUrl) {
        newErrors.imageUrl = 'Enter a valid image URL (starting with http/https)'
      }
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.price && !newErrors.category && !newErrors.imageUrl
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim(),
      imageUrl: formData.imageUrl.trim(),
    }

    if (existingProduct) {
      dispatch(
        updateProduct({
          ...existingProduct,
          ...productData,
        })
      )
    } else {
      dispatch(addProduct(productData))
    }

    router.push('/')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        {existingProduct ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-soft rounded-2xl p-8 border border-gray-100">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-2">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 ${
                errors.price ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Enter price"
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 ${
                errors.category ? 'border-red-500' : 'border-gray-200'
              }`}
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
              <option value="Books">Books</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports">Sports</option>
              <option value="Toys">Toys</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-800 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/60 ${
                errors.imageUrl ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="https://example.com/product.jpg"
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-soft"
          >
            {existingProduct ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-semibold border border-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

