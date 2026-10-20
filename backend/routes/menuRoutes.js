import express from 'express'
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  toggleMenuItemAvailability,
  deleteMenuItem,
} from '../controllers/menuController.js'
import { authenticateUser, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getMenuItems)
router.get('/:id', getMenuItemById)
router.post('/', authenticateUser, authorizeRoles('admin'), createMenuItem)
router.put('/:id', authenticateUser, authorizeRoles('admin'), updateMenuItem)
router.patch('/:id', authenticateUser, authorizeRoles('admin'), updateMenuItem)
router.patch('/:id/toggle', authenticateUser, authorizeRoles('admin'), toggleMenuItemAvailability)
router.delete('/:id', authenticateUser, authorizeRoles('admin'), deleteMenuItem)

export default router
