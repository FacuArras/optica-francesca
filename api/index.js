import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import turnosRouter from '../server/routes/turnos.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Database connection middleware for Serverless
app.use(async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 5000 // Falla rápido si Atlas bloquea la IP
            })
            console.log('✅ Conectado a MongoDB (Serverless)')
        }
        next()
    } catch (err) {
        console.error('❌ Error al conectar a MongoDB:', err.message)
        res.status(500).json({ error: 'Database connection failed' })
    }
})

// Rutas
app.use('/api/turnos', turnosRouter)

app.post('/api/auth/login', (req, res) => {
    const { password } = req.body
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ ok: true })
    } else {
        res.status(401).json({ error: 'Contraseña incorrecta' })
    }
})

// Exportar Express para Vercel Serverless Functions
export default app

// Solo inicializar app.listen() si no estamos en Vercel (Local Dev)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    })
}
