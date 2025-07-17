import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import Footer from './Footer';
import { API_URL } from "../utils/getApiUrl";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/v1/orders/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'processing': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'shipped': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'delivered': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'cancelled': return 'bg-gradient-to-r from-red-500 to-pink-500';
      default: return 'bg-gradient-to-r from-gray-500 to-zinc-500';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/v1/orders/${orderId}`, 
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (err) {
      setError('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="animate-pulse space-y-8">
            <div className="h-12 bg-zinc-800/50 rounded-xl w-80 mb-8"></div>
          {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/50">
                <div className="h-8 bg-zinc-800/50 rounded w-64 mb-4"></div>
                <div className="h-4 bg-zinc-800/50 rounded w-80 mb-2"></div>
                <div className="h-4 bg-zinc-800/50 rounded w-48"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-exclamation-triangle text-3xl text-red-400"></i>
            </div>
            <h2 className="text-2xl text-red-500 mb-4 font-bold">Error Loading Orders</h2>
            <p className="text-gray-400 mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all font-bold text-lg shadow-lg hover:shadow-red-500/25"
            >
              Try Again
            </button>
          </div>
        </div>
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Order History
          </motion.h1>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={inView ? { width: 96 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          ></motion.div>
        </motion.div>
        
        {orders.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-zinc-700/50">
              <i className="fas fa-shopping-bag text-3xl text-gray-400"></i>
            </div>
            <p className="text-xl text-gray-400 mb-6">No orders found</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/products" 
                className="inline-block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-8 py-4 rounded-full transition-all font-bold shadow-lg hover:shadow-red-500/25 border border-red-400/50"
            >
              Start Shopping
            </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-zinc-900/80 backdrop-blur-md rounded-2xl overflow-hidden border border-zinc-700/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all duration-300"
              >
                <div className="p-6 border-b border-zinc-700/50 flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)} shadow-lg`}></div>
                      <h2 className="text-xl font-bold text-white">Order #{order._id.slice(-6).toUpperCase()}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(order.status)} shadow-lg`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.dateOrdered).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <button 
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800/50 rounded-full"
                  >
                    <i className={`fas fa-chevron-${expandedOrder === order._id ? 'up' : 'down'}`}></i>
                  </button>
                </div>

                <AnimatePresence>
                  {expandedOrder === order._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 border-t border-zinc-700/50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Order Items */}
                        <div>
                          <h3 className="text-lg font-bold mb-4 text-white">Items</h3>
                          <div className="space-y-4">
                            {order.orderItems.map(item => (
                              <div key={item._id} className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl backdrop-blur-sm border border-zinc-700/50">
                                <img 
                                  src={item.product?.image} 
                                  alt={item.product?.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div>
                                  <p className="font-medium text-white">{item.product?.name}</p>
                                  <p className="text-gray-400 text-sm">
                                    {item.quantity} x ${item.product?.price?.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 gap-6 mb-6">
                            <div className="p-4 bg-zinc-800/50 rounded-xl backdrop-blur-sm border border-zinc-700/50">
                              <h3 className="text-lg font-bold mb-2 text-white">Shipping Address</h3>
                              <p className="text-gray-400 text-sm">
                                {order.shippingAddress.address}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                {order.shippingAddress.zip}, {order.shippingAddress.country}<br />
                                Phone: {order.shippingAddress.phone}
                              </p>
                            </div>
                            <div className="p-4 bg-zinc-800/50 rounded-xl backdrop-blur-sm border border-zinc-700/50">
                              <h3 className="text-lg font-bold mb-2 text-white">Payment Method</h3>
                              <p className="text-gray-400 text-sm">Credit Card (Mock Payment)</p>
                            </div>
                          </div>

                          <div className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl backdrop-blur-sm border border-red-500/20">
                            <h3 className="text-lg font-bold mb-2 text-white">Order Total</h3>
                            <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                              ${order.totalPrice?.toFixed(2)}
                            </p>
                          </div>

                          {order.status === 'pending' && (
                            <motion.button
                              onClick={() => cancelOrder(order._id)}
                              className="px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 rounded-full hover:from-red-500/30 hover:to-red-600/30 transition-all border border-red-500/30 hover:border-red-500/50"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Cancel Order
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders; 