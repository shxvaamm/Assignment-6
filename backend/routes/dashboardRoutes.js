import express from 'express'
import { getDashboardStats } from '../controllers/dashboardController.js'
import { authenticateUser, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

router.get('/stats', authenticateUser, authorizeRoles('staff', 'admin'), getDashboardStats)

export default router
