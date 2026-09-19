import { Router } from 'express'
import Turno from '../models/Turno.js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
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

        // Formatear la fecha a dd/mm (asumiendo que llega en formato YYYY-MM-DD)
        let fechaFormateada = fecha;
        if (fecha.includes('-')) {
            const [year, month, day] = fecha.split('-');
            if (day && month) {
                fechaFormateada = `${day}/${month}`;
            }
        }

        try {
            const { data, error } = await resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: process.env.ADMIN_EMAIL || 'facundoarrascaetacba@gmail.com',
                subject: `Nuevo turno agendado: ${nombre} - ${fechaFormateada} ${hora}`,
                html: `
                    <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f7f3ed; padding: 40px 20px; color: #1a1a1a; line-height: 1.5;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                            <div style="background-color: #2d4a3e; color: #ffffff; padding: 30px; text-align: center;">
                                <h1 style="margin: 0; font-size: 24px; font-weight: 600; font-family: 'Playfair Display', serif;">Nuevo Turno Agendado</h1>
                                <p style="margin: 8px 0 0; color: #efe9df; font-size: 15px;">Óptica Francesca</p>
                            </div>
                            <div style="padding: 30px;">
                                <p style="font-size: 16px; margin-bottom: 25px; color: #1a1a1a;">
                                    ¡Hola! tenés un nuevo turno reservado desde la página web. Acá están los detalles del paciente:
                                </p>
                                
                                <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2dcd3; color: #6b6560; width: 40%;"><strong>Fecha y Hora:</strong></td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2dcd3; font-weight: 500;">${fechaFormateada} a las ${hora}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2dcd3; color: #6b6560;"><strong>Nombre:</strong></td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2dcd3; font-weight: 500;">${nombre}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2dcd3; color: #6b6560;"><strong>Teléfono:</strong></td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2dcd3; font-weight: 500;">${telefono}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2dcd3; color: #6b6560;"><strong>Email:</strong></td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2dcd3; font-weight: 500;">${email}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2dcd3; color: #6b6560;"><strong>¿Lleva receta?:</strong></td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2dcd3; font-weight: 500;">${receta ? 'Sí' : 'No'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2dcd3; color: #6b6560;"><strong>Observaciones:</strong></td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2dcd3; font-weight: 500;">${observaciones || '-'}</td>
                                    </tr>
                                </table>
                            </div>
                            <div style="background-color: #faf7f2; padding: 20px; text-align: center; color: #9a948d; font-size: 13px; border-top: 1px solid #e2dcd3;">
                                Este correo fue generado automáticamente por la web de Óptica Francesca.
                            </div>
                        </div>
                    </div>
                `
            })

            if (error) {
                console.error('❌ Error desde la API de Resend:', error)
            } else {
                console.log('✅ Correo de notificación de turno enviado a ADMIN_EMAIL')
            }
        } catch (emailErr) {
            console.error('❌ Error interno al enviar el correo con Resend:', emailErr)
            // No detenemos el flujo si falla el envío de correo, solo hacemos log.
        }

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
