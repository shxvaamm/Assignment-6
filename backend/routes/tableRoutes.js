import express from 'express'
import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} from '../controllers/tableController.js'
import { authenticateUser, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getTables)
router.get('/:id', getTableById)
router.post('/', authenticateUser, authorizeRoles('admin'), createTable)
router.put('/:id', authenticateUser, authorizeRoles('admin'), updateTable)
router.patch('/:id', authenticateUser, authorizeRoles('admin'), updateTable)
router.delete('/:id', authenticateUser, authorizeRoles('admin'), deleteTable)

export default router
