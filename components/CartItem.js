'use client';

import { Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { storage } from '../lib/storage';
import toast from 'react-hot-toast';

export default function CartItem({ item, onUpdate }) {
  const handleIncrement = () => {
    const newQuantity = item.quantity + 1;
    storage.updateQuantity(item.id, newQuantity);
    onUpdate();
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleDecrement = () => {
    const newQuantity = item.quantity - 1;
    if (newQuantity <= 0) {
      storage.removeFromCart(item.id);
      toast.success(`${item.name} removed from cart`);
    } else {
      storage.updateQuantity(item.id, newQuantity);
    }
    onUpdate();
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleRemove = () => {
    storage.removeFromCart(item.id);
    toast.success(`${item.name} removed from cart`);
    onUpdate();
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">{item.image}</div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <p className="text-orange-500 font-bold">₹{item.price}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-50 rounded-lg">
            <button
              onClick={handleDecrement}
              className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="px-3 py-1 font-medium">{item.quantity}</span>
            <button
              onClick={handleIncrement}
              className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-bold text-lg">₹{item.price * item.quantity}</span>
        </div>
      </div>
    </motion.div>
  );
}