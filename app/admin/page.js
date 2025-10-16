'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, TrendingUp, DollarSign, Package, Star, LogOut, Eye, EyeOff } from 'lucide-react';
import Navbar from '../../components/Navbar';
import BottomNav from '../../components/BottomNav';
import OrderCard from '../../components/OrderCard';
import { storage } from '../../lib/storage';
import { menuData } from '../../data/menuData';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    popularItems: []
  });

  useEffect(() => {
    const user = storage.getUser();
    if (user && user.role === 'admin') {
      setIsLoggedIn(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = () => {
    const allOrders = storage.getOrders();
    setOrders(allOrders);

    // Calculate stats
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Calculate popular items
    const itemCounts = {};
    allOrders.forEach(order => {
      order.items.forEach(item => {
        if (itemCounts[item.id]) {
          itemCounts[item.id].quantity += item.quantity;
        } else {
          itemCounts[item.id] = {
            ...item,
            quantity: item.quantity
          };
        }
      });
    });

    const popularItems = Object.values(itemCounts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    setStats({
      totalOrders: allOrders.length,
      totalRevenue,
      popularItems
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = storage.adminLogin(loginData.username, loginData.password);
    
    if (user) {
      setIsLoggedIn(true);
      loadDashboardData();
      toast.success('Welcome back, Admin!');
    } else {
      toast.error('Invalid credentials. Try admin/1234');
    }
  };

  const handleLogout = () => {
    storage.logout();
    setIsLoggedIn(false);
    setLoginData({ username: '', password: '' });
    toast.success('Logged out successfully');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    storage.updateOrderStatus(orderId, newStatus);
    loadDashboardData();
    toast.success(`Order status updated to ${newStatus}`);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar title="Admin Login" showBack={false} showCart={false} />
        
        <div className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={40} className="text-orange-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h1>
                <p className="text-gray-600">Please login to access the dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Login
                </button>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  <strong>Demo Credentials:</strong><br />
                  Username: admin<br />
                  Password: 1234
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar title="Admin Dashboard" showBack={false} showCart={false} />
      
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, Admin!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-green-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Popular Items */}
        {stats.popularItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star size={20} className="text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Popular Items</h3>
            </div>
            <div className="space-y-3">
              {stats.popularItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.image}</span>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{item.quantity} sold</p>
                    <p className="text-sm text-gray-500">#{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Orders ({orders.length})
          </h3>
          
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <Package size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="relative">
                  <OrderCard order={order} />
                  
                  {/* Admin Controls */}
                  <div className="mt-3 flex gap-2 px-4">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        order.status === 'preparing'
                          ? 'bg-orange-500 text-white'
                          : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                      }`}
                    >
                      Preparing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        order.status === 'ready'
                          ? 'bg-green-500 text-white'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      Ready
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        order.status === 'delivered'
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      Delivered
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}