import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from 'path';
import authJwt from "./helpers/jwt.js";
import errorHandler from "./helpers/error-handler.js";

// Routes
import collectionsRoutes from "./routers/collections.js";
import productsRoutes from "./routers/products.js";
import usersRoutes from "./routers/users.js";
import ordersRoutes from "./routers/orders.js";
import authRoutes from "./routers/auth.js";
import cartRoutes from "./routers/cart.js";
import searchRoutes from "./routers/search.js";
import wishlistRoutes from "./routers/wishlist.js";
import paymentsRoutes from './routers/payments.js';

// Load env variables first
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// Verify secret is loaded
const secret = process.env.JWT_SECRET || process.env.secret;
if (!secret) {
    throw new Error('JWT secret is not defined in environment variables');
}

// CORS Configuration
app.use(cors({
    origin: [
        'http://localhost:3002',
        'https://hot-wheels-site.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(morgan("tiny"));

// Serve static files - make both paths point to the same directory
app.use('/uploads', express.static(__dirname + "/public/uploads"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Add this after your middleware setup
app.use('/public/uploads', express.static('public/uploads'));

// Serve static files from the "public" directory
app.use('/hotwheels', express.static(path.join(__dirname, 'public', 'hotwheels')));

// API Routes
const api = process.env.API_URL || '/api/v1';
app.use(authJwt());
app.use(`${api}/collections`, collectionsRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/auth`, authRoutes);
app.use(`${api}/cart`, cartRoutes);
app.use(`${api}/search`, searchRoutes);
app.use(`${api}/wishlist`, wishlistRoutes);
app.use(`${api}/payments`, paymentsRoutes);

// Error Handler
app.use(errorHandler);

// Database Connection
console.log("MongoDB URI:", process.env.CONNECTION_STRING);
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Database Connection is ready...");
})
.catch((err) => {
    console.log(err);
});

export default app;
