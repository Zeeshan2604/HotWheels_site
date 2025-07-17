import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import Footer from './Footer';
import { API_URL } from "../utils/getApiUrl";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const { addToCart, addToWishlist, wishlistItems } = useCart();
  const [toastMessage, setToastMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isInWishlist = wishlistItems?.some(item => item.product?._id === product?._id) ?? false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/products/${id}`);
        setProduct(response.data);
        
        // Fetch related products
        if (response.data.category?._id) {
          const relatedResponse = await axios.get(`${API_URL}/api/v1/products?category=${response.data.category._id}&limit=4`);
          setRelatedProducts(relatedResponse.data.filter(p => p._id !== response.data._id));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    const result = await addToCart({ ...product, quantity });
    setIsAddingToCart(false);
    
    if (!result.success) {
      navigate('/login'); // Redirect to login if not logged in
    } else {
      setToastMessage(result.message); // Show success message
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const handleAddToWishlist = async () => {
    const result = await addToWishlist(product._id);
    if (result.success) {
      setToastMessage(result.message); // Show success message
      setTimeout(() => setToastMessage(""), 3000);
    } else {
      // Handle error (e.g., show a message)
      console.error(result.message);
    }
  };

  const ProductGallery = ({ images }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
      if (!isZoomed) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    };

    return (
      <div className="space-y-6">
        {/* Main Image Container */}
        <motion.div 
          className="relative aspect-square bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl overflow-hidden group cursor-zoom-in border border-zinc-700/50 backdrop-blur-sm"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setShowImageModal(true)}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.img
            src={images[selectedImage]}
            alt="Main product"
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={{
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            loading="lazy"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Zoom Hint */}
          <motion.div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity border border-zinc-600/50"
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
          >
            <i className="fas fa-search-plus mr-2"></i>
            Click to enlarge
          </motion.div>
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-zinc-600/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-chevron-left"></i>
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-zinc-600/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-chevron-right"></i>
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {images.map((image, index) => (
            <motion.div
              key={index}
                className={`relative aspect-square cursor-pointer rounded-2xl overflow-hidden border-2 transition-all bg-gradient-to-br from-zinc-800 to-zinc-900 ${
                  selectedImage === index ? 'border-red-500 scale-105 shadow-lg shadow-red-500/25' : 'border-transparent hover:border-zinc-600'
              }`}
                onClick={() => setSelectedImage(index)}
              whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Overlay for multiple images */}
              {index === images.length - 1 && images.length > 8 && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white font-medium">
                  +{images.length - 8}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        )}
      </div>
    );
  };

  // Image Modal
  const ImageModal = () => (
    <AnimatePresence>
      {showImageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full transition-colors border border-zinc-600/50"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            
            <div className="relative aspect-square bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl overflow-hidden border border-zinc-700/50">
              <img
                src={product.images[selectedImage]}
                alt="Product"
                className="w-full h-full object-contain"
                loading="lazy"
              />
              
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(selectedImage === 0 ? product.images.length - 1 : selectedImage - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full border border-zinc-600/50"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={() => setSelectedImage(selectedImage === product.images.length - 1 ? 0 : selectedImage + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full border border-zinc-600/50"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}
            </div>
            
            <div className="text-center mt-4 text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full inline-block mx-auto">
              {selectedImage + 1} of {product.images.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Related Products Component
  const RelatedProducts = () => (
    <motion.div 
      className="mt-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="text-center mb-12">
        <motion.h3 
          className="text-3xl font-bold bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Related Products
        </motion.h3>
        <motion.div 
          className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto mt-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        ></motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct, index) => (
          <motion.div
            key={relatedProduct._id}
            className="group relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <motion.div
              className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl overflow-hidden cursor-pointer border border-zinc-700/50 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300"
              onClick={() => navigate(`/product/${relatedProduct._id}`)}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-white mb-3 line-clamp-2 group-hover:text-red-400 transition-colors">{relatedProduct.name}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">${relatedProduct.price}</span>
                  <motion.button 
                    className="text-red-500 hover:text-red-400 transition-colors"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <i className="fas fa-arrow-right"></i>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white pt-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="flex gap-2 mb-8">
              <div className="h-4 bg-zinc-800 rounded w-16"></div>
              <div className="h-4 bg-zinc-800 rounded w-4"></div>
              <div className="h-4 bg-zinc-800 rounded w-20"></div>
              <div className="h-4 bg-zinc-800 rounded w-4"></div>
              <div className="h-4 bg-zinc-800 rounded w-24"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Image skeleton */}
              <div className="space-y-6">
                <div className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700/50"></div>
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700/50"></div>
                  ))}
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-8">
              <div className="space-y-4">
                <div className="h-8 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                  <div className="h-6 bg-zinc-800 rounded w-1/4"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-zinc-800 rounded w-1/3"></div>
                  <div className="h-4 bg-zinc-800 rounded w-full"></div>
                  <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-zinc-800 rounded w-16"></div>
                  <div className="h-8 bg-zinc-800 rounded w-20"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-zinc-800 rounded-xl"></div>
                  <div className="h-12 bg-zinc-800 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white pt-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-6xl mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🚗
            </motion.div>
            <h2 className="text-2xl bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-4">Error Loading Product</h2>
            <p className="text-gray-400 mb-8">{error}</p>
            <div className="flex gap-4 justify-center">
              <motion.button 
            onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 rounded-full transition-all border border-zinc-600/50 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
          >
            Go Back
              </motion.button>
              <motion.button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white pt-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        ></motion.div>
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        ></motion.div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Breadcrumb */}
        <motion.nav 
          className="flex items-center gap-2 text-sm text-gray-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button 
            onClick={() => navigate('/')} 
            className="hover:text-white transition-colors hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Home
          </motion.button>
          <span>/</span>
          <motion.button 
            onClick={() => navigate('/products')} 
            className="hover:text-white transition-colors hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Products
          </motion.button>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProductGallery images={product.images} />
          </motion.div>

          {/* Product Details */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm rounded-3xl p-8 border border-zinc-700/50">
              <div className="flex items-center gap-3 mb-4">
                <motion.h1 
                  className="text-4xl font-bold bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
          >
                  {product.name}
                </motion.h1>
                {product.isFeatured && (
                  <motion.span 
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full font-bold border border-red-400/50"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    Featured
                  </motion.span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-gray-400 mb-6 flex-wrap">
                <span className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700/50">
                  <i className="fas fa-tag text-red-400"></i>
                  {product.category?.name}
                </span>
                <span className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700/50">
                  <i className="fas fa-box text-blue-400"></i>
                  Stock: {product.countInStock}
                </span>
                {product.countInStock <= 5 && (
                  <span className="text-yellow-500 flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/30">
                    <i className="fas fa-exclamation-triangle"></i>
                    Low Stock
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline gap-4 mb-6">
                <motion.span 
                  className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  ${product.price}
                </motion.span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.oldPrice}
                  </span>
                )}
                {product.oldPrice && (
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-3 py-1 rounded-full border border-green-400/50">
                    Save ${(product.oldPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star ${i < (product.rating || 4.5) ? 'text-yellow-500' : 'text-gray-600'}`}
                    ></i>
                  ))}
                </div>
                <span className="text-gray-400">({product.rating || 4.5})</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">Based on 127 reviews</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm rounded-3xl p-8 border border-zinc-700/50">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Shipping Information */}
            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm rounded-3xl p-6 border border-zinc-700/50">
              <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Shipping Information</h3>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <i className="fas fa-shipping-fast text-blue-400"></i>
                  <div>
                    <p className="text-white font-medium text-sm">Free Shipping (2+ items)</p>
                    <span className="text-green-400 font-bold text-xs">FREE</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-truck text-yellow-400"></i>
                  <div>
                    <p className="text-white font-medium text-sm">Standard (1 item)</p>
                    <span className="text-yellow-400 font-bold text-xs">$9.99</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-info-circle text-green-400"></i>
                  <div>
                    <p className="text-green-400 font-medium text-sm">Pro Tip</p>
                    <p className="text-green-300 text-xs">Add more for free shipping!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm rounded-3xl border border-zinc-700/50">
                <div className="flex items-center gap-2">
                  <motion.button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 
                      flex items-center justify-center text-red-500 transition-all border border-zinc-600/50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="fas fa-minus"></i>
                  </motion.button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <motion.button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 
                      flex items-center justify-center text-red-500 transition-all border border-zinc-600/50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="fas fa-plus"></i>
                  </motion.button>
                </div>
                <motion.button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 h-12 rounded-full 
                    transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-500/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isAddingToCart ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-cart-plus"></i>
                  Add to Cart
                    </>
                  )}
                </motion.button>
              </div>
              
              <motion.button 
                onClick={handleAddToWishlist}
                className={`w-full h-12 rounded-full transition-all flex items-center justify-center gap-2 border backdrop-blur-sm ${
                  isInWishlist 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 cursor-default border-green-500/50' 
                    : 'bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 hover:from-zinc-700/50 hover:to-zinc-600/50 border-zinc-600/50'
                }`}
                disabled={isInWishlist}
                initial={false}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {isInWishlist ? (
                    <motion.span
                      key="added"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.i 
                        className="fas fa-check text-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <span>Added to Wishlist</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.i 
                        className="far fa-heart text-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <span>Add to Wishlist</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              
              <div className="flex flex-col gap-4">
                <motion.button 
                          onClick={() => navigate(`/game/${product._id}`)}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 border border-blue-500/50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                        >
                          <i className="fas fa-cube text-white"></i>
                          View in 3D
                </motion.button>
                      </div>
            </div>

            {/* Additional Details */}
            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm rounded-3xl p-8 border border-zinc-700/50">
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Product Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Release Date</p>
                  <p className="font-medium">{new Date(product.dateCreated).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Scale</p>
                  <p className="font-medium">1:64</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Material</p>
                  <p className="font-medium">Die-cast metal</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Series</p>
                  <p className="font-medium">{product.category?.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Condition</p>
                  <p className="font-medium">New in Box</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Shipping</p>
                  <p className="font-medium">Free shipping</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && <RelatedProducts />}
      </div>

      {/* Image Modal */}
      <ImageModal />

      {/* Toast Message */}
      <AnimatePresence>
      {toastMessage && (
          <motion.div 
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 border border-green-400/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
          {toastMessage}
          </motion.div>
      )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default SingleProduct; 