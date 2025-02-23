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
        const featuredRes = await axios.get('http://localhost:3000/api/v1/products?isFeatured=true');
        const collectionsRes = await axios.get('http://localhost:3000/api/v1/collections');
        const latestRes = await axios.get('http://localhost:3000/api/v1/products?sort=-dateCreated&limit=3');
        
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
        className="relative min-h-screen bg-black text-white overflow-hidden"
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
            src="http://localhost:3000/uploads/hot-wheels.mp4"
            type="video/mp4"
          />
        </video>

        {/* Hero Section Content */}
        <div className="relative h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 pt-16">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
                Experience Miniature
                <br />
                <span className="text-red-500">Engineering Marvel</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in delay-200">
                Discover our exclusive collection of precision-crafted die-cast
                cars, where every detail tells a story of automotive excellence.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in delay-300">
                <Link
                  to="/collections"
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-full transition-all transform hover:scale-105"
                >
                  Explore Collection
                </Link>
                <button 
                  className="px-8 py-3 border border-white hover:bg-white hover:text-black rounded-full transition-all transform hover:scale-105"
                  onClick={() => {
                    const randomProduct = featuredProductsState[Math.floor(Math.random() * featuredProductsState.length)];
                    navigate(`/game/${randomProduct._id}`);
                  }}
                >
                  View in 3D
                </button>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="h-1 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Mute Button */}
        <button
          type="button"
          className="absolute bottom-8 right-8 transform -translate-x-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all cursor-pointer"
          onClick={handleMute}
        >
          <i
            className={`fa-solid ${
              isMuted ? "fa-volume-mute" : "fa-volume-up"
            } text-2xl`}
          />
        </button>
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
      <section className="py-20 bg-black">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-16"
        >
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 px-4">Featured Collections</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 px-4 overflow-x-auto pb-4 lg:pb-10">
            {collectionsState.map((collection) => (
              <motion.div
                key={collection._id}
                whileHover={{ scale: 1.05 }}
                className="relative rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/collection/${collection._id}`)}
              >
                <div className="aspect-square">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{collection.name}</h3>
                    <Link
                      to={`/collections/${collection._id}`}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      Explore Collection →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <Link
            to="/collections"
            className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2 mx-auto w-fit"
          >
            View All Collections
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
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
      <section className="py-20 bg-zinc-950">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
            Latest Arrivals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {latestProductsState.map((product) => (
              <motion.div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="w-72 group flex-shrink-0 bg-zinc-900 rounded-xl overflow-hidden
                  transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] 
                  hover:translate-y-[-8px] cursor-pointer"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors">
                      ${product.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="px-6 py-2 bg-red-500 rounded-full text-white transition-all duration-300 
                        hover:bg-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] 
                        group-hover:scale-105 active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
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
      <section className="py-20 bg-black text-white">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Experience in <span className="text-red-500">3D</span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Explore our collection in stunning 3D detail. Rotate, zoom, and examine every curve and feature of our premium die-cast models.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-zinc-900">
                  <div className="text-red-500 mb-2">
                    <i className="fa-solid fa-cube text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-1">3D View</h4>
                  <p className="text-gray-400">360° rotation</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900">
                  <div className="text-red-500 mb-2">
                    <i className="fa-solid fa-magnifying-glass-plus text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-1">Zoom</h4>
                  <p className="text-gray-400">Detailed inspection</p>
                </div>
              </div>

              <Link
                to="/GameView"
                className="inline-flex items-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              >
                Try 3D View
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

            {/* 3D Preview */}
            <div className="relative aspect-square rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-red-500/10 z-10 pointer-events-none"></div>
              <Canvas
                camera={{ 
                  position: [15, 4, 10],
                  fov: 50,
                  near: 0.1,
                  far: 1000
                }}
                className="w-full h-full bg-zinc-900"
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
                <Link 
                  to="/game/67baba880c2d39b4113f477b" 
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all border border-white/10 text-white text-sm"
                  data-discover="true"
                >
                  View Full Experience
                </Link>
              </div>
            </div>
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
      <section className="py-20 bg-black">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-white">
            Premium Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center">
                  <i className={`fas ${feature.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
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
      <section className="py-20 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/10"></div>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 relative"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Stay Updated
            </h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for exclusive updates, early access to new releases,
              and collector's tips.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-zinc-900 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              >
                Subscribe
              </button>
            </form>
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

    const { recentProducts, loading } = useProducts();
    const productsPerPage = 4; // Number of products to show at once
    const totalPages = Math.ceil(recentProducts.length / productsPerPage);

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % totalPages);
    };

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + totalPages) % totalPages);
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
        <section className="py-20 bg-zinc-900 text-white">
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

    return (
      <section className="py-20 bg-zinc-900 text-white">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4"
        >
          {/* Section Header */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">New Arrivals</h2>
              <p className="text-gray-400 text-lg">Fresh releases to add to your collection</p>
            </div>
            <div className="hidden md:flex gap-4">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-white/40 flex items-center justify-center group"
              >
                <i className="fa-solid fa-arrow-left group-hover:text-red-500 transition-colors"></i>
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-white/40 flex items-center justify-center group"
              >
                <i className="fa-solid fa-arrow-right group-hover:text-red-500 transition-colors"></i>
              </button>
            </div>
          </div>

          {/* Products Slider */}
          <div className="overflow-x-hidden">
            <div 
              className="flex gap-6 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {recentProducts.map((product) => (
                <div 
                  key={product._id} 
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="w-72 group flex-shrink-0 cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-800 rounded-2xl p-8 flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <i className="fa-solid fa-car text-6xl text-red-500 group-hover:scale-110 transition-transform"></i>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-white group-hover:text-red-500 
                        transition-colors">
                        ${product.price}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="px-6 py-2 bg-red-500 rounded-full text-white transition-all 
                          duration-300 hover:bg-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] 
                          group-hover:scale-105 active:scale-95"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </section>
    );
  };

  return (
    <div id="root" className="pt-16">
      <HeroSection />
      <CollectionsSection />
      <NewArrivalsSection />
      <GameViewSection />
      <LatestProductsSection />
      <PremiumFeaturesSection />
      <NewsletterSection />

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }

          .delay-200 {
            animation-delay: 200ms;
          }

          .delay-300 {
            animation-delay: 300ms;
          }

            
        `}
      </style>

      <script
        type="module"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      ></script>

      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white 
          px-6 py-3 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default HomePage;
