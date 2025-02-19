import { Router } from "express";
import { register, login, googleAuth } from "../controllers/auth.controller.js";
import pkg from 'jsonwebtoken';
const { sign } = pkg;

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);

export default router; 