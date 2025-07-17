import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import Footer from './Footer';
import { API_URL } from "../utils/getApiUrl";

const SingleCollection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState("");
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    const fetchCollectionAndProducts = async () => {
      try {
        const [collectionRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/api/v1/collections/${id}`),
          axios.get(`${API_URL}/api/v1/products`, {
            params: {
              category: id
            }
          })
        ]);
        setCollection(collectionRes.data);
        setProducts(productsRes.data);
        console.log('Products fetched:', productsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCollectionAndProducts();
  }, [id]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage("Added to cart!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Sort and filter products
  const sortedAndFilteredProducts = products
    .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        default:
          return b.isFeatured ? 1 : -1;
      }
    });

  const NoProducts = () => (
    <div className="col-span-full text-center py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-car text-3xl text-red-400"></i>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">No products found</h3>
        <p className="text-gray-400 mb-8">Try adjusting your filters or check back later for new arrivals</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              setSortBy('featured');
              setPriceRange([0, 1000]);
            }}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all font-bold shadow-lg hover:shadow-red-500/25"
          >
            Clear Filters
          </button>
      <button
        onClick={() => navigate('/products')}
            className="px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 rounded-full transition-all font-bold"
      >
        Browse All Products
      </button>
        </div>
      </motion.div>
    </div>
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white pt-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          {/* Hero skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-800 rounded w-1/4 mb-8"></div>
            <div className="h-40 bg-zinc-800 rounded-2xl mb-12"></div>
            {/* Stats skeleton */}
            <div className="grid grid-cols-3 gap-8 mb-16">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center">
                  <div className="h-10 bg-zinc-800 rounded mb-2"></div>
                  <div className="h-4 bg-zinc-800 rounded w-20 mx-auto"></div>
                </div>
              ))}
            </div>
            {/* Products skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-zinc-800 rounded-xl aspect-square"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white pt-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-md mx-auto py-20">
            <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-6 animate-bounce"></i>
            <h2 className="text-2xl text-red-500 mb-4 font-bold">Error Loading Collection</h2>
            <p className="text-gray-400 mb-8">{error}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all font-bold text-lg shadow-lg hover:shadow-red-500/25"
              >
                Try Again
              </button>
          <button 
            onClick={() => navigate(-1)}
                className="px-8 py-4 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 rounded-full transition-all font-bold text-lg"
          >
            Go Back
          </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white pt-20 relative overflow-hidden">
      {/* Animated Background with Collection Image */}
      <div className="absolute inset-0">
        {/* Collection Image Background */}
        <div className="absolute inset-0">
          <img
            src={collection.image}
            alt={collection.name}
            className="w-full h-full object-cover opacity-10"
            loading="lazy"
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <section className="relative py-5 overflow-hidden w-full">
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-gray-400 mb-6"
            >
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate('/collections')} className="hover:text-white transition-colors">
              Collections
            </button>
            <span>/</span>
            <span className="text-white">{collection.name}</span>
            </motion.nav>
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="mb-6"
              >
              </motion.div>
              <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-red-100 to-orange-100 bg-clip-text text-transparent"
            >
                {collection.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto"
              >
                {collection.description}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap gap-3 justify-center mb-4"
              >
                {collection.tags?.map(tag => (
                  <span 
                    key={tag}
                    className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm text-white border border-white/20 hover:bg-white/20 transition-colors font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
              {/* Collection Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex items-center justify-center gap-8 mt-4"
              >
                <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/60 backdrop-blur-md rounded-full border border-zinc-700/50">
                  <i className="fas fa-box text-red-400"></i>
                  <span className="text-white font-bold">{products.length} Products</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/60 backdrop-blur-md rounded-full border border-zinc-700/50">
                  <i className="fas fa-tag text-red-400"></i>
                  <span className="text-white font-bold">
                    {products.length > 0 ? `$${Math.min(...products.map(p => p.price))}+` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/60 backdrop-blur-md rounded-full border border-zinc-700/50">
                  <i className="fas fa-warehouse text-red-400"></i>
                  <span className="text-white font-bold">
                    {products.length > 0 ? products.reduce((acc, p) => acc + (p.countInStock || 0), 0) : 0} Stock
                  </span>
                </div>
              </motion.div>
            </div>
                  </div>
        </section>
        {/* Products Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Section Header with Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
                              {/* Filters and Controls */}
                <div className="flex flex-col lg:flex-row gap-4 justify-center items-center mb-6">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="px-6 py-3 bg-zinc-900/80 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer backdrop-blur-md border border-zinc-700/50 hover:border-red-500/50 transition-colors"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                    <option value="newest">Newest</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
                {/* Price Range Filter */}
                <div className="flex items-center gap-3 bg-zinc-900/80 rounded-full px-6 py-3 backdrop-blur-md border border-zinc-700/50 hover:border-red-500/50 transition-colors">
                  <span className="text-gray-400 font-bold">Price:</span>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                    className="accent-red-500 w-24"
                  />
                  <span className="text-white font-bold">${priceRange[0]}</span>
                  <span className="text-gray-400">-</span>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                    className="accent-red-500 w-24"
                  />
                  <span className="text-white font-bold">${priceRange[1]}</span>
                  </div>
                {/* View Mode Toggle */}
                <div className="flex bg-zinc-900/80 rounded-full p-1 backdrop-blur-md border border-zinc-700/50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-full transition-all ${
                      viewMode === 'grid' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <i className="fas fa-th"></i>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-full transition-all ${
                      viewMode === 'list' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </motion.div>
            {/* Products Grid/List */}
            <div className={`gap-6 ${
              viewMode === 'grid'
                ? 'grid md:grid-cols-2 lg:grid-cols-4'
                : 'space-y-4'
            }`}>
              {sortedAndFilteredProducts.length === 0 ? (
                <NoProducts />
              ) : (
                sortedAndFilteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-xl hover:shadow-[0_20px_40px_rgba(239,68,68,0.2)] border border-zinc-700/50 hover:border-red-500/50 transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'aspect-square bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-md'
                        : 'flex items-center bg-zinc-900/80 hover:bg-zinc-800/80 backdrop-blur-md'
                    }`}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        <img
                          alt={product.name}
                          src={product.images?.[0]}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        {/* Featured Badge */}
                        {product.isFeatured && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            FEATURED
                          </div>
                        )}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">{product.name}</h3>
                            {product.tags && product.tags.length > 0 && (
                              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                {product.tags[0]}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                            {product.description || 'Explore our exclusive premium model'}
                          </p>
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            <button className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold">
                              View Product <i className="fa-solid fa-arrow-right"></i>
                            </button>
          </div>
        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            alt={product.name}
                            src={product.images?.[0]}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{product.name}</h3>
                            {product.tags && product.tags.length > 0 && (
                              <div className="flex gap-2">
                                {product.tags.slice(0, 2).map(tag => (
                                  <span key={tag} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-gray-400 mb-3">
                            {product.description || 'Explore our exclusive premium model'}
                          </p>
                          <button className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold">
                            View Product <i className="fa-solid fa-arrow-right"></i>
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuickView(false)}
          >
              <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedProduct.name}</h2>
                <button
                  onClick={() => setShowQuickView(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-gray-300">
                    {selectedProduct.description || "Premium die-cast model with exceptional detail and craftsmanship."}
                  </p>
                  <div className="text-3xl font-bold text-white">
                    ${selectedProduct.price}
                  </div>
                  <div className="text-sm text-gray-400">
                    Stock: {selectedProduct.countInStock || 0} available
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setShowQuickView(false);
                      }}
                      className="flex-1 px-6 py-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        navigate(`/product/${selectedProduct._id}`);
                        setShowQuickView(false);
                      }}
                      className="flex-1 px-6 py-3 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
              </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Message */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white 
            px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2"
        >
          <i className="fas fa-check-circle"></i>
          {toastMessage}
        </motion.div>
      )}
    </div>
  );
};

export default SingleCollection; 