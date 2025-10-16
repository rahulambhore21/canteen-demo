'use client';

import { Clock, CheckCircle, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderCard({ order }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'preparing':
        return <Clock className="text-orange-500" size={20} />;
      case 'ready':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'delivered':
        return <Truck className="text-blue-500" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'ready':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'delivered':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.timestamp).toLocaleDateString()} at{' '}
            {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="text-sm font-medium">{getStatusText(order.status)}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.image}</span>
                <span className="text-sm text-gray-700">{item.name} × {item.quantity}</span>
              </div>
              <span className="text-sm font-medium">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-lg text-orange-500">₹{order.total}</span>
        </div>

        {order.customerInfo && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Student:</span>
                <p className="font-medium">{order.customerInfo.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Roll No:</span>
                <p className="font-medium">{order.customerInfo.rollNumber}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}