import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // For navigation
import { useProducts } from '../hooks/useProducts';
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { Canvas } from '@react-three/fiber';
import { Stage, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { Model } from './Model';  // Import the Model component we just created
import { useCart } from "../context/CartContext";
import axios from 'axios';
import { API_URL } from "../utils/getApiUrl";

const HomePage = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const { addToCart } = useCart();
  // const { latestProducts, collections, featuredProducts } = useProducts();
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();
  const [featuredProductsState, setFeaturedProductsState] = useState([]);
  const [collectionsState, setCollectionsState] = useState([]);
  const [latestProductsState, setLatestProductsState] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const featuredRes = await axios.get(`${API_URL}/api/v1/products?isFeatured=true`);
        const collectionsRes = await axios.get(`${API_URL}/api/v1/collections`);
        const latestRes = await axios.get(`${API_URL}/api/v1/products?sort=-dateCreated&limit=3`);
        
        setFeaturedProductsState(featuredRes.data);
        setCollectionsState(collectionsRes.data);
        setLatestProductsState(latestRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleMute = (e) => {
    e.preventDefault();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Hero Section
  const HeroSection = () => {
    return (
      <section
        id="navbar_hero"
        className="relative min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-hidden"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          className="absolute top-0 left-0 w-full h-full object-cover filter brightness-50"
        >
          <source
            src={"/uploads/hot-wheels.mp4"}
            type="video/mp4"
          />
        </video>

        {/* Hero Section Content */}
        <div className="relative h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 pt-16 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Experience Miniature
                <br />
                <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">Engineering Marvel</span>
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Discover our exclusive collection of precision-crafted die-cast
                cars, where every detail tells a story of automotive excellence.
              </motion.p>
              <motion.div 
                className="flex flex-col md:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/collections"
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all font-bold shadow-lg shadow-red-500/25 border border-red-400/50 backdrop-blur-sm"
                  >
                    Explore Collection
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button 
                    className="px-8 py-3 border border-white/50 hover:bg-white/10 backdrop-blur-sm rounded-full transition-all font-bold"
                    onClick={() => {
                      const randomProduct = featuredProductsState[Math.floor(Math.random() * featuredProductsState.length)];
                      navigate(`/game/${randomProduct._id}`);
                    }}
                  >
                    View in 3D
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
          <motion.div 
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-4xl"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></div>
          </motion.div>
        </div>

        {/* Mute Button */}
        <motion.button
          type="button"
          className="absolute bottom-8 right-8 bg-black/50 backdrop-blur-sm hover:bg-black/80 text-white p-3 rounded-full transition-all cursor-pointer border border-white/20"
          onClick={handleMute}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i
            className={`fa-solid ${
              isMuted ? "fa-volume-mute" : "fa-volume-up"
            } text-2xl`}
          />
        </motion.button>
      </section>
    );
  };

  // Featured Collections Section
  const CollectionsSection = () => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    });

    return (
      <section className="py-16 md:py-20 bg-black from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-8 md:py-16 relative z-10"
        >
          <div className="text-center mb-8 md:mb-12">
            <motion.h2 
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Featured Collections
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={inView ? { width: 96 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            ></motion.div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 px-4 md:px-10 overflow-x-auto pb-4 lg:pb-10">
            {collectionsState.map((collection, index) => (
              <motion.div
                key={collection._id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <motion.div
                  className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl overflow-hidden cursor-pointer border border-zinc-700/50 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300"
                  onClick={() => navigate(`/collection/${collection._id}`)}
                >
                  <div className="aspect-square">
                    <img
                      src={`/hotwheels/${collection.image.replace(/^.*[\\\/]/, '')}`}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3 md:p-6">
                    <div>
                      <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-white group-hover:text-red-400 transition-colors line-clamp-2">{collection.name}</h3>
                      <motion.div
                        className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 md:gap-2 text-xs md:text-base"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        Explore Collection
                        <i className="fa-solid fa-arrow-right"></i>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center mt-6 md:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/collections"
                className="px-6 md:px-8 py-3 bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white text-black rounded-full transition-all font-bold shadow-lg shadow-white/25 border border-white/50 backdrop-blur-sm flex items-center gap-2 mx-auto w-fit text-sm md:text-base"
              >
                View All Collections
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    );
  };

  // Latest Products Section
  const LatestProductsSection = () => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
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

    return (
      <section className="py-20 text-white">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Latest Arrivals
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={inView ? { width: 96 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            ></motion.div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 justify-items-center">
            {latestProductsState.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -8 }}
                className="group relative w-full max-w-xs h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <motion.div
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="relative w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl overflow-hidden cursor-pointer border border-zinc-700/50 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-square overflow-hidden flex-shrink-0">
                    <img
                      src={`/hotwheels/${product.image.replace(/^.*[\\\/]/, '')}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-4 md:p-6 flex flex-col flex-1">
                    <h3 className="text-base md:text-xl font-bold mb-2 group-hover:text-red-400 transition-colors line-clamp-2 flex-shrink-0">
                      {product.name}
                    </h3>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0 mt-auto">
                      <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-red-500 transition-all">
                        ${product.price}
                      </span>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-full md:w-auto px-3 md:px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full text-white transition-all duration-300 font-bold shadow-lg shadow-red-500/25 border border-red-400/50 text-sm md:text-base"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    );
  };

  // Game View Section
  const GameViewSection = () => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    });

    return (
      <section className="py-16 md:py-20 text-white">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Content */}
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4">
                <motion.h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Experience in <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">3D</span>
                </motion.h2>
                <motion.p 
                  className="text-gray-400 text-base md:text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Explore our collection in stunning 3D detail. Rotate, zoom, and examine every curve and feature of our premium die-cast models.
                </motion.p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <motion.div 
                  className="p-4 rounded-xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-red-500 mb-2">
                    <i className="fa-solid fa-cube text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-1 text-white">3D View</h4>
                  <p className="text-gray-400">360° rotation</p>
                </motion.div>
                <motion.div 
                  className="p-4 rounded-xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className="text-red-500 mb-2">
                    <i className="fa-solid fa-magnifying-glass-plus text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-1 text-white">Zoom</h4>
                  <p className="text-gray-400">Detailed inspection</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/game"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all font-bold shadow-lg shadow-red-500/25 border border-red-400/50"
                  >
                    Try 3D View
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* 3D Preview */}
            <motion.div 
              className="relative aspect-square rounded-3xl overflow-hidden group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-red-500/10 z-10 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/50 backdrop-blur-sm"></div>
              <Canvas
                camera={{ 
                  position: [15, 4, 10],
                  fov: 50,
                  near: 0.1,
                  far: 1000
                }}
                className="w-full h-full"
              >
                <Suspense fallback={null}>
                  <Stage
                    environment="sunset"
                    intensity={1}
                    adjustCamera={false}
                  >
                    <Model />
                  </Stage>
                  <OrbitControls
                    autoRotate
                    autoRotateSpeed={1}
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                    target={[0, 0, 0]}
                    minDistance={5}
                    maxDistance={10}
                  />
                </Suspense>
              </Canvas>

              {/* Overlay Buttons */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/game/67baba880c2d39b4113f477b" 
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all border border-white/20 text-white text-sm font-medium"
                    data-discover="true"
                  >
                    View Full Experience
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    );
  };

  // Premium Features Section
  const PremiumFeaturesSection = () => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    });

    const features = [
      {
        icon: "fa-medal",
        title: "Premium Quality",
        description: "Crafted with precision using die-cast metal and premium materials"
      },
      {
        icon: "fa-certificate",
        title: "Limited Editions",
        description: "Exclusive collections with numbered series and authenticity certificates"
      },
      {
        icon: "fa-box",
        title: "Collector Packaging",
        description: "Premium packaging designed for both display and protection"
      },
      {
        icon: "fa-truck-fast",
        title: "Global Shipping",
        description: "Secure worldwide shipping with tracking and insurance"
      }
    ];

    return (
      <section className="py-16 md:py-20 text-white">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center mb-12 md:mb-16">
            <motion.h2 
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Premium Features
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={inView ? { width: 96 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            ></motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <motion.div
                  className="relative text-center p-6 rounded-3xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/25 border border-red-400/50">
                    <i className={`fas ${feature.icon} text-2xl text-white`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-red-400 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    );
  };

  // Newsletter Section
  const NewsletterSection = () => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    });

    return (
      <section className="py-16 md:py-20 text-white">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Stay Updated
            </motion.h2>
            <motion.p 
              className="text-gray-300 mb-6 md:mb-8 text-base md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Subscribe to our newsletter for exclusive updates, early access to new releases,
              and collector's tips.
            </motion.p>
            <motion.form 
              className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 md:px-6 py-3 bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 border border-zinc-700/50 text-white placeholder-gray-400 text-sm md:text-base"
              />
              <motion.button
                type="submit"
                className="px-6 md:px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all font-bold shadow-lg shadow-red-500/25 border border-red-400/50 text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </section>
    );
  };

  // New Arrivals Section
  const NewArrivalsSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    });
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const { recentProducts, loading } = useProducts();
    const productsPerPage = 4; // Number of products to show at once

    // Calculate the actual maximum slide based on remaining products
    const calculateMaxSlide = () => {
      if (recentProducts.length <= productsPerPage) {
        return 0; // No scrolling needed if all products fit
      }
      // Calculate how many slides we need to show all products
      // Each slide shows productsPerPage items, so we need to scroll by the number of remaining items
      return Math.max(0, recentProducts.length - productsPerPage);
    };

    const maxSlide = calculateMaxSlide();

    const nextSlide = () => {
      if (currentSlide < maxSlide) {
        setCurrentSlide((prev) => prev + 1);
      }
    };

    const prevSlide = () => {
      if (currentSlide > 0) {
        setCurrentSlide((prev) => prev - 1);
      }
    };

    const handleTouchStart = (e) => {
      setIsDragging(true);
      setStartX(e.touches[0].pageX - e.currentTarget.offsetLeft);
      setScrollLeft(e.currentTarget.scrollLeft);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.touches[0].pageX - e.currentTarget.offsetLeft;
      const walk = (x - startX) * 2;
      e.currentTarget.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = (e) => {
      setIsDragging(false);
      const container = e.currentTarget;
      const cardWidth = container.querySelector('.flex-shrink-0').offsetWidth + 16; // 16px for gap
      const scrollPosition = container.scrollLeft;
      const newSlide = Math.round(scrollPosition / cardWidth);
      setCurrentSlide(Math.max(0, Math.min(newSlide, maxSlide)));
    };

    const handleAddToCart = async (product) => {
      const result = await addToCart(product);
      if (!result.success) {
        navigate('/login'); // Redirect to login if not logged in
      } else {
        setToastMessage(result.message); // Show success message
        setTimeout(() => setToastMessage(""), 3000);
      }
    };

    if (loading) {
      return (
        <section className="py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-10 bg-zinc-800 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-zinc-800 rounded w-1/4 mb-12"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-square bg-zinc-800 rounded-2xl"></div>
                    <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
                    <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    // Calculate the total number of slides needed
    const totalSlides = maxSlide + 1;

    return (
      <section className="py-20 text-white">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 relative z-10"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">New Arrivals</h2>
              <p className="text-gray-400 text-base md:text-lg">Fresh releases to add to your collection</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`w-12 h-12 rounded-full border flex items-center justify-center group transition-all ${
                  currentSlide === 0 
                    ? 'border-white/10 text-white/30 cursor-not-allowed' 
                    : 'border-white/20 hover:border-white/40 text-white hover:text-red-500'
                }`}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide >= maxSlide}
                className={`w-12 h-12 rounded-full border flex items-center justify-center group transition-all ${
                  currentSlide >= maxSlide 
                    ? 'border-white/10 text-white/30 cursor-not-allowed' 
                    : 'border-white/20 hover:border-white/40 text-white hover:text-red-500'
                }`}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          {/* Products Slider */}
          <div 
            className="overflow-hidden select-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div 
              className="flex gap-4 md:gap-6 transition-transform duration-300 ease-in-out"
              style={{ 
                transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
                width: `${totalSlides * 100}%`
              }}
            >
              {recentProducts.map((product) => (
                <div 
                  key={product._id} 
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="w-64 md:w-72 group flex-shrink-0 cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-800 rounded-2xl p-6 md:p-8 flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                    {product.image ? (
                      <img 
                        src={`/hotwheels/${product.image.replace(/^.*[\\\/]/, '')}`} 
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <i className="fa-solid fa-car text-4xl md:text-6xl text-red-500 group-hover:scale-110 transition-transform"></i>
                    )}
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
                      <span className="text-xl md:text-2xl font-bold text-white group-hover:text-red-500 transition-colors">
                        ${product.price}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-full md:w-auto px-4 md:px-6 py-2 bg-red-500 rounded-full text-white transition-all 
                          duration-300 hover:bg-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] 
                          group-hover:scale-105 active:scale-95 text-sm md:text-base"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    );
  };

  return (
    <div id="root" className="pt-16 bg-gradient-to-br from-black via-zinc-900 to-black relative overflow-hidden">
      {/* Global Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Darker overlay for overall background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black opacity-90"></div>
        {/* Existing animated balls */}
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
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
        {/* Additional light-red blurry balls for premium effect */}
        <motion.div 
          className="absolute top-1/4 right-1/3 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.22, 0.12]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 1.5 }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.18, 1],
            opacity: [0.13, 0.23, 0.13]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2.5 }}
        ></motion.div>
        <motion.div 
          className="absolute top-10 right-1/4 w-40 h-40 bg-red-300/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.10, 0.18, 0.10]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 3 }}
        ></motion.div>
      </div>

      <HeroSection />
      <CollectionsSection />

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>

      <NewArrivalsSection />
      
      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>

      <GameViewSection />
      
      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>

      <LatestProductsSection />
      
      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>

      <PremiumFeaturesSection />
      
      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>

      <NewsletterSection />

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
    </div>
  );
};

export default HomePage;
