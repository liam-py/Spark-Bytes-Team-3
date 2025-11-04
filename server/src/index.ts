import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'

const app = express()
const origin = process.env.CORS_ORIGIN || 'http://localhost:3000'

app.use(cors({ origin, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(cookieParser());

app.use('/auth', authRoutes)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`API listening on :${port}`))
