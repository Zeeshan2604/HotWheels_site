import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import Footer from './Footer';

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, addToWishlist, wishlistItems } = useCart();
  const [toastMessage, setToastMessage] = useState("");
  // const [selectedImage, setSelectedImage] = useState(0);

  const isInWishlist = wishlistItems?.some(item => item.product?._id === product?._id) ?? false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const result = await addToCart({ ...product, quantity });
    if (!result.success) {
      navigate('/login'); // Redirect to login if not logged in
    } else {
      setToastMessage(result.message); // Show success message
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const handleAddToWishlist = async () => {
    const result = await addToWishlist(product._id);
    if (result.success) {
      setToastMessage(result.message); // Show success message
      setTimeout(() => setToastMessage(""), 3000);
    } else {
      // Handle error (e.g., show a message)
      console.error(result.message);
    }
  };

  const ProductGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
      <div className="flex flex-col gap-6">
        {/* Main Image Container */}
        <div className="relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden group">
          <motion.img
            src={selectedImage}
            alt="Main product"
            className="w-full h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Zoom Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/80 px-4 py-2 rounded-full text-sm text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
            Roll over image to zoom
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className={`relative aspect-square cursor-pointer rounded-xl overflow-hidden border-2 ${
                selectedImage === image ? 'border-red-500' : 'border-transparent'
              }`}
              onClick={() => setSelectedImage(image)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay for multiple images */}
              {index === images.length - 1 && images.length > 8 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium">
                  +{images.length - 8}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="aspect-square bg-zinc-800 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                <div className="h-6 bg-zinc-800 rounded w-1/4 mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl text-red-500 mb-4">Error Loading Product</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-8 px-6 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-white transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-white transition-colors">
            Products
          </button>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div className="space-y-6">
            <ProductGallery images={product.images} />
          </div>

          {/* Product Details */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 text-gray-400 mb-6">
                <span>{product.category?.name}</span>
                <span>•</span>
                <span>Stock: {product.stock}</span>
                {product.stock <= 5 && (
                  <span className="text-yellow-500">• Low Stock</span>
                )}
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.oldPrice}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags?.map(tag => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 
                      flex items-center justify-center text-red-500"
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 
                      flex items-center justify-center text-red-500"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-red-500 hover:bg-red-600 h-10 rounded-full 
                    transition-colors font-bold"
                >
                  Add to Cart
                </button>
              </div>
              <motion.button 
                onClick={handleAddToWishlist}
                className={`w-full h-12 rounded-full transition-all flex items-center justify-center gap-2 ${
                  isInWishlist 
                    ? 'bg-green-600 hover:bg-green-700 cursor-default' 
                    : 'border border-zinc-700 hover:bg-zinc-800'
                }`}
                disabled={isInWishlist}
                initial={false}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isInWishlist ? (
                    <motion.span
                      key="added"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.i 
                        className="fas fa-check text-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <span>Added to Wishlist</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.i 
                        className="far fa-heart text-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <span>Add to Wishlist</span>
                    </motion.span>
                    
                  )}
                </AnimatePresence>
                
              </motion.button>
              <div className="flex flex-col gap-4">
                        <button 
                          onClick={() => navigate(`/game/${product._id}`)}
                          className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center gap-2 transition-colors"
                        >
                          <i className="fas fa-cube text-white"></i>
                          View in 3D
                        </button>
                      </div>
            </div>

            {/* Additional Details */}
            <div className="border-t border-zinc-800 pt-8">
              <h3 className="text-xl font-bold mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-400">Release Date</p>
                  <p>{new Date(product.dateCreated).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">Scale</p>
                  <p>1:64</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">Material</p>
                  <p>Die-cast metal</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">Series</p>
                  <p>{product.category?.name}</p>
                </div>
              </div>
            </div>

            
          </motion.div>
        </div>
      </div>

      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 
          bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SingleProduct; 