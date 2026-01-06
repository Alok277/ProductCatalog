"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

export default function Header() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white/80 backdrop-blur shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Product Catalog
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary transition-colors font-semibold"
            >
              Products
            </Link>
            <Link
              href="/components"
              className="text-gray-700 hover:text-primary transition-colors font-semibold"
            >
              Components
            </Link>
            <Link
              href="/venn-diagram"
              className="text-gray-700 hover:text-primary transition-colors font-semibold"
            >
              Venn Diagram Implementation
            </Link>
            <Link
              href="/venn-diagram-two"
              className="text-gray-700 hover:text-primary transition-colors font-semibold"
            >
              Venn Diagram Two
            </Link>
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-primary transition-colors font-semibold"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
