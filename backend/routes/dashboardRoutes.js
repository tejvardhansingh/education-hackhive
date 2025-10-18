import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import { getDashboardData } from '../controllers/dashboardControllers.js';

const router = express.Router();

// Protected route
router.get('/', verifyToken, getDashboardData);

export default router;
