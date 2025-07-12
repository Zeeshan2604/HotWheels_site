import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      // Reset subscription status after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05),transparent_50%)]"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <i className="fas fa-car text-white text-lg"></i>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent">
                HotWheelsX
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Premium die-cast models for collectors and enthusiasts. Discover the world's finest Hot Wheels collection.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full flex items-center justify-center text-white transition-all shadow-lg hover:shadow-blue-500/25"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-facebook"></i>
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 rounded-full flex items-center justify-center text-white transition-all shadow-lg hover:shadow-cyan-500/25"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-twitter"></i>
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full flex items-center justify-center text-white transition-all shadow-lg hover:shadow-pink-500/25"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-instagram"></i>
              </motion.a>
              <motion.a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center text-white transition-all shadow-lg hover:shadow-red-500/25"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-youtube"></i>
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 group">
                  <i className="fas fa-home text-sm group-hover:text-red-400 transition-colors"></i>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 group">
                  <i className="fas fa-th-large text-sm group-hover:text-red-400 transition-colors"></i>
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 group">
                  <i className="fas fa-shopping-bag text-sm group-hover:text-red-400 transition-colors"></i>
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/game" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 group">
                  <i className="fas fa-cube text-sm group-hover:text-red-400 transition-colors"></i>
                  3D Experience
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 group">
                  <i className="fas fa-heart text-sm group-hover:text-red-400 transition-colors"></i>
                  Wishlist
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Account & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Account & Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 group">
                  <i className="fas fa-user text-sm group-hover:text-red-400 transition-colors"></i>
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 group">
                  <i className="fas fa-shopping-cart text-sm group-hover:text-red-400 transition-colors"></i>
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 group">
                  <i className="fas fa-shopping-basket text-sm group-hover:text-red-400 transition-colors"></i>
                  Shopping Cart
                </Link>
              </li>
              <li>
                <a href="mailto:support@hotwheelsx.com" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 group">
                  <i className="fas fa-envelope text-sm group-hover:text-red-400 transition-colors"></i>
                  Contact Support
                </a>
              </li>
              <li>
                <a href="tel:+1-800-HOTWHEELS" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 group">
                  <i className="fas fa-phone text-sm group-hover:text-red-400 transition-colors"></i>
                  Call Us
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Stay Updated</h4>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Subscribe to get exclusive offers, new releases, and collector tips delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all text-white placeholder-gray-400"
                  required
                />
                <i className="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
              <motion.button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all font-bold shadow-lg hover:shadow-red-500/25 border border-red-400/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubscribed ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-check"></i>
                    Subscribed!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-paper-plane"></i>
                    Subscribe
                  </span>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="pt-8 border-t border-zinc-700/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              &copy; 2024 HotWheelsX. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-red-400 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-red-400 transition-colors">Terms of Service</a>
              <a href="/shipping" className="hover:text-red-400 transition-colors">Shipping Info</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 