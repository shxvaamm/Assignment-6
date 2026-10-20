import mongoose from 'mongoose'
import RestaurantTable from '../models/RestaurantTable.js'
import Order from '../models/Order.js'

export const getTables = async (req, res) => {
  try {
    const tables = await RestaurantTable.find().sort({ tableNumber: 1 })
    res.json(tables)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tables', error: err.message })
  }
}

export const getTableById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid table ID format' })
    }

    const table = await RestaurantTable.findById(req.params.id)
    if (!table) {
      return res.status(404).json({ message: 'Table not found' })
    }
    res.json(table)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch table', error: err.message })
  }
}

export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity, status } = req.body

    if (tableNumber === undefined || tableNumber === null || tableNumber === '') {
      return res.status(400).json({ message: 'Table number is required' })
    }

    const parsedTableNum = Number(tableNumber)
    if (!Number.isInteger(parsedTableNum) || parsedTableNum < 1) {
      return res.status(400).json({ message: 'Table number must be a positive whole number' })
    }

    if (capacity === undefined || capacity === null || capacity === '') {
      return res.status(400).json({ message: 'Capacity is required' })
    }

    const parsedCapacity = Number(capacity)
    if (!Number.isInteger(parsedCapacity) || parsedCapacity < 1) {
      return res.status(400).json({ message: 'Capacity must be a positive integer of at least 1' })
    }

    const existingTable = await RestaurantTable.findOne({ tableNumber: parsedTableNum })
    if (existingTable) {
      return res.status(400).json({ message: `Table #${parsedTableNum} already exists` })
    }

    const validStatuses = ['Available', 'Occupied', 'Reserved']
    const tableStatus = status && validStatuses.includes(status) ? status : 'Available'

    const newTable = new RestaurantTable({
      tableNumber: parsedTableNum,
      capacity: parsedCapacity,
      status: tableStatus,
    })

    const savedTable = await newTable.save()
    res.status(201).json(savedTable)
  } catch (err) {
    res.status(400).json({ message: 'Failed to create table', error: err.message })
  }
}

export const updateTable = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid table ID format' })
    }

    const { tableNumber, capacity, status } = req.body

    const table = await RestaurantTable.findById(req.params.id)
    if (!table) {
      return res.status(404).json({ message: 'Table not found' })
    }

    if (tableNumber !== undefined) {
      const parsedNum = Number(tableNumber)
      if (!Number.isInteger(parsedNum) || parsedNum < 1) {
        return res.status(400).json({ message: 'Table number must be a positive whole number' })
      }

      if (parsedNum !== table.tableNumber) {
        const existingWithNum = await RestaurantTable.findOne({
          tableNumber: parsedNum,
          _id: { $ne: table._id },
        })
        if (existingWithNum) {
          return res.status(400).json({ message: `Table #${parsedNum} already exists` })
        }

        const activeOrders = await Order.countDocuments({
          tableNumber: table.tableNumber,
          orderStatus: { $in: ['Placed', 'Preparing', 'Served'] },
        })
        if (activeOrders > 0) {
          return res.status(400).json({
            message: `Cannot change number of Table #${table.tableNumber} while it has active orders.`,
          })
        }

        table.tableNumber = parsedNum
      }
    }

    if (capacity !== undefined) {
      const parsedCap = Number(capacity)
      if (!Number.isInteger(parsedCap) || parsedCap < 1) {
        return res.status(400).json({ message: 'Capacity must be an integer of at least 1' })
      }
      table.capacity = parsedCap
    }

    if (status !== undefined) {
      const validStatuses = ['Available', 'Occupied', 'Reserved']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` })
      }

      if (status === 'Available') {
        const activeOrdersCount = await Order.countDocuments({
          tableNumber: table.tableNumber,
          orderStatus: { $in: ['Placed', 'Preparing', 'Served'] },
        })
        if (activeOrdersCount > 0) {
          return res.status(400).json({
            message: `Cannot mark Table #${table.tableNumber} as Available because it currently has ${activeOrdersCount} active order(s).`,
          })
        }
      }

      table.status = status
    }

    const updatedTable = await table.save()
    res.json(updatedTable)
  } catch (err) {
    res.status(400).json({ message: 'Failed to update table', error: err.message })
  }
}

export const deleteTable = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid table ID format' })
    }

    const table = await RestaurantTable.findById(req.params.id)
    if (!table) {
      return res.status(404).json({ message: 'Table not found' })
    }

    const activeOrdersCount = await Order.countDocuments({
      tableNumber: table.tableNumber,
      orderStatus: { $in: ['Placed', 'Preparing', 'Served'] },
    })

    if (activeOrdersCount > 0) {
      return res.status(400).json({
        message: `Cannot delete Table #${table.tableNumber} because it currently has ${activeOrdersCount} active order(s). Please settle or cancel orders first.`,
      })
    }

    await RestaurantTable.findByIdAndDelete(req.params.id)
    res.json({ message: `Table #${table.tableNumber} deleted successfully`, id: req.params.id })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete table', error: err.message })
  }
}
