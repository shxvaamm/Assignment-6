import mongoose from 'mongoose'

const restaurantTableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Reserved'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
)

const RestaurantTable = mongoose.model('RestaurantTable', restaurantTableSchema)

export default RestaurantTable
