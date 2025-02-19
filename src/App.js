import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import CategoriesList from "./components/CategoriesList";
import ProductList from "./components/ProductList";
import HomePage from "./components/HomePage";
import GameView from "./components/GameView";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Define route for the categories page */}
            <Route path="/" element={<HomePage />} />
            <Route path="/collections" element={<CategoriesList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/gameview" element={<GameView />} />
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

            {/* You can add more routes here as needed */}
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
