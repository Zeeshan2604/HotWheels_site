import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import Footer from './Footer';  // We'll create this component next
import { useNavigate } from 'react-router-dom';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/collections"
      );
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return <div className="text-center text-white py-20">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-20">
        Failed to load categories.
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-zinc-900 to-black">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Our Collections
              </h1>
              <p className="text-xl text-gray-400">
                Explore our curated collections of premium die-cast models, from classic cars to modern supercars.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-16">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-800 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <i className="fas fa-search absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCategories.map((category) => (
                <motion.div
                  key={category._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedCategory(category);
                    navigate(`/collection/${category._id}`);
                  }}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gradient-to-br from-red-500/20 to-red-900/20 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  <img
                    alt={category.name}
                    src={category.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <h3 className="text-2xl font-bold mb-2 text-white">{category.name}</h3>
                    <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                      {category.description || "Explore our exclusive collection of premium models"}
                    </p>
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <button className="flex items-center gap-2 text-red-500 hover:text-red-400">
                        View Collection <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="text-center p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2 text-white">2,000+</div>
                <div className="text-gray-400">Models</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2 text-white">50+</div>
                <div className="text-gray-400">Brands</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2 text-white">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2 text-white">100%</div>
                <div className="text-gray-400">Authentic</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Collection */}
        <section className="py-20 bg-zinc-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white text-center">
              Featured Collection
            </h2>
            <div className="bg-black/50 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Limited Edition Series</h3>
                  <p className="text-gray-400">
                    Discover our exclusive limited edition models, each meticulously crafted and numbered. 
                    These rare pieces are perfect for serious collectors.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-gray-300">
                      <i className="fas fa-check text-red-500"></i>
                      Numbered certificates
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <i className="fas fa-check text-red-500"></i>
                      Premium display cases
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <i className="fas fa-check text-red-500"></i>
                      Exclusive collector's handbook
                    </li>
                  </ul>
                  <button className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors">
                    Explore Limited Editions
                  </button>
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <img 
                    src="/limited-edition.jpeg"
                    alt="Limited Edition Collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm">
                    Limited Stock
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CategoriesList; 