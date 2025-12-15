# Product Catalog - CRUD Application with Redux Toolkit

A modern Product Catalog application built with Next.js 14 and Redux Toolkit, featuring full CRUD operations and global state management.

## Features

- ✅ **Product Management (CRUD)**
  - Add new products with auto-generated IDs
  - View all products in a table format
  - Edit existing products
  - Delete products with confirmation

- ✅ **Shopping Cart**
  - Add products to cart
  - Update cart quantities
  - Remove items from cart
  - View cart total
  - Cart count displayed in header

- ✅ **Global State Management**
  - Redux Toolkit for centralized state
  - Separate slices for products and cart
  - Type-safe state management with TypeScript

- ✅ **Form Validation**
  - Required field validation
  - Price validation (must be positive number)
  - Real-time error feedback
  - Controlled components

- ✅ **Modern UI**
  - Tailwind CSS for styling
  - Responsive design
  - Clean and intuitive interface

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **UI Components:** Custom components with Tailwind

## Project Structure

```
ProductCatalog/
├── app/
│   ├── add/              # Add product page
│   ├── edit/[id]/        # Edit product page
│   ├── cart/             # Cart page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page (product list)
│   └── globals.css       # Global styles
├── components/
│   ├── Header.tsx        # Header with navigation and cart count
│   ├── ProductList.tsx  # Product table/list component
│   ├── ProductForm.tsx  # Add/Edit product form
│   ├── Cart.tsx         # Shopping cart component
│   └── ReduxProvider.tsx # Redux provider wrapper
├── store/
│   ├── store.ts         # Redux store configuration
│   ├── hooks.ts         # Typed Redux hooks
│   └── slices/
│       ├── productsSlice.ts  # Products state slice
│       └── cartSlice.ts      # Cart state slice
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProductCatalog
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Adding a Product

1. Click "Add New Product" button on the home page
2. Fill in the form:
   - Product Name (required)
   - Price (required, must be positive number)
   - Category (required, select from dropdown)
3. Click "Add Product" to save

### Editing a Product

1. Click "Edit" button next to any product in the list
2. Modify the product details
3. Click "Update Product" to save changes

### Deleting a Product

1. Click "Delete" button next to any product
2. Confirm the deletion in the dialog

### Adding to Cart

1. Click "Add to Cart" button next to any product
2. The cart count in the header will update automatically
3. Click "Cart" in the header to view cart items

### Managing Cart

- Update quantities using the quantity input field
- Remove items using the "Remove" button
- Clear entire cart using "Clear Cart" button
- View total price at the bottom of the cart

## Product Data Structure

Each product contains:
- **id:** Auto-generated unique identifier
- **name:** Product name (string)
- **price:** Product price (number)
- **category:** Product category (string)

## State Management

The application uses Redux Toolkit with two main slices:

1. **Products Slice:** Manages product CRUD operations
   - `addProduct` - Add new product
   - `updateProduct` - Update existing product
   - `deleteProduct` - Delete product

2. **Cart Slice:** Manages shopping cart
   - `addToCart` - Add product to cart
   - `removeFromCart` - Remove product from cart
   - `updateCartQuantity` - Update item quantity
   - `clearCart` - Clear all cart items

## Form Validation

- All fields are required
- Price must be a positive number
- Real-time validation feedback
- Error messages displayed below invalid fields

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for technical assessment purposes.

## Author

Built as part of a technical assessment for VivaConnect/Helo.ai




