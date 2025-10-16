'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Truck, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import BottomNav from '../../components/BottomNav';
import OrderCard from '../../components/OrderCard';
import { storage } from '../../lib/storage';

function TrackContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const allOrders = storage.getOrders();
    setOrders(allOrders);

    if (orderId) {
      const order = allOrders.find(o => o.id === orderId);
      setSelectedOrder(order);
      
      // Auto-update order status for demo
      if (order && order.status === 'preparing') {
        setTimeout(() => {
          storage.updateOrderStatus(orderId, 'ready');
          setSelectedOrder(prev => ({ ...prev, status: 'ready' }));
        }, 10000); // 10 seconds
        
        setTimeout(() => {
          storage.updateOrderStatus(orderId, 'delivered');
          setSelectedOrder(prev => ({ ...prev, status: 'delivered' }));
        }, 20000); // 20 seconds
      }
    }
  }, [orderId]);

  const getStatusProgress = (status) => {
    switch (status) {
      case 'preparing': return 33;
      case 'ready': return 66;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const statusSteps = [
    { key: 'preparing', label: 'Preparing', icon: <Clock size={24} />, description: 'Your order is being prepared' },
    { key: 'ready', label: 'Ready', icon: <CheckCircle size={24} />, description: 'Ready for pickup' },
    { key: 'delivered', label: 'Delivered', icon: <Truck size={24} />, description: 'Order delivered' }
  ];

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar title="Track Order" />
        
        <div className="px-4 py-6">
          {/* Order Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Order #{selectedOrder.id}</h2>
              <p className="text-gray-600">
                Placed on {new Date(selectedOrder.timestamp).toLocaleDateString()} at{' '}
                {new Date(selectedOrder.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                {statusSteps.map((step, index) => {
                  const isActive = statusSteps.findIndex(s => s.key === selectedOrder.status) >= index;
                  const isCompleted = statusSteps.findIndex(s => s.key === selectedOrder.status) > index;
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {step.icon}
                      </div>
                      <p className={`text-xs font-medium text-center ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${getStatusProgress(selectedOrder.status)}%` }}
                ></div>
              </div>
            </div>

            {/* Current Status */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {statusSteps.find(s => s.key === selectedOrder.status)?.label}
              </h3>
              <p className="text-gray-600">
                {statusSteps.find(s => s.key === selectedOrder.status)?.description}
              </p>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <MapPin size={20} className="text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Pickup Location</p>
                  <p className="text-sm text-gray-600">College Canteen, Ground Floor</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Contact</p>
                  <p className="text-sm text-gray-600">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <OrderCard order={selectedOrder} />
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Link href="/menu">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors">
                Order More Food
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
      <Navbar title="Track Orders" />
      
      <div className="px-4 py-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-8xl mb-6">📦</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
              <p className="text-gray-600 mb-8">
                You haven't placed any orders. Start by browsing our menu!
              </p>
              <Link href="/menu">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                  Browse Menu
                </button>
              </Link>
            </motion.div>
          </div>
        ) : (
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-gray-900 mb-6"
            >
              Your Orders ({orders.length})
            </motion.h2>
            
            <div className="space-y-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/track?orderId=${order.id}`}>
                    <div className="block hover:shadow-md transition-shadow">
                      <OrderCard order={order} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}