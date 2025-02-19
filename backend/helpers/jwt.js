import { expressjwt } from "express-jwt";
import dotenv from 'dotenv';

dotenv.config();

function authJwt() {
  const secret = process.env.JWT_SECRET || process.env.secret;
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
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/collections(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
      `${api}/auth/login`,
      `${api}/auth/register`,
      `${api}/auth/google`,
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
