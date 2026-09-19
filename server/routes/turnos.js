import { Router } from 'express'
import Turno from '../models/Turno.js'

const router = Router()

// GET /api/turnos
// Devuelve los slots ya reservados agrupados por fecha: { "2026-09-18": ["10:00", "17:30"] }
router.get('/', async (req, res) => {
    try {
        const turnos = await Turno.find({}, 'fecha hora -_id').lean()

        const grouped = {}
        for (const { fecha, hora } of turnos) {
            if (!grouped[fecha]) grouped[fecha] = []
            grouped[fecha].push(hora)
        }

        return res.json(grouped)
    } catch (err) {
        console.error('Error al obtener turnos:', err)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
})

// POST /api/turnos
// Guarda un nuevo turno
router.post('/', async (req, res) => {
    try {
        const { nombre, telefono, email, receta, observaciones, fecha, hora } = req.body

        if (!nombre || !telefono || !email || !fecha || !hora) {
            return res.status(400).json({ error: 'Faltan campos requeridos' })
        }

        const turno = new Turno({ nombre, telefono, email, receta, observaciones, fecha, hora })
        await turno.save()

        return res.status(201).json({ ok: true, turno })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Ese horario ya fue reservado. Por favor elegí otro.' })
        }
        console.error('Error al guardar turno:', err)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
})

// GET /api/turnos/all
// Devuelve todos los turnos para el dashboard de Admin
router.get('/all', async (req, res) => {
    try {
        const turnos = await Turno.find().sort({ fecha: 1, hora: 1 }).lean()
        // Mapear _id a id para el frontend temporalmente si usa id en vez de _id
        const formatted = turnos.map(t => ({
            ...t,
            id: t._id,
        }))
        return res.json(formatted)
    } catch (err) {
        console.error('Error al obtener todos los turnos:', err)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
})

// PUT /api/turnos/:id
// Edita un turno
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, telefono, email, receta, observaciones, fecha, hora, confirmado } = req.body

        const turno = await Turno.findByIdAndUpdate(
            id,
            { nombre, telefono, email, receta, observaciones, fecha, hora, confirmado },
            { new: true, runValidators: true }
        )

        if (!turno) return res.status(404).json({ error: 'Turno no encontrado' })

        return res.json({ ok: true, turno: { ...turno.toObject(), id: turno._id } })
    } catch (err) {
        console.error('Error al actualizar turno:', err)
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Ese horario ya fue reservado.' })
        }
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
})

// DELETE /api/turnos/:id
// Borra un turno
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const turno = await Turno.findByIdAndDelete(id)
        if (!turno) return res.status(404).json({ error: 'Turno no encontrado' })
        return res.json({ ok: true })
    } catch (err) {
        console.error('Error al borrar turno:', err)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
})

export default router
