import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, loading } = useCart();

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (!item.product) return total;
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => {
      if (!item.product) return total;
      return total + item.quantity;
    }, 0);
  };

  const getShippingCost = () => {
    const totalItems = getTotalItems();
    return totalItems > 1 ? 0 : 9.99;
  };

  const getShippingSavings = () => {
    const totalItems = getTotalItems();
    return totalItems > 1 ? 9.99 : 0; // Show the amount saved when free shipping applies
  };

  const getTaxAmount = () => {
    const subtotal = getTotalPrice();
    return subtotal * 0.08; // 8% tax rate
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost() + getTaxAmount();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-zinc-800 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
          {cartItems.length === 0 ? (
        // Empty cart - centered content
        <div className="container mx-auto px-4 py-8 mt-10 relative z-10">
          <div className="w-full flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">Your Cart is Empty</h2>
                <p className="text-gray-400">Add some Hot Wheels to get started!</p>
              </div>
              <Link to="/" className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all font-bold shadow-lg shadow-red-500/25 border border-red-400/50">
                Continue Shopping
              </Link>
            </div>
          </div>
            </div>
          ) : (
        // Cart with items - normal layout
        <div className="container mx-auto px-4 py-8 mt-10 flex flex-col lg:flex-row gap-8 relative z-10">
          <div className="w-full lg:w-2/3">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent">Your Cart</h1>
            
            {/* Desktop Table View */}
              <div className="hidden sm:block flex-1 overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="hidden sm:table-header-group">
                    <tr className="border-b border-gray-700">
                      <th className="py-2 text-left">Product</th>
                      <th className="py-2 text-center">Quantity</th>
                      <th className="py-2 text-right">Price</th>
                      <th className="py-2 text-right">Total</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => {
                      if (!item.product) return null;
                      
                      return (
                        <tr key={item.product._id} className="border-b border-gray-800 block sm:table-row">
                          <td className="block sm:table-cell py-4">
                            <div className="flex items-center gap-4">
                              {item.product.image && (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-full sm:w-32 h-32 flex-shrink-0 rounded"
                                  loading="lazy"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg sm:text-xl font-bold truncate">{item.product.name}</h3>
                                <p className="text-base sm:text-lg text-gray-400">
                                  {item.product.category?.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="block sm:table-cell py-4">
                            <div className="flex items-center gap-2 mt-2 sm:mt-0">
                              <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-full">
                                <button
                                  onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                                  className="px-3 py-1 text-red-500 hover:text-red-400 transition-colors"
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                                <span className="w-12 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                  className="px-3 py-1 text-red-500 hover:text-red-400 transition-colors"
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="block sm:table-cell py-4 text-right">
                            <p className="text-base sm:text-lg">${item.product.price}</p>
                          </td>
                          <td className="block sm:table-cell py-4 text-right">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="block sm:table-cell py-4 text-right">
                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="text-red-500 hover:text-red-400 sm:ml-4 mt-2 sm:mt-0"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="flex justify-end mt-4">
                <button 
                  onClick={async () => {
                    try {
                      await clearCart();
                    } catch (error) {
                      console.error("Error clearing cart:", error);
                    }
                  }} 
                  className="px-4 py-2 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 rounded-full transition-all border border-zinc-600/50 backdrop-blur-sm"
                >
                    Clear Cart
                  </button>
              </div>
            </div>

            {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {cartItems.map((item) => (
              <div key={item.product._id} className="bg-zinc-900 p-4 rounded-xl">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="font-medium truncate">{item.product.name}</h3>
                      <p className="text-sm text-gray-400">{item.product.category?.name}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">${item.product.price}</p>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-full">
                      <button
                        onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1 text-red-500 hover:text-red-400"
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="px-3 py-1 text-red-500 hover:text-red-400"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <p className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="sm:hidden mt-6">
              <button 
                  onClick={async () => {
                    try {
                      await clearCart();
                    } catch (error) {
                      console.error("Error clearing cart:", error);
                    }
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 rounded-full transition-all border border-zinc-600/50 backdrop-blur-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm p-6 rounded-3xl lg:sticky lg:top-4 border border-zinc-700/50">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Order Summary</h2>
            
            {/* Item Count */}
            <div className="mb-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-600/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Items in Cart</span>
                <span className="font-medium text-white">{getTotalItems()}</span>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
            <span className="text-gray-400">Subtotal</span>
                <span className="font-medium text-white">${getTotalPrice().toFixed(2)}</span>
          </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
            <span className="text-gray-400">Shipping</span>
                  {getTotalItems() > 1 && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                      FREE
                    </span>
                  )}
                </div>
                <span className={`font-medium ${getTotalItems() > 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {getTotalItems() > 1 ? 'FREE' : `$${getShippingCost().toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Taxes (8%)</span>
                <span className="font-medium text-white">${getTaxAmount().toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Info */}
            {getTotalItems() === 1 && (
              <div className="mb-6 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                <div className="flex items-center gap-2">
                  <i className="fas fa-info-circle text-yellow-400"></i>
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">Add another item for free shipping!</p>
                    <p className="text-yellow-300 text-xs">Orders with 2+ items ship free</p>
                  </div>
                </div>
              </div>
            )}

            {getTotalItems() > 1 && (
              <div className="mb-6 p-3 bg-green-500/10 rounded-xl border border-green-500/30">
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-400"></i>
                  <div>
                    <p className="text-green-400 font-medium text-sm">Free shipping applied!</p>
                    <p className="text-green-300 text-xs">You saved ${getShippingSavings().toFixed(2)} on shipping</p>
                  </div>
                </div>
          </div>
            )}

            <div className="border-t border-zinc-700 pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Total</span>
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">${getFinalTotal().toFixed(2)}</span>
          </div>
          </div>
            
          <Link 
            to="/checkout" 
              className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all text-center font-bold shadow-lg shadow-red-500/25 border border-red-400/50"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
      )}
      <Footer />
    </div>
  );
};

export default Cart; 