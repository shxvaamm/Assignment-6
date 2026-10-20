import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectToDatabase, getDatabaseStatus } from './config/db.js'
import menuRoutes from './routes/menuRoutes.js'
import tableRoutes from './routes/tableRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import authRoutes from './routes/authRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5002

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/tables', tableRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.get('/api/health', (req, res) => {
  const dbStatus = getDatabaseStatus()
  const isDbConnected = dbStatus === 'connected'

  res.json({
    status: 'ok',
    server: 'running',
    database: {
      status: dbStatus,
      connected: isDbConnected,
    },
    time: new Date().toISOString(),
  })
})

app.get('/', (req, res) => {
  res.send('Restaurant Order System Backend is Running')
})

connectToDatabase()

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
  console.log(`Health check URL: http://localhost:${port}/api/health`)
})
