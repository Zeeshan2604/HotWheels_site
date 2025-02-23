import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/api/v1/wishlist", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setWishlistItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/v1/wishlist/${itemId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      setToast({ message: "Removed from wishlist!", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to remove item", type: "error" });
    }
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product);
    if (result.success) {
      setToast({ message: "Added to cart!", type: "success" });
    } else {
      setToast({ message: result.message || "Failed to add to cart", type: "error" });
    }
  };

  // Auto-clear toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) return <div className="text-center py-20 text-zinc-400">Loading your cherished items...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            } text-white font-medium shadow-lg z-50`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto pt-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
          Your Curated Collection
        </h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-zinc-400 text-lg mb-4">Your wishlist feels lonely...</div>
            <Link 
              to="/products" 
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Explore Hot Wheels
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems?.map((item) => {
              if (!item?.product) return null;
              
              return (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item._id * 0.1 }}
                  className="group relative bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/product/${item.product._id}`)}
                >
                  <div className="aspect-square overflow-hidden pointer-events-none">
                    <img 
                      src={item.product?.image} 
                      alt={item.product?.name} 
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="p-6 pointer-events-none">
                    <h2 className="text-xl font-bold text-white mb-2">{item.product?.name}</h2>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{item.product?.description}</p>
                    
                    <div className="flex items-center justify-between pointer-events-auto">
                      <span className="text-2xl font-bold text-red-500">${item.product?.price.toFixed(2)}</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleRemoveFromWishlist(item._id);
                          }}
                          className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all"
                        >
                          <i className="fas fa-trash text-white text-sm"></i>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAddToCart(item.product); }}
                          className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-all"
                        >
                          <i className="fas fa-cart-plus text-white text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 