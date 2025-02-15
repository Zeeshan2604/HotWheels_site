import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/ProductList.css";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (loading)
    return <div className="text-center text-white py-20">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-20">
        Failed to load categories.
      </div>
    );

  return (
    <div id="root">
      <section id="product_categories" className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Browse Categories
            </h2>
            <p className="text-gray-400 text-lg">
              Discover our extensive range of precision die-cast models
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gradient-to-br from-red-500/20 to-red-900/20"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                <img
                  alt="imag"
                  src={category.image}
                  className="w-150 h-150 object-contain group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  {/* <div className="mb-4"> */}
                  {/* <i className="fa-solid fa-car-side text-4xl text-red-500"></i> */}
                  {/* </div> */}
                  {/* <p className="text-gray-300 mb-4">{category.description}</p> */}
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <button className="flex items-center gap-2 text-red-500">
                      View Collection{" "}
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="text-center p-6 rounded-xl bg-zinc-900">
              <div className="text-3xl font-bold mb-2">2,000+</div>
              <div className="text-gray-400">Models</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-zinc-900">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-gray-400">Brands</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-zinc-900">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-zinc-900">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-gray-400">Authentic</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesList;
