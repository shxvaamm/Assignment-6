import mongoose from 'mongoose'
import Order from '../models/Order.js'
import MenuItem from '../models/MenuItem.js'
import RestaurantTable from '../models/RestaurantTable.js'

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customer orders', error: err.message })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const { status, tableNumber } = req.query
    const query = {}
    if (status && status !== 'All') {
      query.orderStatus = status
    }
    if (tableNumber) {
      query.tableNumber = Number(tableNumber)
    }

    const orders = await Order.find(query).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message })
  }
}

export const getOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID format' })
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const isOwner = order.customer && String(order.customer) === String(req.user.userId)
    const isStaffOrAdmin = req.user.role === 'staff' || req.user.role === 'admin'

    if (!isOwner && !isStaffOrAdmin) {
      return res.status(403).json({ message: 'Access denied. You can only view your own orders.' })
    }

    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message })
  }
}

export const createOrder = async (req, res) => {
  try {
    const { tableNumber, customerName, items } = req.body

    if (!tableNumber) {
      return res.status(400).json({ message: 'Table number is required' })
    }

    const table = await RestaurantTable.findOne({ tableNumber: Number(tableNumber) })
    if (!table) {
      return res.status(404).json({ message: `Table ${tableNumber} does not exist` })
    }

    if (table.status !== 'Available') {
      return res.status(400).json({
        message: `Table ${tableNumber} is currently ${table.status}. Please select an available table.`,
      })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' })
    }

    const verifiedItems = []

    for (const item of items) {
      const quantity = Number(item.quantity)
      if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
        return res.status(400).json({ message: 'Item quantity must be a positive whole number' })
      }

      if (!item.menuItem || !mongoose.isValidObjectId(item.menuItem)) {
        return res.status(400).json({ message: 'Invalid menu item ID' })
      }

      const menuItem = await MenuItem.findById(item.menuItem)
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found with ID: ${item.menuItem}` })
      }

      if (menuItem.isAvailable === false) {
        return res.status(400).json({
          message: `${menuItem.name} is currently out of stock or unavailable`,
        })
      }

      verifiedItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      })
    }

    const rawSubtotal = verifiedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const subtotal = Number(rawSubtotal.toFixed(2))
    const tax = Number((subtotal * 0.05).toFixed(2))
    const totalAmount = Number((subtotal + tax).toFixed(2))

    const newOrder = new Order({
      tableNumber: table.tableNumber,
      customer: req.user.userId,
      customerEmail: req.user.email,
      customerName: (customerName && customerName.trim()) || req.user.name || 'Customer',
      items: verifiedItems,
      subtotal,
      tax,
      totalAmount,
      orderStatus: 'Placed',
      paymentStatus: 'Unpaid',
    })

    const savedOrder = await newOrder.save()

    try {
      table.status = 'Occupied'
      await table.save()
    } catch (tableErr) {
      await Order.findByIdAndDelete(savedOrder._id)
      throw new Error(`Failed to update table status: ${tableErr.message}`)
    }

    res.status(201).json(savedOrder)
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message })
  }
}

export const cancelOrder = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID format' })
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const isOwner = order.customer && String(order.customer) === String(req.user.userId)
    const isStaffOrAdmin = req.user.role === 'staff' || req.user.role === 'admin'

    if (!isOwner && !isStaffOrAdmin) {
      return res.status(403).json({ message: 'Access denied. You can only cancel your own orders.' })
    }

    if (order.orderStatus !== 'Placed') {
      return res.status(400).json({
        message: `Cannot cancel order. Current status is '${order.orderStatus}'. Only 'Placed' orders can be cancelled.`,
      })
    }

    order.orderStatus = 'Cancelled'
    await order.save()

    const remainingActiveOrders = await Order.countDocuments({
      tableNumber: order.tableNumber,
      _id: { $ne: order._id },
      orderStatus: { $in: ['Placed', 'Preparing', 'Served'] },
    })

    if (remainingActiveOrders === 0) {
      await RestaurantTable.findOneAndUpdate(
        { tableNumber: order.tableNumber },
        { status: 'Available' }
      )
    }

    res.json({
      message: 'Order cancelled successfully',
      order,
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel order', error: err.message })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID format' })
    }

    const { status } = req.body
    const validStatuses = ['Placed', 'Preparing', 'Served', 'Paid', 'Cancelled']

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status is required and must be one of: ${validStatuses.join(', ')}`,
      })
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const currentStatus = order.orderStatus

    const allowedTransitions = {
      Placed: ['Preparing', 'Cancelled'],
      Preparing: ['Served', 'Cancelled'],
      Served: ['Paid', 'Cancelled'],
      Paid: [],
      Cancelled: [],
    }

    if (currentStatus === status) {
      return res.json({ message: `Order status is already '${status}'`, order })
    }

    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from '${currentStatus}' to '${status}'. Allowed next statuses: ${
          allowedTransitions[currentStatus]?.length
            ? allowedTransitions[currentStatus].join(', ')
            : 'None (Order is in final state)'
        }`,
      })
    }

    order.orderStatus = status
    if (status === 'Paid') {
      order.paymentStatus = 'Paid'
    }

    const updatedOrder = await order.save()

    if (status === 'Paid' || status === 'Cancelled') {
      const activeOrdersCount = await Order.countDocuments({
        tableNumber: order.tableNumber,
        _id: { $ne: order._id },
        orderStatus: { $in: ['Placed', 'Preparing', 'Served'] },
      })
      if (activeOrdersCount === 0) {
        await RestaurantTable.findOneAndUpdate(
          { tableNumber: order.tableNumber },
          { status: 'Available' }
        )
      }
    } else if (status === 'Preparing' || status === 'Served') {
      await RestaurantTable.findOneAndUpdate(
        { tableNumber: order.tableNumber },
        { status: 'Occupied' }
      )
    }

    res.json({
      message: `Order status updated to '${status}' successfully`,
      order: updatedOrder,
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status', error: err.message })
  }
}
