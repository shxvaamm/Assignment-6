import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customerName: {
      type: String,
      trim: true,
      default: 'Guest Diner',
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Order must contain at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderStatus: {
      type: String,
      enum: ['Placed', 'Preparing', 'Served', 'Paid', 'Cancelled'],
      default: 'Placed',
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid'],
      default: 'Unpaid',
    },
  },
  {
    timestamps: true,
  }
)

orderSchema.pre('validate', function () {
  if (this.items && this.items.length > 0) {
    const rawSubtotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    this.subtotal = Number(rawSubtotal.toFixed(2))
    this.tax = Number((this.subtotal * 0.05).toFixed(2))
    this.totalAmount = Number((this.subtotal + this.tax).toFixed(2))
  }
})

const Order = mongoose.model('Order', orderSchema)

export default Order
