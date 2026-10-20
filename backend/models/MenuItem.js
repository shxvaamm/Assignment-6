import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['Starters', 'Main Course', 'Beverages', 'Desserts'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    foodType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Drink', 'Dessert'],
      default: 'Veg',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const MenuItem = mongoose.model('MenuItem', menuItemSchema)

export default MenuItem
