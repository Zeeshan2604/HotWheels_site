import React, { useRef, useState } from "react";
import { Link } from "react-router-dom"; // For navigation

const HomePage = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div id="root">
      <section
        id="navbar_hero"
        className="relative min-h-screen bg-black text-white overflow-hidden"
      >
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          className="absolute top-0 left-0 w-full h-full object-cover filter brightness-50"
        >
          <source
            src="http://localhost:3000/uploads/hot-wheels.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold">
                  HotWheels<span className="text-red-500">X</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  to="/collections"
                  className="hover:text-red-500 transition-colors"
                >
                  Collections
                </Link>
                <Link
                  to="/products"
                  className="hover:text-red-500 transition-colors"
                >
                  Products
                </Link>
                <Link to="#" className="hover:text-red-500 transition-colors">
                  Cinematics
                </Link>
                <Link
                  to="/login"
                  className="hover:text-red-500 transition-colors"
                >
                  Login
                </Link>
              </div>

              {/* Right Navigation */}
              <div className="flex items-center space-x-4">
                <button className="hover:text-red-500 transition-colors">
                  <i className="fa-solid fa-search text-xl"></i>
                </button>
                <button
                  onClick={() => (window.location.href = "/cart")}
                  className="hover:text-red-500 transition-colors"
                >
                  <i className="fa-solid fa-shopping-cart text-xl"></i>
                </button>
                <button className="md:hidden hover:text-red-500 transition-colors">
                  <i className="fa-solid fa-bars text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
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
                <Link
                  to="/gameview"
                  className="px-8 py-3 border border-white hover:bg-white hover:text-black rounded-full transition-all transform hover:scale-105"
                >
                  View in 3D
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="h-1 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-8 right-8 transform -translate-x-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all"
        >
          <i
            className={`fa-solid ${
              isMuted ? "fa-volume-mute" : "fa-volume-up"
            } text-2xl`}
          ></i>
        </button>
      </section>

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
    </div>
  );
};

export default HomePage;
