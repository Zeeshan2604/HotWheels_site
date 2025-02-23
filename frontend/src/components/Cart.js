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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-zinc-800 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 mt-10 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
          {cartItems.length === 0 ? (
            <div className="text-center">
              <p className="text-xl mb-4">Your cart is empty.</p>
              <Link to="/" className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
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
                  <button onClick={clearCart} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full">
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="sm:hidden space-y-4">
            {cartItems.map((item) => (
              <div key={item.product._id} className="bg-zinc-900 p-4 rounded-xl">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded"
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
                onClick={clearCart}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/3 bg-zinc-900 p-6 rounded-xl lg:sticky lg:top-4">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Subtotal</span>
            <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Shipping</span>
            <span className="font-medium">$20.00</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-400">Taxes</span>
            <span className="font-medium">$5.00</span>
          </div>
          <div className="border-t border-gray-700 pt-4 mb-10 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${(getTotalPrice() + 20 + 5).toFixed(2)}</span>
          </div>
          <Link 
            to="/checkout" 
            className="mt-16 w-full px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors text-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart; 