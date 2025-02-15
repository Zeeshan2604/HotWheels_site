import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./css/ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Fetch products when the component mounts
    axios
      .get("http://localhost:3000/api/v1/products")
      .then((response) => {
        const allProducts = response.data;
        setProducts(response.data);

        // Find the Limited Edition product
        const limitedEditionProduct = allProducts.find(
          (product) =>
            product.category.name === "Limited Edition" &&
            product._id === "6773d60be6e8d506b9b1eff0"
        );

        if (limitedEditionProduct) {
          setFeaturedProduct(limitedEditionProduct);
        } else {
          // Fallback: Select a random featured product
          const randomFeaturedProduct = allProducts.find(
            (product) => product.isFeatured
          );
          setFeaturedProduct(randomFeaturedProduct || allProducts[0]); // Fallback to any product if none is featured
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div id="root">
      {/* Rare finds products */}
      <section
        id="rare_finds"
        className="py-20 bg-gradient-to-b from-black to-zinc-900 text-white"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-red-500 font-semibold mb-2 block">
              Limited Availability
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Rare Finds</h2>
            <p className="text-gray-400 text-lg">
              Discover our most exclusive and sought-after collector's items
            </p>
          </div>

          {/* Featured Rare Item */}
          {featuredProduct && (
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              <div className="relative group">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-red-500/10 to-purple-500/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    className="w-55 h-55 object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm">
                    {featuredProduct.stock
                      ? `Only ${featuredProduct.stock} Left`
                      : "Limited Stock"}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-4">
                  {featuredProduct.name}
                </h3>
                <p className="text-gray-400 mb-6">
                  {featuredProduct.description}
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-medal text-red-500"></i>
                    <span>Numbered Collection</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-certificate text-red-500"></i>
                    <span>Authentication Certificate</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-box text-red-500"></i>
                    <span>Premium Display Case</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 mb-8">
                  <div className="text-3xl font-bold">
                    ${featuredProduct.price}
                  </div>
                  {featuredProduct.originalPrice && (
                    <div className="text-lg text-gray-400 line-through">
                      ${featuredProduct.originalPrice}
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-full transition-colors">
                    Reserve Now
                  </button>
                  <button className="w-12 h-12 rounded-full border border-white/20 hover:border-white/40 flex items-center justify-center">
                    <i className="fa-regular fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other Rare Finds */}
          <div className="grid md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
              <div
                key={product._id}
                className="bg-zinc-800 rounded-2xl p-6 group hover:bg-zinc-700 transition-colors"
              >
                <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-900/10 flex items-center justify-center mb-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-35 h-35 object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <h4 className="text-xl font-bold mb-2">{product.name}</h4>
                <p className="text-gray-400 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">${product.price}</span>
                  <button className="text-blue-500 hover:text-blue-400 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals products */}
      <section id="new_arrivals" className="py-20 bg-zinc-900 text-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                New Arrivals
              </h2>
              <p className="text-gray-400 text-lg">
                Fresh releases to add to your collection
              </p>
            </div>
            <div className="hidden md:flex gap-4">
              <button
                onClick={scrollLeft}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-white/40 flex items-center justify-center group"
              >
                <i className="fa-solid fa-arrow-left group-hover:text-red-500 transition-colors"></i>
              </button>
              <button
                onClick={scrollRight}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-white/40 flex items-center justify-center group"
              >
                <i className="fa-solid fa-arrow-right group-hover:text-red-500 transition-colors"></i>
              </button>
            </div>
          </div>

          {/* Products Slider */}
          <div ref={scrollRef} className="overflow-x-auto no-scrollbar">
            <div className="flex gap-6 min-w-max pb-6">
              {products.map((product) => (
                <div className="w-72 group" key={product._id}>
                  <div className="aspect-square bg-zinc-800 rounded-2xl p-8 flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-35 h-35 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-red-500 font-semibold">
                      ${product.price}
                    </span>
                    <button className="px-4 py-2 rounded-full bg-white text-black text-sm hover:bg-gray-200 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            <button className="w-2 h-2 rounded-full bg-white"></button>
            <button className="w-2 h-2 rounded-full bg-white/30"></button>
            <button className="w-2 h-2 rounded-full bg-white/30"></button>
            <button className="w-2 h-2 rounded-full bg-white/30"></button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductList;
