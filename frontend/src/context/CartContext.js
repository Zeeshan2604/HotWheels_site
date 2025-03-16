import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Import AuthContext


const api = axios.create({
  baseURL: process.env.URL,
});



const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // Get user and logout from AuthContext
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const initialLoad = useRef(true); // Add this line

  useEffect(() => {
    const fetchCart = async () => {
      if (user) { // Fetch cart only if user is logged in
        try {
          const token = localStorage.getItem('token');
          setLoading(true);
          const response = await axios.get("/api/v1/cart", {
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
          const response = await axios.get("/api/v1/wishlist", {
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
      const response = await axios.post("/api/v1/cart", {
        productId: product._id,
        quantity: 1
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

      await axios.delete(`/api/v1/cart/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCartItems(cartItems.filter(item => item.product._id !== productId));
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
        `/api/v1/cart/${productId}`,
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
      await axios.delete("http://localhost:3000/api/v1/cart", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCartItems([]); // Clear cart items from the frontend state
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Listen for logout event
  useEffect(() => {
    // Only clear cart if there's no user AND no token exists (actual logout)
    const tokenExists = !!localStorage.getItem('token');
    if (!user && !tokenExists && !initialLoad.current) {
      clearCart();
    }
    initialLoad.current = false;
  }, [user]);

  const addToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false };
      }

      const response = await axios.post("/api/v1/wishlist", 
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
