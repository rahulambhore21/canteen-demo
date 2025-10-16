'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import BottomNav from '../../components/BottomNav';
import { storage } from '../../lib/storage';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      const orders = storage.getOrders();
      const foundOrder = orders.find(o => o.id === orderId);
      setOrder(foundOrder);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar title="Order Confirmed" showBack={false} showCart={false} />
      
      <div className="px-4 py-6">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully! 🎉</h1>
          <p className="text-gray-600">Your delicious food is being prepared</p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Order #{order.id}</h2>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.timestamp).toLocaleDateString()} at{' '}
              {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.image}</span>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-xl font-bold text-orange-500">₹{order.total}</span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Customer Details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Name:</span> {order.customerInfo.name}</p>
                <p><span className="font-medium">Roll No:</span> {order.customerInfo.rollNumber}</p>
                <p><span className="font-medium">Payment:</span> {order.customerInfo.paymentMethod.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Estimated Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-orange-500" />
            <h3 className="font-semibold text-orange-900">Estimated Preparation Time</h3>
          </div>
          <p className="text-orange-800">Your order will be ready in approximately <span className="font-bold">15-20 minutes</span></p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <Link href={`/track?orderId=${order.id}`}>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3">
              <Clock size={20} />
              Track Your Order
              <ArrowRight size={20} />
            </button>
          </Link>

          <Link href="/menu">
            <button className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-colors">
              Order More Food
            </button>
          </Link>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}