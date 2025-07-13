import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import Navbar from "./components/Navbar";
import CategoriesList from "./components/CategoriesList";
import ProductList from "./components/ProductList";
import SingleProduct from "./components/SingleProduct";
import SingleCollection from "./components/SingleCollection";
import HomePage from "./components/HomePage";
import GameView from "./components/GameView";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ProtectedRoute from './components/ProtectedRoute';
import Wishlist from './components/Wishlist';
import Orders from './components/Orders';
import Checkout from './components/Checkout';

function App() {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Define route for the categories page */}
            <Route path="/" element={<HomePage />} />
            <Route path="/collections" element={<CategoriesList />} />
            <Route path="/collection/:id" element={<SingleCollection />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path="/game" element={<GameView />} />
            <Route path="/game/list" element={<GameView />} />
            <Route path="/game/:id" element={<GameView />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />

            {/* You can add more routes here as needed */}
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
