import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { connectDatabase } from './lib/db'
import authRoutes from './routes/auth.routes'
import organizerRoutes from './routes/organizer.routes'
import eventRoutes from './routes/event.routes'
import uploadRoutes from './routes/upload.routes'
import reservationRoutes from './routes/reservation.routes'
import dietaryRoutes from './routes/dietary.routes'
import feedbackRoutes from './routes/feedback.routes'
import notificationRoutes from './routes/notification.routes'
import analyticsRoutes from './routes/analytics.routes'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
console.log(process.env.DATABASE_URL)
console.log(process.env.JWT_SECRET)
console.log(process.env.PORT)
console.log(process.env.CORS_ORIGIN)
console.log(process.env.GOOGLE_CLIENT_ID)
console.log(process.env.GOOGLE_CLIENT_SECRET)

const app = express()
const origin = process.env.CORS_ORIGIN || 'http://localhost:3000'

app.use(cors({ origin, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/auth', authRoutes)
app.use('/organizer', organizerRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/dietary', dietaryRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/analytics', analyticsRoutes)

const port = process.env.PORT || 4000

// Start server with database connection
async function startServer() {
  try {
    // Connect to database first
    await connectDatabase()
    
    // Start Express server
    app.listen(port, () => {
      console.log(`API listening on :${port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
