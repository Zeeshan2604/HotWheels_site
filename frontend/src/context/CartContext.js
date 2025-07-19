import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Import AuthContext
import { API_URL } from "../utils/getApiUrl";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user} = useAuth(); // Get user and logout from AuthContext
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) { // Fetch cart only if user is logged in
        try {
          const token = localStorage.getItem('token');
          setLoading(true);
          const response = await axios.get(`${API_URL}/api/v1/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          // Filter out items with missing products
          const validItems = response.data.filter(item => item.product !== null);
          setCartItems(validItems);
          
        } catch (err) {
          console.error("Error fetching cart:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCart();
  }, [user]); // Re-fetch when user changes

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/api/v1/wishlist`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setWishlistItems(response.data);
        } catch (err) {
          console.error("Error fetching wishlist:", err);
        }
      }
    };
    fetchWishlist();
  }, [user]);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false }; // Indicate that the user is not logged in
      }

      // Call your backend API to add/update the cart
      const response = await axios.post(`${API_URL}/api/v1/cart`, {
        productId: product._id,
        quantity: product.quantity || 1
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setCartItems(response.data.items);
        return { success: true, message: "Added to cart!" }; // Indicate success with message
      }
    } catch (err) {
      console.error("Error adding product to cart:", err);
      setError(err.response?.data?.message || err.message);
    }
    return { success: false }; // Indicate failure
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to remove items from cart');
      }

      const response = await axios.delete(`${API_URL}/api/v1/cart/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Update local state with the response from the server
        setCartItems(response.data.items || []);
      } else {
        // Fallback to local filtering if server doesn't return updated items
      setCartItems(cartItems.filter(item => item.product._id !== productId));
      }
    } catch (err) {
      console.error("Error removing product from cart:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to update cart');
      }

      const response = await axios.put(
        `${API_URL}/api/v1/cart/${productId}`,
        { quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setCartItems(response.data.items);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to clear cart');
      }

      await axios.delete(`${API_URL}/api/v1/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setCartItems([]); // Clear cart items from local state
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  // Listen for logout event
  useEffect(() => {
    if (!user) {
      setCartItems([]); // Clear cart items when user logs out
      setWishlistItems([]); // Clear wishlist items when user logs out
    }
  }, [user]);

  const addToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false };
      }

      const response = await axios.post(`${API_URL}/api/v1/wishlist`, 
        { productId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data) {
        setWishlistItems(prev => [...prev, response.data]);
        return { success: true, message: "Added to wishlist!" };
      }
    } catch (err) {
      console.error("Error adding product to wishlist:", err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const value = { 
    cartItems, 
    wishlistItems,
    loading, 
    error, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    addToWishlist 
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext); 