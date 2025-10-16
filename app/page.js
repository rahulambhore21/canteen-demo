'use client';

import { motion } from 'framer-motion';
import { ChefHat, Clock, Star } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex flex-col items-center justify-center px-6 text-white">
      {/* Logo and College Name */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="text-8xl mb-4">🏫</div>
        <h1 className="text-4xl font-bold mb-2">Tech College</h1>
        <h2 className="text-2xl font-semibold mb-4">Canteen</h2>
        <p className="text-orange-100 text-lg">Delicious meals, delivered fresh!</p>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex gap-8 mb-12"
      >
        <div className="text-center">
          <ChefHat size={32} className="mx-auto mb-2" />
          <p className="text-sm text-orange-100">Fresh Food</p>
        </div>
        <div className="text-center">
          <Clock size={32} className="mx-auto mb-2" />
          <p className="text-sm text-orange-100">Quick Service</p>
        </div>
        <div className="text-center">
          <Star size={32} className="mx-auto mb-2" />
          <p className="text-sm text-orange-100">Best Quality</p>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="w-full max-w-sm"
      >
        <Link href="/menu">
          <button className="w-full bg-white text-orange-500 font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all duration-300 transform hover:scale-105">
            Order Now 🍽️
          </button>
        </Link>
      </motion.div>

      {/* Bottom Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="mt-8 text-center"
      >
        <p className="text-orange-100 text-sm">
          Hungry? Browse our menu and order your favorite dishes!
        </p>
      </motion.div>
    </div>
  );
}
