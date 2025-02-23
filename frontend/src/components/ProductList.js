import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import Footer from './Footer';
import { useCart } from "../context/CartContext";
import { useSearchParams, useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/products");
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
        const response = await axios.get("http://localhost:3000/api/v1/collections");
        setCategories([{ id: "all", name: "All Categories" }, ...response.data]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
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
        className={`bg-zinc-900 rounded-xl overflow-hidden transition-all duration-300 group 
          hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:translate-y-[-8px] ${
          viewMode === 'list' ? 'flex gap-8 p-6' : ''
        }`}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <div className={`${viewMode === 'list' ? 'w-1/4' : 'w-full'} overflow-hidden relative rounded-xl`}>
          <div className="aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          {viewMode === 'list' && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
              <button className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full text-white border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                Quick View
              </button>
            </div>
          )}
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
                    {product.isFeatured && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <span>{product.category?.name}</span>
                    <span>•</span>
                    <span>Stock: {product.stock}</span>
                    {product.stock <= 5 && (
                      <span className="text-yellow-500">• Low Stock</span>
                    )}
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors">
                  <i className="far fa-heart text-xl"></i>
                </button>
              </div>

              <p className="text-gray-400 mb-6 line-clamp-2">{product.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-300 transition-all duration-300 hover:bg-zinc-700 hover:text-white">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="product-card-footer mt-auto p-4">
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
                      className="px-8 py-3 bg-red-500 rounded-full text-white transition-all duration-300 
                        hover:bg-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] 
                        group-hover:scale-105 active:scale-95"
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
                  <h3 className={`${viewMode === 'list' ? 'text-2xl' : 'text-xl'} font-bold text-white mb-2 group-hover:text-red-500 transition-colors`}>
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                </div>
                <button className="text-red-500 hover:text-red-400">
                  <i className="far fa-heart text-xl transition-transform group-hover:scale-110"></i>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-300 transition-all duration-300 hover:bg-zinc-700 hover:text-white">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="product-card-footer mt-auto p-4">
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
                    className="px-6 py-2 bg-red-500 rounded-full text-white transition-all duration-300 
                      hover:bg-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] 
                      group-hover:scale-105 active:scale-95"
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
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            {/* Add loading skeleton here */}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl text-red-500 mb-4">Error Loading Products</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-zinc-900 to-black">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Our Products
              </h1>
              <p className="text-xl text-gray-400">
                Discover our extensive collection of premium die-cast models
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Products */}
        <section className="py-12 bg-zinc-950">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-6 mb-8">
              {/* Search */}
              <div className="w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3 bg-zinc-900 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Category Filter with improved dropdown styling */}
              <div className="relative w-full md:w-72">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none w-full px-5 py-3 bg-zinc-800 border border-zinc-700 rounded-full text-white focus:outline-none focus:border-red-500"
                >
                  {categories.map(category => (
                    <option key={category._id || category.id} value={category._id || category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-chevron-down text-gray-300"></i>
                </span>
              </div>

              {/* Sort Dropdown with improved styling */}
              <div className="relative w-full md:w-64">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full px-5 py-3 bg-zinc-800 border border-zinc-700 rounded-full text-white focus:outline-none focus:border-red-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-chevron-down text-gray-300"></i>
                </span>
              </div>

              {/* View Toggle with updated grid icon */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-full ${
                    viewMode === 'grid' ? 'bg-red-500 text-white' : 'bg-zinc-900 text-gray-400'
                  }`}
                >
                  <i className="fas fa-th text-lg"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-full ${
                    viewMode === 'list' ? 'bg-red-500 text-white' : 'bg-zinc-900 text-gray-400'
                  }`}
                >
                  <i className="fas fa-list text-lg"></i>
                </button>
              </div>
            </div>

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
              <div className="text-center py-20">
                <h3 className="text-2xl text-white mb-4">No Products Found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default ProductList; 