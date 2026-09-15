import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clock, User, Phone, FileText, MessageSquare, Check } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

// ── Mock: turnos ya reservados (fecha ISO → array de horarios) ──
const reservedSlots = {
    '2026-09-15': ['09:00', '10:30', '17:00'],
    '2026-09-16': ['11:00', '13:00', '18:00'],
    '2026-09-17': ['09:30', '12:00'],
    '2026-09-18': ['10:00', '17:30', '19:00'],
    '2026-09-19': ['09:00', '11:30', '18:30'],
    '2026-09-20': ['09:00', '10:00', '11:00'], // sábado
    '2026-09-22': ['09:30', '12:30', '17:00', '19:30'],
    '2026-09-23': ['10:00', '11:00'],
    '2026-09-24': ['09:00', '17:00', '18:00'],
}

const morningSlots = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30',
]

const afternoonSlots = [
    '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30',
]

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function toISO(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
}

// ── Calendar component ──
function Calendar({ selectedDate, onSelectDate, currentMonth, onChangeMonth }) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells = []
    // empty cells before the first day
    for (let i = 0; i < firstDay; i++) {
        cells.push(null)
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(new Date(year, month, d))
    }

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => onChangeMonth(-1)}
                    className="w-10 h-10 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/5 flex items-center justify-center transition-all duration-300"
                >
                    <ChevronLeft className="w-5 h-5 text-text-muted" />
                </button>
                <h3 className="text-lg font-display font-bold text-text">
                    {MONTHS[month]} {year}
                </h3>
                <button
                    onClick={() => onChangeMonth(1)}
                    className="w-10 h-10 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/5 flex items-center justify-center transition-all duration-300"
                >
                    <ChevronRight className="w-5 h-5 text-text-muted" />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Date cells */}
            <div className="grid grid-cols-7 gap-1">
                {cells.map((date, i) => {
                    if (!date) {
                        return <div key={`empty-${i}`} />
                    }

                    const isSunday = date.getDay() === 0
                    const isPast = date < today
                    const isDisabled = isSunday || isPast
                    const isSelected = selectedDate && isSameDay(date, selectedDate)
                    const isToday = isSameDay(date, today)

                    return (
                        <button
                            key={date.getDate()}
                            disabled={isDisabled}
                            onClick={() => onSelectDate(date)}
                            className={`
                                relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300
                                ${isDisabled
                                    ? 'text-text-light/40 cursor-not-allowed'
                                    : isSelected
                                        ? 'bg-accent text-white shadow-lg shadow-accent/20 scale-105'
                                        : 'text-text hover:bg-accent/10 hover:text-accent cursor-pointer'
                                }
                                ${isToday && !isSelected ? 'ring-2 ring-accent/30 ring-offset-2 ring-offset-surface' : ''}
                            `}
                        >
                            {date.getDate()}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// ── Time slot button ──
function TimeSlot({ time, isReserved, isSelected, onSelect }) {
    if (isReserved) {
        return (
            <div className="px-4 py-3 rounded-xl bg-text/10 text-text-light/50 text-sm text-center cursor-not-allowed border border-transparent select-none line-through">
                {time}
            </div>
        )
    }

    return (
        <button
            onClick={() => onSelect(time)}
            className={`
                px-4 py-3 rounded-xl text-sm font-medium text-center transition-all duration-300 border
                ${isSelected
                    ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20 scale-[1.03]'
                    : 'bg-surface border-border hover:border-accent/50 hover:bg-accent/5 hover:text-accent text-text'
                }
            `}
        >
            {time}
        </button>
    )
}

// ── Main page ──
export default function Turnos() {
    const navigate = useNavigate()
    const today = new Date()
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [showConfirmation, setShowConfirmation] = useState(false)

    const [form, setForm] = useState({
        nombre: '',
        telefono: '',
        receta: 'no',
        observaciones: '',
    })

    // Auto-redirect after 10 seconds when confirmation is shown
    useEffect(() => {
        if (!showConfirmation) return
        const timer = setTimeout(() => {
            navigate('/#inicio')
        }, 10000)
        return () => clearTimeout(timer)
    }, [showConfirmation, navigate])

    const handleChangeMonth = (dir) => {
        setCurrentMonth(prev => {
            const next = new Date(prev)
            next.setMonth(next.getMonth() + dir)
            return next
        })
    }

    const handleSelectDate = (date) => {
        setSelectedDate(date)
        setSelectedTime(null)
    }

    const isSaturday = selectedDate?.getDay() === 6

    const dateISO = selectedDate ? toISO(selectedDate) : null
    const reserved = dateISO ? (reservedSlots[dateISO] || []) : []

    const formattedDate = selectedDate
        ? selectedDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
        : ''

    const isFormValid = selectedDate && selectedTime && form.nombre.trim() && form.telefono.trim()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isFormValid) return
        setShowConfirmation(true)
    }

    return (
        <div className="min-h-screen bg-bg">
            <Header />

            <main className="pt-28 pb-20 px-6">
                <div className="max-w-2xl mx-auto">

                    {/* ── Hero ── */}
                    <div className="mb-12 opacity-0 animate-fade-in-up">
                        <span className="inline-block text-xs tracking-[0.3em] uppercase text-accent font-medium mb-3">
                            Visitanos
                        </span>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-text mb-3">
                            Reserva tu turno
                        </h1>
                        <p className="text-text-muted leading-relaxed max-w-lg">
                            Seleccioná tu día y horario preferido de manera rápida y sin intermediarios.
                        </p>
                    </div>

                    {/* ── Calendario ── */}
                    <div className="bg-surface rounded-2xl border border-border p-6 md:p-8 mb-8 opacity-0 animate-fade-in-up animation-delay-100">
                        <Calendar
                            selectedDate={selectedDate}
                            onSelectDate={handleSelectDate}
                            currentMonth={currentMonth}
                            onChangeMonth={handleChangeMonth}
                        />
                    </div>

                    {/* ── Bloques horarios ── */}
                    {selectedDate && (
                        <div className="bg-surface rounded-2xl border border-border p-6 md:p-8 mb-8 opacity-0 animate-fade-in-up">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-display font-bold text-text">
                                        Elegí tu bloque horario
                                    </h2>
                                    <p className="text-sm text-text-muted">
                                        Bloques de 30 min para <span className="text-accent font-medium capitalize">{formattedDate}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Mañana */}
                            <div className="mb-6">
                                <h3 className="text-xs tracking-[0.2em] uppercase text-text-muted font-semibold mb-3">
                                    Turnos mañana <span className="text-text-light font-normal">(9:00hs a 13:00hs)</span>
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {morningSlots.map((time) => (
                                        <TimeSlot
                                            key={time}
                                            time={time}
                                            isReserved={reserved.includes(time)}
                                            isSelected={selectedTime === time}
                                            onSelect={setSelectedTime}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Tarde (solo lunes a viernes) */}
                            {!isSaturday && (
                                <div>
                                    <h3 className="text-xs tracking-[0.2em] uppercase text-text-muted font-semibold mb-3">
                                        Turnos tarde <span className="text-text-light font-normal">(17:00hs a 20:00hs)</span>
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {afternoonSlots.map((time) => (
                                            <TimeSlot
                                                key={time}
                                                time={time}
                                                isReserved={reserved.includes(time)}
                                                isSelected={selectedTime === time}
                                                onSelect={setSelectedTime}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Leyenda */}
                            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-surface border border-border" />
                                    <span className="text-xs text-text-muted">Disponible</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-accent" />
                                    <span className="text-xs text-text-muted">Seleccionado</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-text/10" />
                                    <span className="text-xs text-text-muted">Reservado</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Formulario de datos ── */}
                    {selectedTime && (
                        <form
                            onSubmit={handleSubmit}
                            className="bg-surface rounded-2xl border border-border p-6 md:p-8 opacity-0 animate-fade-in-up"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-accent" />
                                </div>
                                <h2 className="text-lg font-display font-bold text-text">
                                    Tus datos personales
                                </h2>
                            </div>

                            <div className="space-y-5">
                                {/* Nombre */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-text mb-2">
                                        <User className="w-4 h-4 text-text-muted" />
                                        Nombre completo
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.nombre}
                                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                        placeholder="Ej: María García"
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-text placeholder-text-light text-sm focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all duration-300"
                                    />
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-text mb-2">
                                        <Phone className="w-4 h-4 text-text-muted" />
                                        Número de teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={form.telefono}
                                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                                        placeholder="Ej: 3515551234"
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-text placeholder-text-light text-sm focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all duration-300"
                                    />
                                </div>

                                {/* Receta */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-text mb-2">
                                        <FileText className="w-4 h-4 text-text-muted" />
                                        ¿Posee receta médica?
                                    </label>
                                    <select
                                        value={form.receta}
                                        onChange={(e) => setForm({ ...form, receta: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-text text-sm focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all duration-300 appearance-none cursor-pointer"
                                    >
                                        <option value="no">No, necesito evaluación</option>
                                        <option value="si">Sí, ya tengo receta</option>
                                    </select>
                                </div>

                                {/* Observaciones */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-text mb-2">
                                        <MessageSquare className="w-4 h-4 text-text-muted" />
                                        Observaciones o comentarios adicionales
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={form.observaciones}
                                        onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                                        placeholder="Contanos si tenés alguna consulta particular..."
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-text placeholder-text-light text-sm focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all duration-300 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Resumen + Submit */}
                            <div className="mt-8 pt-6 border-t border-border">
                                {/* Resumen */}
                                <div className="bg-accent/5 border border-accent/15 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-text-muted">
                                        📅 <span className="font-medium text-text capitalize">{formattedDate}</span> a las{' '}
                                        <span className="font-medium text-text">{selectedTime}hs</span>
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isFormValid}
                                    className={`
                                        w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300
                                        ${isFormValid
                                            ? 'bg-accent text-white hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5 cursor-pointer'
                                            : 'bg-text/10 text-text-light cursor-not-allowed'
                                        }
                                    `}
                                >
                                    Confirmar turno!
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </main>

            <Footer />

            {/* ── Modal de confirmación ── */}
            {showConfirmation && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-6">
                    <div className="bg-surface rounded-2xl border border-border p-8 md:p-12 max-w-md w-full text-center shadow-2xl animate-fade-in-up">
                        {/* Checkmark circle */}
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-accent flex items-center justify-center">
                            <Check className="w-10 h-10 text-accent" strokeWidth={2.5} />
                        </div>

                        <h2 className="text-2xl font-display font-bold text-text mb-3">
                            ¡Turno reservado exitosamente!
                        </h2>
                        <p className="text-text-muted leading-relaxed">
                            Tu turno ha sido reservado para{' '}
                            <span className="font-medium text-text capitalize">{formattedDate}</span>{' '}
                            a las <span className="font-medium text-text">{selectedTime}hs</span>
                        </p>

                        <p className="text-xs text-text-light mt-6">
                            Serás redirigido a la página principal en unos segundos...
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
