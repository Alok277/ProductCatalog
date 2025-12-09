import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product, updateProduct } from './productsSlice'

interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        // Always refresh item details in case the product was edited
        existingItem.name = action.payload.name
        existingItem.price = action.payload.price
        existingItem.category = action.payload.category
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    updateCartQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id)
        } else {
          item.quantity = action.payload.quantity
        }
      }
    },
    clearCart: (state) => {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateProduct, (state, action) => {
      // Sync cart item details when a product is edited
      const item = state.items.find((cartItem) => cartItem.id === action.payload.id)
      if (item) {
        item.name = action.payload.name
        item.price = action.payload.price
        item.category = action.payload.category
      }
    })
  },
})

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer

