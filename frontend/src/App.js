import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import Navbar from "./components/Navbar";
// Lazy load route components
const HomePage = lazy(() => import("./components/HomePage"));
const CategoriesList = lazy(() => import("./components/CategoriesList"));
const SingleCollection = lazy(() => import("./components/SingleCollection"));
const ProductList = lazy(() => import("./components/ProductList"));
const SingleProduct = lazy(() => import("./components/SingleProduct"));
const GameView = lazy(() => import("./components/GameView"));
const Cart = lazy(() => import("./components/Cart"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Profile = lazy(() => import("./components/Profile"));
const Wishlist = lazy(() => import("./components/Wishlist"));
const Orders = lazy(() => import("./components/Orders"));
const Checkout = lazy(() => import("./components/Checkout"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

function App() {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Navbar />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white text-xl">Loading...</div>}>
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
            </Suspense>
          </Router>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
