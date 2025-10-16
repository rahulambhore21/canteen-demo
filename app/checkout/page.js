'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Wallet, User, Hash } from 'lucide-react';
import Navbar from '../../components/Navbar';
import BottomNav from '../../components/BottomNav';
import { storage, calculateTotal } from '../../lib/storage';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    paymentMethod: 'upi'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentCart = storage.getCart();
    if (currentCart.length === 0) {
      router.push('/cart');
      return;
    }
    setCart(currentCart);
    setTotal(calculateTotal(currentCart));
  }, [router]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.rollNumber.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const orderData = {
      items: cart,
      total: total,
      customerInfo: {
        name: formData.name,
        rollNumber: formData.rollNumber,
        paymentMethod: formData.paymentMethod
      }
    };

    const order = storage.addOrder(orderData);
    storage.clearCart();
    
    // Navigate to confirmation page
    router.push(`/confirmation?orderId=${order.id}`);
    
    setIsLoading(false);
  };

  const paymentMethods = [
    { id: 'upi', label: 'UPI Payment', icon: <Smartphone size={20} /> },
    { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard size={20} /> },
    { id: 'cash', label: 'Cash on Delivery', icon: <Wallet size={20} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar title="Checkout" />
      
      <div className="px-4 py-6">
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6"
        >
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 mb-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between font-bold text-orange-500">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </motion.div>

        {/* Customer Information Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}  
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash size={16} className="inline mr-2" />
                  Roll Number *
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your roll number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.paymentMethod === method.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    {method.icon}
                    <span className="font-medium">{method.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 px-6 rounded-xl transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Processing...
              </div>
            ) : (
              `Place Order • ₹${total}`
            )}
          </button>
        </motion.form>
      </div>

      <BottomNav />
    </div>
  );
}