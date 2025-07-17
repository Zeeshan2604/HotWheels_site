import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { API_URL } from "../utils/getApiUrl";

const Profile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.street || '',
    apartment: user?.apartment || '',
    city: user?.city || '',
    zip: user?.zip || '',
    country: user?.country || ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/v1/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setFormData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          street: response.data.street,
          apartment: response.data.apartment,
          city: response.data.city,
          zip: response.data.zip,
          country: response.data.country
        });
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `${API_URL}/api/v1/users/${user.id}`,
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        login({
          ...user,
          ...formData
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError(error.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Profile Settings
            </motion.h1>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={inView ? { width: 96 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            ></motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-zinc-900/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-zinc-700/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <label className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                    className="w-full bg-zinc-800/50 backdrop-blur-sm rounded-xl py-4 px-4 disabled:opacity-50 border border-zinc-700/50 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                </motion.div>

                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                    className="w-full bg-zinc-800/50 backdrop-blur-sm rounded-xl py-4 px-4 disabled:opacity-50 border border-zinc-700/50 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                </motion.div>

                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <label className="block text-sm font-medium text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                    className="w-full bg-zinc-800/50 backdrop-blur-sm rounded-xl py-4 px-4 disabled:opacity-50 border border-zinc-700/50 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                </motion.div>

                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.1 }}
                >
                  <label className="block text-sm font-medium text-gray-300">
                  Street
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  disabled={!isEditing}
                    className="w-full bg-zinc-800/50 backdrop-blur-sm rounded-xl py-4 px-4 disabled:opacity-50 border border-zinc-700/50 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                </motion.div>

                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <label className="block text-sm font-medium text-gray-300">
                  Apartment
                </label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                  disabled={!isEditing}
                    className="w-full bg-zinc-800/50 backdrop-blur-sm rounded-xl py-4 px-4 disabled:opacity-50 border border-zinc-700/50 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                </motion.div>

                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.3 }}
                >
                  <label className="block text-sm font-medium text-gray-300">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                    className="w-full bg-zinc-800/50 backdrop-blur-sm rounded-xl py-4 px-4 disabled:opacity-50 border border-zinc-700/50 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                </motion.div>

                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <label className="block text-sm font-medium text-gray-300">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  disabled={!isEditing}
                    className="w-full bg-zinc-800/50 backdrop-blur-sm rounded-xl py-4 px-4 disabled:opacity-50 border border-zinc-700/50 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                </motion.div>

                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.5 }}
                >
                  <label className="block text-sm font-medium text-gray-300">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                    className="w-full bg-zinc-800/50 backdrop-blur-sm rounded-xl py-4 px-4 disabled:opacity-50 border border-zinc-700/50 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                </motion.div>
            </div>

            {error && (
                <motion.div 
                  className="bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-400 p-4 rounded-xl border border-red-500/20 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                {error}
                </motion.div>
            )}

              <motion.div 
                className="flex justify-end gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
              {isEditing ? (
                <>
                    <motion.button
                    type="button"
                    onClick={() => setIsEditing(false)}
                      className="px-8 py-4 bg-zinc-800/50 backdrop-blur-sm rounded-xl hover:bg-zinc-700/50 transition-all border border-zinc-700/50 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                    </motion.button>
                    <motion.button
                    type="submit"
                      className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all font-bold shadow-lg hover:shadow-red-500/25 border border-red-400/50 disabled:opacity-50"
                    disabled={loading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                </>
              ) : (
                  <motion.button
                  type="button"
                  onClick={() => setIsEditing(true)}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all font-bold shadow-lg hover:shadow-red-500/25 border border-red-400/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                  Edit Profile
                  </motion.button>
              )}
              </motion.div>
          </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 