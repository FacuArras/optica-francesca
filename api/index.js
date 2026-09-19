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

// Conexión a MongoDB persistente en serverless
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB')

        // Solo inicializar app.listen() si no estamos en Vercel
        if (!process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
            })
        }
    })
    .catch((err) => {
        console.error('❌ Error al conectar a MongoDB:', err.message)
    })

// Exportar Express para Vercel Serverless Functions
export default app
