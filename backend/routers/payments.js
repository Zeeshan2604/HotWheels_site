import { Router } from 'express';
const router = Router();

// Mock payment endpoint
router.post('/mock-payment', (req, res) => {
  res.json({ success: true });
});

export default router; 