'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import BottomNav from '../../components/BottomNav';
import CartItem from '../../components/CartItem';
import { storage, calculateTotal } from '../../lib/storage';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    updateCart();
  }, []);

  const updateCart = () => {
    const currentCart = storage.getCart();
    setCart(currentCart);
    setTotal(calculateTotal(currentCart));
  };

  const clearCart = () => {
    storage.clearCart();
    updateCart();
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar title="Cart" showCart={false} />
        
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-sm">
              Looks like you haven't added any items to your cart yet. Browse our delicious menu!
            </p>
            <Link href="/menu">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                Browse Menu
              </button>
            </Link>
          </motion.div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar title="Cart" showCart={false} />
      
      <div className="px-4 py-6">
        {/* Cart Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
          </h2>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium"
          >
            <Trash2 size={18} />
            Clear All
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          <AnimatePresence>
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdate={updateCart}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Service Charge</span>
              <span>₹0</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-orange-500">₹{total}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Checkout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/checkout">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3">
              <ShoppingBag size={20} />
              Proceed to Checkout • ₹{total}
            </button>
          </Link>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}