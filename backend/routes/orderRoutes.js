import express from 'express'
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} from '../controllers/orderController.js'
import { authenticateUser, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authenticateUser, createOrder)
router.get('/my-orders', authenticateUser, getMyOrders)
router.get('/', authenticateUser, authorizeRoles('staff', 'admin'), getAllOrders)
router.get('/:id', authenticateUser, getOrderById)
router.patch('/:id/cancel', authenticateUser, cancelOrder)
router.post('/:id/cancel', authenticateUser, cancelOrder)
router.patch('/:id/status', authenticateUser, authorizeRoles('staff', 'admin'), updateOrderStatus)
router.put('/:id/status', authenticateUser, authorizeRoles('staff', 'admin'), updateOrderStatus)

export default router
