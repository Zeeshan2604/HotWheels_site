import { expressjwt } from "express-jwt";
import dotenv from 'dotenv';

dotenv.config();

function authJwt() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret is not defined in environment variables');
  }

  const api = process.env.API_URL;
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    requestProperty: 'auth'
  }).unless({
    path: [
      // Home page and product list
      { url: /^\/($|index\.html$)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      // Collections list and single collection
      { url: /\/api\/v1\/collections(.*)/, methods: ["GET", "OPTIONS"] },
      // 3D view and game routes (if served by backend)
      { url: /\/api\/v1\/products\?has3DModel=true/, methods: ["GET", "OPTIONS"] },
      { url: /\/game(.*)/, methods: ["GET", "OPTIONS"] },
      // Static assets
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      // Auth and registration endpoints
      `${api}/users/login`,
      `${api}/users/register`,
      `${api}/auth/login`,
      `${api}/auth/register`,
      `${api}/auth/google`,
      // Explicitly make /api/v1/auth/login and /api/v1/auth/register public
      { url: /\/api\/v1\/auth\/login/, methods: ["POST"] },
      { url: /\/api\/v1\/auth\/register/, methods: ["POST"] },
      // Legacy or direct asset routes
      '/gameview',
      '/public/uploads/mustang.glb',
      '/uploads/mustang.glb'
    ],
  });
}

async function isRevoked(req, token) {
  // Allow all authenticated requests
  return false;
}

export default authJwt;
