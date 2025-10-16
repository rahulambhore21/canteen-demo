'use client';

import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { storage, getCartItemCount } from '../lib/storage';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar({ title, showBack = true, showCart = true }) {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = storage.getCart();
      setCartCount(getCartItemCount(cart));
    };

    updateCartCount();
    
    // Listen for storage changes to update cart count
    const handleStorageChange = () => updateCartCount();
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for cart updates within the same tab
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
        
        {showCart && (
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}