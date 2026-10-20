import mongoose from 'mongoose'

export const connectToDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI

  if (!mongoURI) {
    console.log('MongoDB URI not found in .env file. Running in disconnected mode.')
    return
  }

  try {
    await mongoose.connect(mongoURI)
    console.log('MongoDB connection successful.')
  } catch {
    console.log('MongoDB connection failed. Please check your network or credentials.')
  }
}

export const getDatabaseStatus = () => {
  if (mongoose.connection.readyState === 1) {
    return 'connected'
  }
  return 'disconnected'
}
