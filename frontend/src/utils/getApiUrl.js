// Utility to get API and asset URLs for both localhost and production (Vercel)

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
 
export { API_URL }; 