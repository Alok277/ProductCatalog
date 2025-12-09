import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Product {
  id: string
  name: string
  price: number
  category: string
  imageUrl?: string
}

interface ProductsState {
  products: Product[]
}

const initialState: ProductsState = {
  products: [],
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Omit<Product, 'id'>>) => {
      const newProduct: Product = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        imageUrl: action.payload.imageUrl?.trim() || '',
      }
      state.products.push(newProduct)
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = {
          ...action.payload,
          imageUrl: action.payload.imageUrl?.trim() || '',
        }
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload)
    },
  },
})

export const { addProduct, updateProduct, deleteProduct } = productsSlice.actions
export default productsSlice.reducer

