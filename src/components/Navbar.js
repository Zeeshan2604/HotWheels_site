import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef();
  const mobileMenuRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  console.log('Auth State:', { user, loading, currentPath: location.pathname });

  if (loading) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="w-1/4 md:w-1/4">
            <Link to="/" className="text-2xl font-bold">
              HotWheels<span className="text-red-500">X</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="flex-1 hidden md:flex items-center justify-center">
            <div className="flex items-center space-x-8 font-bold">
              <Link to="/collections" className="hover:text-red-500 transition-colors">
                Collections
              </Link>
              <Link to="/products" className="hover:text-red-500 transition-colors">
                Products
              </Link>
              <Link to="/gameview" className="hover:text-red-500 transition-colors">
                3D View
              </Link>
              {!user && (
                <Link to="/login" className="hover:text-red-500 transition-colors">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Right Navigation */}
          <div className="w-3/4 md:w-1/4 flex items-center justify-end space-x-4">
            <button className="hover:text-red-500 transition-colors">
              <i className="fa-solid fa-search text-xl"></i>
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="hover:text-red-500 transition-colors"
            >
              <i className="fa-solid fa-shopping-cart text-xl"></i>
            </button>
            {user && (
              <div className="relative hidden md:block" ref={menuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 hover:text-red-500 transition-colors"
                >
                  <img
                    src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:inline">{user.name}</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-xl shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-zinc-700 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-zinc-700 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 hover:bg-zinc-700 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-zinc-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            <button 
              className="md:hidden hover:text-red-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden fixed top-16 left-0 right-0 h-screen bg-black/95 backdrop-blur-md border-t border-zinc-800 transform transition-all duration-300 ease-in-out"
          >
            <div className="container mx-auto px-4 py-8 space-y-6">
              {user && (
                <div className="relative">
                  <Link 
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 bg-zinc-800/50 rounded-xl mb-8 hover:bg-zinc-800 transition-colors"
                  >
                    <img
                      src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{user.name}</h3>
                      <p className="text-gray-400 text-sm">View Profile</p>
                    </div>
                  </Link>
                  
                  {/* Close button moved inside profile section */}
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-4 right-4 p-2 hover:text-red-500 transition-colors"
                  >
                    <i className="fa-solid fa-times text-2xl"></i>
                  </button>
                </div>
              )}

              {/* Rest of the mobile menu content */}
              <div className="space-y-6">
                <Link 
                  to="/collections" 
                  className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-800/50 rounded-xl transition-colors font-bold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-layer-group text-xl text-red-500"></i>
                  Collections
                </Link>
                <Link 
                  to="/products" 
                  className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-800/50 rounded-xl transition-colors font-bold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-car text-xl text-red-500"></i>
                  Products
                </Link>
                <Link 
                  to="/gameview" 
                  className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-800/50 rounded-xl transition-colors font-bold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-cube text-xl text-red-500"></i>
                  3D View
                </Link>

                {user ? (
                  <>
                    <div className="w-full h-px bg-zinc-800 my-4"></div>
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-800/50 rounded-xl transition-colors font-bold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fa-solid fa-user text-xl text-red-500"></i>
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-800/50 rounded-xl transition-colors font-bold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fa-solid fa-box text-xl text-red-500"></i>
                      Orders
                    </Link>
                    <Link 
                      to="/wishlist" 
                      className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-800/50 rounded-xl transition-colors font-bold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fa-solid fa-heart text-xl text-red-500"></i>
                      Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-4 px-4 py-3 w-full text-left text-red-500 hover:bg-zinc-800/50 rounded-xl transition-colors font-bold"
                    >
                      <i className="fa-solid fa-sign-out-alt text-xl"></i>
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center gap-4 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-xl transition-colors font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fa-solid fa-sign-in-alt text-xl"></i>
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 