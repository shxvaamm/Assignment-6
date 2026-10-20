import Order from '../models/Order.js'
import RestaurantTable from '../models/RestaurantTable.js'

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    const todayOrdersCount = await Order.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    })

    const todayPaidOrders = await Order.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
      orderStatus: 'Paid',
    })

    const rawTodayRevenue = todayPaidOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0)
    const todayRevenue = Number(rawTodayRevenue.toFixed(2))

    const totalOrdersCount = await Order.countDocuments()
    const activeOrdersCount = await Order.countDocuments({
      orderStatus: { $in: ['Placed', 'Preparing', 'Served'] },
    })
    const occupiedTablesCount = await RestaurantTable.countDocuments({ status: 'Occupied' })

    const topSellingItems = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          quantitySold: { $sum: '$items.quantity' },
          totalRevenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] },
          },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          name: '$_id',
          quantitySold: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
        },
      },
    ])

    const categorySales = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuInfo',
        },
      },
      {
        $unwind: {
          path: '$menuInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: { $ifNull: ['$menuInfo.category', 'Main Course'] },
          itemsSold: { $sum: '$items.quantity' },
          revenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] },
          },
        },
      },
      { $sort: { revenue: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          itemsSold: 1,
          revenue: { $round: ['$revenue', 2] },
        },
      },
    ])

    res.json({
      today: {
        orderCount: todayOrdersCount,
        revenue: todayRevenue,
        revenueRule: 'Completed revenue from Paid orders placed today, strictly excluding cancelled orders.',
      },
      activeOrdersCount,
      occupiedTablesCount,
      totalOrdersCount,
      topSellingItems,
      categorySales,
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate dashboard statistics', error: err.message })
  }
}
