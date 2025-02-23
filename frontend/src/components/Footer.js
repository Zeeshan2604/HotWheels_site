import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">HotWheelsX</h3>
            <p className="text-gray-400">
              Premium die-cast models for collectors and enthusiasts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500">Home</Link>
              </li>
              <li>
                <Link to="/collections" className="text-gray-400 hover:text-red-500">Collections</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-red-500">Products</Link>
              </li>
              <li>
                <Link to="/GameView" className="text-gray-400 hover:text-red-500">3D View</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500">Shipping Info</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500">Returns</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800 text-center text-gray-400">
          <p>&copy; 2024 HotWheelsX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 