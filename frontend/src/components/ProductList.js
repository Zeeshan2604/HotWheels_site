import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import Footer from './Footer';
import { useCart } from "../context/CartContext";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_URL } from "../utils/getApiUrl";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/products`);
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Update search query when URL parameter changes
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/collections`);
        setCategories([{ id: "all", name: "All Categories" }, ...response.data]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category?._id === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.dateCreated) - new Date(a.dateCreated);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return b.isFeatured ? 1 : -1;
    }
  });

  const handleAddToCart = async (product) => {
    const result = await addToCart(product);
    if (!result.success) {
      navigate('/login'); // Redirect to login if not logged in
    } else {
      setToastMessage(result.message); // Show success message
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const handleQuickView = (product, e) => {
    e.stopPropagation();
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  // Loading Skeleton Component
  const ProductSkeleton = () => (
    <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl overflow-hidden animate-pulse border border-zinc-700/50">
      <div className="aspect-square bg-zinc-800"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
        <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-zinc-800 rounded w-16"></div>
          <div className="h-6 bg-zinc-800 rounded w-20"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-zinc-800 rounded w-20"></div>
          <div className="h-10 bg-zinc-800 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  // Quick View Modal
  const QuickViewModal = () => (
    <AnimatePresence>
      {showQuickView && quickViewProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowQuickView(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-zinc-900/90 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-zinc-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-3xl font-bold text-white">{quickViewProduct.name}</h2>
                <button
                  onClick={() => setShowQuickView(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-zinc-800 rounded-2xl overflow-hidden">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-baseline gap-4 mb-6">
                      <span className="text-4xl font-bold text-white">${quickViewProduct.price}</span>
                      {quickViewProduct.oldPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          ${quickViewProduct.oldPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">{quickViewProduct.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                      <span className="px-3 py-1 bg-zinc-800 rounded-full">{quickViewProduct.category?.name}</span>
                      <span>•</span>
                      <span>Stock: {quickViewProduct.countInStock}</span>
                      {quickViewProduct.countInStock <= 5 && (
                        <span className="text-yellow-500 font-bold">• Low Stock</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        handleAddToCart(quickViewProduct);
                        setShowQuickView(false);
                      }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-4 rounded-full text-white font-bold transition-all shadow-lg hover:shadow-red-500/25"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        navigate(`/product/${quickViewProduct._id}`);
                        setShowQuickView(false);
                      }}
                      className="px-8 py-4 border border-zinc-700 hover:bg-zinc-800 rounded-full text-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ProductCard = ({ product, onAddToCart }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className={`bg-zinc-900/80 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300 group 
          hover:shadow-[0_20px_40px_rgba(239,68,68,0.2)] hover:translate-y-[-8px] cursor-pointer border border-zinc-700/50 hover:border-red-500/50 ${
          viewMode === 'list' ? 'flex gap-8 p-6' : ''
        }`}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <div className={`${viewMode === 'list' ? 'w-1/4' : 'w-full'} overflow-hidden relative rounded-xl`}>
          <div className="aspect-square relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
              <div className="flex gap-2">
                <button 
                  onClick={(e) => handleQuickView(product, e)}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105"
                >
                  <i className="fas fa-eye mr-2"></i>Quick View
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-full text-white transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                >
                  <i className="fas fa-cart-plus mr-2"></i>Add to Cart
                </button>
          </div>
            </div>
            
            {/* Stock indicator */}
            {product.countInStock <= 5 && (
              <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                Low Stock
              </div>
            )}
            
            {/* Featured Badge */}
            {product.isFeatured && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                FEATURED
            </div>
          )}
          </div>
        </div>
        
        <div className={`${viewMode === 'list' ? 'flex-1 flex flex-col' : 'p-6'}`}>
          {viewMode === 'list' ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <span>{product.category?.name}</span>
                    <span>•</span>
                    <span>Stock: {product.countInStock}</span>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors">
                  <i className="far fa-heart text-xl"></i>
                </button>
              </div>

              <p className="text-gray-400 mb-6 line-clamp-2">{product.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-300 transition-all duration-300 hover:bg-zinc-700 hover:text-white">
                    {tag}
                  </span>
                ))}
                {product.tags?.length > 3 && (
                  <span className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-400">
                    +{product.tags.length - 3} more
                  </span>
                )}
              </div>

              <div className="product-card-footer mt-auto">
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white group-hover:text-red-500 transition-colors">
                      ${product.price}
                    </span>
                    {product.oldPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ${product.oldPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <i className="fas fa-star text-yellow-500"></i>
                      <span>{product.rating || '4.5'}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white transition-all duration-300 
                        hover:from-red-600 hover:to-red-700 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] 
                        group-hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                </div>
                <button className="text-red-500 hover:text-red-400">
                  <i className="far fa-heart text-xl transition-transform group-hover:scale-110"></i>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-300 transition-all duration-300 hover:bg-zinc-700 hover:text-white">
                    {tag}
                  </span>
                ))}
                {product.tags?.length > 2 && (
                  <span className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-400">
                    +{product.tags.length - 2}
                  </span>
                )}
              </div>
              
              <div className="product-card-footer mt-auto">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors">
                      ${product.price}
                    </span>
                    {product.oldPrice && (
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        ${product.oldPrice}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white transition-all duration-300 
                      hover:from-red-600 hover:to-red-700 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] 
                      group-hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

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
          <div className="text-center max-w-4xl mx-auto mb-16 animate-pulse">
            <div className="h-16 bg-zinc-800 rounded w-1/2 mx-auto mb-6"></div>
            <div className="h-6 bg-zinc-800 rounded w-3/4 mx-auto"></div>
          </div>
          
          {/* Filters skeleton */}
          <div className="flex flex-wrap gap-6 mb-8 animate-pulse">
            <div className="h-12 bg-zinc-800 rounded-full w-96"></div>
            <div className="h-12 bg-zinc-800 rounded-full w-72"></div>
            <div className="h-12 bg-zinc-800 rounded-full w-64"></div>
            <div className="h-12 bg-zinc-800 rounded-full w-24"></div>
          </div>
          
          {/* Products skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
            <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-exclamation-triangle text-3xl text-red-400"></i>
            </div>
            <h2 className="text-2xl text-red-500 mb-4 font-bold">Error Loading Products</h2>
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

        {/* Filters and Products */}
        <section className="py-12 relative z-10 mt-20">
          <div className="container mx-auto px-4">
            {/* Mobile filter toggle */}
            <div className="md:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between p-4 bg-zinc-900/80 backdrop-blur-md rounded-xl text-white border border-zinc-700/50"
              >
                <span>Filters & Search</span>
                <i className={`fas fa-chevron-${showFilters ? 'up' : 'down'}`}></i>
              </button>
            </div>

            {/* Filters */}
            <motion.div 
              className={`${showFilters ? 'block' : 'hidden'} md:block mb-20`}
              initial={false}
              animate={{ height: showFilters ? 'auto' : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-wrap gap-6">
              {/* Search */}
                <div className="w-full md:w-96 relative">
                  <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-zinc-900/80 backdrop-blur-md rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 border border-zinc-700/50 hover:border-red-500/50 transition-colors"
                />
              </div>

                {/* Category Filter */}
              <div className="relative w-full md:w-72">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none w-full px-6 py-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full text-white focus:outline-none focus:border-red-500 hover:border-red-500/50 transition-colors"
                >
                  {categories.map(category => (
                    <option key={category._id || category.id} value={category._id || category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                  <span className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                  <i className="fa-solid fa-chevron-down text-gray-300"></i>
                </span>
              </div>

                {/* Price Range */}
                <div className="w-full md:w-64">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm font-medium">Price:</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-20 px-3 py-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full text-white text-center focus:outline-none focus:border-red-500"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                      className="w-20 px-3 py-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full text-white text-center focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Sort Dropdown */}
              <div className="relative w-full md:w-64">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none w-full px-6 py-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full text-white focus:outline-none focus:border-red-500 hover:border-red-500/50 transition-colors"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                </select>
                  <span className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                  <i className="fa-solid fa-chevron-down text-gray-300"></i>
                </span>
              </div>

                {/* View Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-full transition-all ${
                      viewMode === 'grid' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25' : 'bg-zinc-900/80 backdrop-blur-md text-gray-400 hover:bg-zinc-800/80 border border-zinc-700/50'
                  }`}
                >
                  <i className="fas fa-th text-lg"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                    className={`p-3 rounded-full transition-all ${
                      viewMode === 'list' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25' : 'bg-zinc-900/80 backdrop-blur-md text-gray-400 hover:bg-zinc-800/80 border border-zinc-700/50'
                  }`}
                >
                  <i className="fas fa-list text-lg"></i>
                </button>
              </div>
            </div>
            </motion.div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
            }`}>
              {sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>

            {/* No Results */}
            {sortedProducts.length === 0 && (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-search text-3xl text-red-400"></i>
              </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Products Found</h3>
                <p className="text-gray-400 mb-8">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange([0, 1000]);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all font-bold shadow-lg hover:shadow-red-500/25"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}

            {/* Results count */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-zinc-800">
              <p className="text-gray-400">
                Showing {sortedProducts.length} of {products.length} products
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
      
      {/* Quick View Modal */}
      <QuickViewModal />
      
      {/* Toast Message */}
      {toastMessage && (
        <motion.div 
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <i className="fas fa-check-circle"></i>
          {toastMessage}
        </motion.div>
      )}
    </>
  );
};

export default ProductList; 