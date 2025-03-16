import { useState, useEffect } from 'react';
import axios from 'axios';

const axi = axios.create({
  baseURL: process.env.REACT_APP_URL,
});



export const useProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, collectionsRes, latestRes, recentRes] = await Promise.all([
          axi.get('/api/v1/products/get/featured/4'),
          axi.get('/api/v1/collections'),
          axi.get('/api/v1/products?limit=8'),
          axi.get('/api/v1/products?sort=-dateCreated&limit=8')
        ]);

        setFeaturedProducts(featuredRes.data);
        setCollections(collectionsRes.data);
        setLatestProducts(latestRes.data);
        setRecentProducts(recentRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { featuredProducts, latestProducts, recentProducts, collections, loading, error };
}; 
