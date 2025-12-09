'use client'

import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { removeFromCart, updateCartQuantity, clearCart } from '@/store/slices/cartSlice'
import Link from 'next/link'
import ConfirmModal from './ConfirmModal'

export default function Cart() {
  const cartItems = useAppSelector((state) => state.cart.items)
  const dispatch = useAppDispatch()
  const [clearCartModal, setClearCartModal] = useState(false)
  const [checkoutInfoModal, setCheckoutInfoModal] = useState(false)
  const placeholderImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=60'

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleQuantityChange = (id: string, quantity: number) => {
    const nextQuantity = Math.max(1, quantity)
    dispatch(updateCartQuantity({ id, quantity: nextQuantity }))
  }

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id))
  }

  const handleClearCartClick = () => {
    setClearCartModal(true)
  }

  const handleClearCartConfirm = () => {
    dispatch(clearCart())
    setClearCartModal(false)
  }

  const handleClearCartCancel = () => {
    setClearCartModal(false)
  }

  const handleCheckoutClick = () => {
    setCheckoutInfoModal(true)
  }

  const handleCheckoutClose = () => {
    setCheckoutInfoModal(false)
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <>
      <ConfirmModal
        isOpen={clearCartModal}
        title="Clear Cart"
        message="Are you sure you want to clear all items from your cart? This action cannot be undone."
        confirmText="Clear Cart"
        cancelText="Cancel"
        onConfirm={handleClearCartConfirm}
        onCancel={handleClearCartCancel}
        confirmButtonColor="red"
      />
      <ConfirmModal
        isOpen={checkoutInfoModal}
        title="Checkout"
        message="Checkout flow is not implemented in this demo. You can integrate your payment or order processing here."
        confirmText="Got it"
        cancelText="Close"
        onConfirm={handleCheckoutClose}
        onCancel={handleCheckoutClose}
        confirmButtonColor="green"
      />
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Shopping Cart</h2>
          <button
            onClick={handleClearCartClick}
            className="text-red-600 hover:text-red-700 font-semibold border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear Cart
          </button>
        </div>

      <div className="bg-white shadow-soft rounded-2xl overflow-hidden border border-gray-100">
        <table className="min-w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {cartItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.imageUrl?.trim() || placeholderImage}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = placeholderImage
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                      aria-label={`Decrease quantity for ${item.name}`}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                      }
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                      aria-label={`Increase quantity for ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-700 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                Total:
              </td>
              <td colSpan={2} className="px-6 py-4 text-lg font-bold text-gray-900">
                ₹{total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6 flex gap-4">
        <Link
          href="/"
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors text-center font-medium"
        >
          Continue Shopping
        </Link>
        <button
          onClick={handleCheckoutClick}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Checkout
        </button>
      </div>
    </div>
    </>
  )
}

