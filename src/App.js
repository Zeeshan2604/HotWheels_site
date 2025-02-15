import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CategoriesList from "./components/CategoriesList";
import ProductList from "./components/ProductList";
import HomePage from "./components/HomePage";
import GameView from "./components/GameView";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define route for the categories page */}
        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<CategoriesList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/gameview" element={<GameView />} />

        {/* You can add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
