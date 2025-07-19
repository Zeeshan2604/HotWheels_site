import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useInView } from 'react-intersection-observer';
import { API_URL } from "../utils/getApiUrl";

const WishlistItem = React.memo(({ item, index, navigate, handleRemoveFromWishlist, handleAddToCart }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      whileHover={{ scale: 1.02, y: -8 }}
      className="group relative h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <motion.div
        className="relative bg-zinc-900/80 backdrop-blur-md rounded-3xl overflow-hidden cursor-pointer border border-zinc-700/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300 h-full flex flex-col"
        onClick={() => navigate(`/product/${item.product._id}`)}
      >
        <div className="aspect-square overflow-hidden flex-shrink-0">
          <img 
            src={item.product?.image} 
            alt={item.product?.name} 
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">{item.product?.name}</h2>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{item.product?.description}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-red-500 transition-all">
              ${item.product?.price.toFixed(2)}
            </span>
            <div className="flex space-x-2">
              <motion.button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleRemoveFromWishlist(item._id);
                }}
                className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-red-500/25 border border-red-400/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-trash text-white text-sm"></i>
              </motion.button>
              <motion.button 
                onClick={(e) => { e.stopPropagation(); handleAddToCart(item.product); }}
                className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-green-500/25 border border-green-400/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-cart-plus text-white text-sm"></i>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  // Memoize wishlistItems mapping (move this up before any return)
  const visibleWishlistItems = useMemo(() => wishlistItems?.filter(item => item?.product), [wishlistItems]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/v1/wishlist`, {
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
      await axios.delete(`${API_URL}/api/v1/wishlist/${itemId}`, {
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

  if (loading) {
    console.log('Wishlist: loading state');
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
            <div className="h-12 bg-zinc-800/50 rounded-xl w-80 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/50">
                  <div className="aspect-square bg-zinc-800/50 rounded-xl mb-4"></div>
                  <div className="h-6 bg-zinc-800/50 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-zinc-800/50 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-zinc-800/50 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('Wishlist: error state');
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
            <h2 className="text-2xl text-red-500 mb-4 font-bold">Error Loading Wishlist</h2>
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

  console.log('Wishlist: rendering', visibleWishlistItems.length, 'WishlistItem components');

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full backdrop-blur-sm border ${
              toast.type === "success" 
                ? "bg-gradient-to-r from-green-500 to-green-600 border-green-400/50" 
                : "bg-gradient-to-r from-red-500 to-red-600 border-red-400/50"
            } text-white font-medium shadow-lg z-50`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          Your Curated Collection
          </motion.h1>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          ></motion.div>
        </motion.div>
        
        {wishlistItems.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-zinc-700/50">
              <i className="fas fa-heart text-3xl text-gray-400"></i>
            </div>
            <div className="text-gray-400 text-lg mb-6">Your wishlist feels lonely...</div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/products" 
                className="inline-block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-full transition-all font-bold shadow-lg hover:shadow-red-500/25 border border-red-400/50"
            >
              Explore Hot Wheels
            </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {visibleWishlistItems?.map((item, index) => {
              console.log('Rendering WishlistItem', item._id, 'at index', index);
              return (
                <WishlistItem
                  key={item._id}
                  item={item}
                  index={index}
                  navigate={navigate}
                  handleRemoveFromWishlist={handleRemoveFromWishlist}
                  handleAddToCart={handleAddToCart}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 