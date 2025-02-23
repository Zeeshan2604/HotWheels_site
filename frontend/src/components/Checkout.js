import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: ''
  });

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: shippingInfo,
        totalPrice: cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      };

      const response = await axios.post('http://localhost:3000/api/v1/orders', orderData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data._id) {
        clearCart();
        navigate('/orders');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-zinc-900 p-8 rounded-xl space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Shipping Information</h2>
            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 bg-zinc-800 rounded-lg text-white"
              value={shippingInfo.address}
              onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                className="p-3 bg-zinc-800 rounded-lg text-white"
                value={shippingInfo.city}
                onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="State"
                className="p-3 bg-zinc-800 rounded-lg text-white"
                value={shippingInfo.state}
                onChange={e => setShippingInfo({...shippingInfo, state: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="ZIP Code"
                className="p-3 bg-zinc-800 rounded-lg text-white"
                value={shippingInfo.zip}
                onChange={e => setShippingInfo({...shippingInfo, zip: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                className="p-3 bg-zinc-800 rounded-lg text-white"
                value={shippingInfo.phone}
                onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Country"
                className="p-3 bg-zinc-800 rounded-lg text-white"
                value={shippingInfo.country}
                onChange={e => setShippingInfo({...shippingInfo, country: e.target.value})}
                required
              />
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm Order'}
          </button>
          
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Checkout; 