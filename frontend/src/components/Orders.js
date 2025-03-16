import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/v1/orders/user', {
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
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/v1/orders/${orderId}`, 
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

  if (loading) return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-zinc-800 rounded w-64 mb-8"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-xl p-6">
              <div className="h-6 bg-zinc-800 rounded w-48 mb-4"></div>
              <div className="h-4 bg-zinc-800 rounded w-64 mb-2"></div>
              <div className="h-4 bg-zinc-800 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black text-red-500 py-20 text-center">
      Error: {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Order History</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 mb-4">No orders found</p>
            <Link 
              to="/products" 
              className="inline-block bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 rounded-xl overflow-hidden"
              >
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></span>
                      <h2 className="text-xl font-bold">Order #{order._id.slice(-6).toUpperCase()}</h2>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.dateOrdered).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <button 
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="text-gray-400 hover:text-white transition-colors"
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
                      className="p-6 border-t border-zinc-800"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Order Items */}
                        <div>
                          <h3 className="text-lg font-bold mb-4">Items</h3>
                          <div className="space-y-4">
                            {order.orderItems.map(item => (
                              <div key={item._id} className="flex items-center gap-4">
                                <img 
                                  src={item.product?.image} 
                                  alt={item.product?.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium">{item.product?.name}</p>
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
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <h3 className="text-lg font-bold mb-2">Shipping Address</h3>
                              <p className="text-gray-400">
                                {order.shippingAddress.address}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                {order.shippingAddress.zip}, {order.shippingAddress.country}<br />
                                Phone: {order.shippingAddress.phone}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">Payment Method</h3>
                              <p className="text-gray-400">Credit Card (Mock Payment)</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold mb-2">Order Total</h3>
                            <p className="text-2xl font-bold text-red-500">
                              ${order.totalPrice?.toFixed(2)}
                            </p>
                          </div>

                          {order.status === 'pending' && (
                            <button
                              onClick={() => cancelOrder(order._id)}
                              className="px-4 py-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/30 transition-colors"
                            >
                              Cancel Order
                            </button>
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