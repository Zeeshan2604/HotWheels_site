import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../utils/getApiUrl";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/collections`
      );
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Get unique tags from all collections
  const allTags = [...new Set(categories.flatMap(cat => cat.tags || []))];

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = filterTag === "all" || category.tags?.includes(filterTag);
    return matchesSearch && matchesTag;
  });

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
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="h-16 bg-zinc-800 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-6 bg-zinc-800 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 bg-zinc-800 rounded-lg w-3/4 mx-auto animate-pulse"></div>
          </div>
          {/* Search skeleton */}
          <div className="max-w-xl mx-auto mb-16">
            <div className="h-14 bg-zinc-800 rounded-full animate-pulse"></div>
          </div>
          {/* Grid skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-[4/5] bg-zinc-800 rounded-2xl animate-pulse"></div>
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
            <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-6 animate-bounce"></i>
            <h2 className="text-2xl font-bold mb-4">Failed to Load Collections</h2>
            <p className="text-gray-400 mb-8">We're having trouble loading the collections. Please try again.</p>
            <button 
              onClick={fetchCategories}
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
      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <section className="py-20">
          <div className="text-center max-w-4xl mx-auto ">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-8"
            >
              
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-red-100 to-orange-100 bg-clip-text text-transparent"
            >
                Our Collections
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-1xl text-gray-200 leading-relaxed"
            >
                Explore our curated collections of premium die-cast models, from classic cars to modern supercars.
            </motion.p>
            </div>
        </section>
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-zinc-900/80 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 backdrop-blur-md border border-zinc-700/50"
                />
                <i className="fas fa-search absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-6 py-4 bg-zinc-900/80 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer backdrop-blur-md border border-zinc-700/50"
              >
                <option value="all">All Categories</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <i className="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
            {/* View Mode Toggle */}
            <div className="flex bg-zinc-900/80 rounded-full p-1 backdrop-blur-md border border-zinc-700/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 rounded-full transition-colors ${
                  viewMode === 'grid' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25' : 'text-gray-400 hover:text-white'
                }`}
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-full transition-colors ${
                  viewMode === 'list' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25' : 'text-gray-400 hover:text-white'
                }`}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </motion.div>
        {/* Categories Grid/List */}
        <div className={`gap-8 ${
          viewMode === 'grid'
            ? 'grid md:grid-cols-2 lg:grid-cols-4'
            : 'space-y-4'
        }`}>
          {filteredCategories.map((category, index) => (
                <motion.div
                  key={category._id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => navigate(`/collection/${category._id}`)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-xl hover:shadow-[0_20px_40px_rgba(239,68,68,0.2)] border border-zinc-700/50 hover:border-red-500/50 transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'aspect-[4/5] bg-gradient-to-br from-zinc-900/80 to-zinc-800/80'
                  : 'flex items-center bg-zinc-900/80 hover:bg-zinc-800/80 backdrop-blur-md'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  <img
                    alt={category.name}
                    src={category.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Featured Badge */}
                  {category.isFeatured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      FEATURED
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">{category.name}</h3>
                      {category.tags && category.tags.length > 0 && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          {category.tags[0]}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                      {category.description || 'Explore our exclusive collection of premium models'}
                    </p>
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <button className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold">
                        View Collection <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      alt={category.name}
                      src={category.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{category.name}</h3>
                      {category.tags && category.tags.length > 0 && (
                        <div className="flex gap-2">
                          {category.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                              {tag}
                            </span>
              ))}
            </div>
                      )}
              </div>
                    <p className="text-gray-400 mb-3">
                      {category.description || 'Explore our exclusive collection of premium models'}
                  </p>
                    <button className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold">
                      View Collection <i className="fa-solid fa-arrow-right"></i>
                  </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
          </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoriesList; 