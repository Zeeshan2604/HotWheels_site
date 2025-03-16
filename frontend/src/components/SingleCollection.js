import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import Footer from './Footer';

const SingleCollection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchCollectionAndProducts = async () => {
      try {
        const [collectionRes, productsRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/v1/collections/${id}`),
          axios.get(`http://localhost:3000/api/v1/products`, {
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

  const NoProducts = () => (
    <div className="col-span-full text-center py-12">
      <h3 className="text-2xl text-gray-400 mb-4">No products found in this collection</h3>
      <button
        onClick={() => navigate('/products')}
        className="px-6 py-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
      >
        Browse All Products
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-800 rounded w-1/4 mb-8"></div>
            <div className="h-40 bg-zinc-800 rounded-2xl mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl text-red-500 mb-4">Error Loading Collection</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-8 px-6 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={collection.image}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate('/collections')} className="hover:text-white transition-colors">
              Collections
            </button>
            <span>/</span>
            <span className="text-white">{collection.name}</span>
          </nav>

          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent 
                bg-gradient-to-r from-white via-red-500 to-white">
                {collection.name}
              </h1>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                {collection.description}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {collection.tags?.map(tag => (
                  <span 
                    key={tag}
                    className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm 
                      text-white border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* Collection Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-500 mb-2">{products.length}</div>
                  <div className="text-gray-400">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-500 mb-2">
                    {products.length > 0 ? `$${Math.min(...products.map(p => p.price))}+` : 'N/A'}
                  </div>
                  <div className="text-gray-400">Starting Price</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-500 mb-2">
                    {products.length > 0 ? products.reduce((acc, p) => acc + (p.stock || 0), 0) : 0}
                  </div>
                  <div className="text-gray-400">Total Stock</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-gradient-to-b from-black via-zinc-950 to-black">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Collection Products</h2>
            <p className="text-gray-400">Explore our exclusive selection of premium models</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="bg-zinc-900 rounded-xl overflow-hidden group hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] 
                transition-all duration-300"
              >
                <div 
                  className="aspect-square overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 
                    className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors">
                      ${product.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-6 py-2 bg-red-500 rounded-full text-white transition-all duration-300 
                        hover:bg-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] 
                        group-hover:scale-105 active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : <NoProducts />}
          </div>

          {/* Collection Footer */}
          {products.length > 0 && (
            <div className="mt-20 text-center">
              <p className="text-gray-400 mb-6">
                Can't find what you're looking for? Check out our other collections
              </p>
              <button
                onClick={() => navigate('/collections')}
                className="px-8 py-3 bg-zinc-800 rounded-full hover:bg-zinc-700 
                  transition-colors inline-flex items-center gap-2"
              >
                View All Collections
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      </section>

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

      <Footer />
    </div>
  );
};

export default SingleCollection; 