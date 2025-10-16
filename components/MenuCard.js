'use client';

import { Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { storage } from '../lib/storage';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function MenuCard({ item }) {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const cart = storage.getCart();
    const cartItem = cart.find(cartItem => cartItem.id === item.id);
    setQuantity(cartItem ? cartItem.quantity : 0);
  }, [item.id]);

  const handleAddToCart = () => {
    storage.addToCart(item);
    setQuantity(prev => prev + 1);
    toast.success(`${item.name} added to cart!`);
    
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    storage.updateQuantity(item.id, newQuantity);
    setQuantity(newQuantity);
    
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleDecrement = () => {
    const newQuantity = quantity - 1;
    if (newQuantity <= 0) {
      storage.removeFromCart(item.id);
      setQuantity(0);
      toast.success(`${item.name} removed from cart`);
    } else {
      storage.updateQuantity(item.id, newQuantity);
      setQuantity(newQuantity);
    }
    
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative"
    >
      {item.popular && (
        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Popular
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-4xl mb-2">{item.image}</div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-orange-500">₹{item.price}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {item.category}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {quantity === 0 ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between bg-orange-50 rounded-lg p-2">
            <button
              onClick={handleDecrement}
              className="bg-white hover:bg-gray-50 text-orange-500 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
            >
              <Minus size={18} />
            </button>
            <span className="font-semibold text-orange-600 text-lg">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="bg-orange-500 hover:bg-orange-600 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}