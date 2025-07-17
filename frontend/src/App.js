import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from './components/ProtectedRoute';

const HomePage = React.lazy(() => import("./components/HomePage"));
const CategoriesList = React.lazy(() => import("./components/CategoriesList"));
const ProductList = React.lazy(() => import("./components/ProductList"));
const SingleProduct = React.lazy(() => import("./components/SingleProduct"));
const SingleCollection = React.lazy(() => import("./components/SingleCollection"));
const GameView = React.lazy(() => import("./components/GameView"));
const Cart = React.lazy(() => import("./components/Cart"));
const Login = React.lazy(() => import("./components/Login"));
const Register = React.lazy(() => import("./components/Register"));
const Profile = React.lazy(() => import("./components/Profile"));
const Wishlist = React.lazy(() => import("./components/Wishlist"));
const Orders = React.lazy(() => import("./components/Orders"));
const Checkout = React.lazy(() => import("./components/Checkout"));

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
