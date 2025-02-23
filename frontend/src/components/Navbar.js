import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from "../context/CartContext";
import axios from 'axios';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const menuRef = useRef();
  const mobileMenuRef = useRef();
  const searchInputRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Hide search button on Products and Collections pages
  const hideSearchButton = ['/products', '/collections'].includes(location.pathname);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    
    try {
      setIsSearching(true);
      const response = await axios.get(`http://localhost:3000/api/v1/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults(null);
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleCartClick = () => {
    if (!user) {
      navigate('/login'); // Redirect to login if not logged in
    } else {
      navigate('/cart'); // Navigate to cart if logged in
    }
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
            {!hideSearchButton && (
              <div className="relative" ref={searchInputRef}>
                {isSearchOpen ? (
                  <div>
                    <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-64 px-4 py-2 bg-zinc-800 rounded-full text-white placeholder-gray-400 
                          focus:outline-none focus:ring-2 focus:ring-red-500"
                        autoFocus
                      />
                    </form>

                    {/* Search Results Dropdown */}
                    {searchQuery.trim() && (
                      <div className="absolute right-0 mt-2 w-96 bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
                        {isSearching ? (
                          <div className="p-4 text-center text-gray-400">
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Searching...
                          </div>
                        ) : searchResults ? (
                          <div>
                            {/* Categories Section */}
                            {searchResults.categories?.length > 0 && (
                              <div className="p-2">
                                <div className="px-3 py-2 text-sm text-gray-400">Categories</div>
                                {searchResults.categories.map(category => (
                                  <Link
                                    key={category._id}
                                    to={`/products?category=${category._id}`}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-700 transition-colors"
                                    onClick={() => {
                                      setIsSearchOpen(false);
                                      setSearchQuery('');
                                      setSearchResults(null);
                                    }}
                                  >
                                    <i className="fas fa-folder text-red-500"></i>
                                    <span>{category.name}</span>
                                  </Link>
                                ))}
                              </div>
                            )}

                            {/* Products Section */}
                            {searchResults.products?.length > 0 && (
                              <div className="p-2 border-t border-zinc-700">
                                <div className="px-3 py-2 text-sm text-gray-400">Products</div>
                                {searchResults.products.map(product => (
                                  <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-700 transition-colors"
                                    onClick={() => {
                                      setIsSearchOpen(false);
                                      setSearchQuery('');
                                      setSearchResults(null);
                                    }}
                                  >
                                    <img 
                                      src={product.image} 
                                      alt={product.name}
                                      className="w-10 h-10 object-cover rounded"
                                    />
                                    <div>
                                      <div className="font-medium">{product.name}</div>
                                      <div className="text-sm text-gray-400">${product.price}</div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}

                            {/* No Results */}
                            {!searchResults.categories?.length && !searchResults.products?.length && (
                              <div className="p-4 text-center text-gray-400">
                                No results found
                              </div>
                            )}

                            {/* View All Results */}
                            {(searchResults.categories?.length || searchResults.products?.length) > 0 && (
                              <div className="p-2 border-t border-zinc-700">
                                <button
                                  onClick={handleSearch}
                                  className="w-full px-4 py-2 text-center text-red-500 hover:bg-zinc-700 transition-colors"
                                >
                                  View all results
                                </button>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-white hover:text-red-500 transition-colors"
                  >
                    <i className="fa-solid fa-search text-xl"></i>
                  </button>
                )}
              </div>
            )}
            <button onClick={handleCartClick} className="relative p-2 text-white">
              <i className="fa-solid fa-shopping-cart text-xl"></i>
              {totalCartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {totalCartCount}
                </span>
              )}
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