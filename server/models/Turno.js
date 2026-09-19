import mongoose from 'mongoose'

const turnoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es requerido'],
            trim: true,
        },
        telefono: {
            type: String,
            required: [true, 'El teléfono es requerido'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'El email es requerido'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido'],
        },
        receta: {
            type: String,
            enum: ['si', 'no'],
            default: 'no',
        },
        observaciones: {
            type: String,
            trim: true,
            default: '',
        },
        fecha: {
            type: String, // YYYY-MM-DD
            required: [true, 'La fecha es requerida'],
        },
        hora: {
            type: String, // HH:MM
            required: [true, 'La hora es requerida'],
        },
        confirmado: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

// Evitar duplicados: un solo turno por fecha + hora
turnoSchema.index({ fecha: 1, hora: 1 }, { unique: true })

export default mongoose.model('Turno', turnoSchema)
