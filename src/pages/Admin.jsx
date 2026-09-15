import { useState, useMemo } from 'react'
import { Search, Filter, Trash2, Edit3, Check, X, Copy, MessageCircle, ChevronDown } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

// ── Mock: turnos registrados ──
const initialAppointments = [
    {
        id: 1,
        fecha: '2026-09-15',
        hora: '09:00',
        nombre: 'María García',
        telefono: '351 555-1234',
        receta: true,
        observaciones: 'Necesita lentes multifocales',
        confirmado: true,
    },
    {
        id: 2,
        fecha: '2026-09-15',
        hora: '10:30',
        nombre: 'Juan Pérez',
        telefono: '351 444-5678',
        receta: false,
        observaciones: '',
        confirmado: false,
    },
    {
        id: 3,
        fecha: '2026-09-16',
        hora: '11:00',
        nombre: 'Laura Rodríguez',
        telefono: '351 333-9012',
        receta: true,
        observaciones: 'Control anual de vista',
        confirmado: true,
    },
    {
        id: 4,
        fecha: '2026-09-17',
        hora: '09:30',
        nombre: 'Carlos López',
        telefono: '351 222-3456',
        receta: false,
        observaciones: 'Primera visita',
        confirmado: false,
    },
    {
        id: 5,
        fecha: '2026-09-18',
        hora: '17:30',
        nombre: 'Ana Martínez',
        telefono: '351 111-7890',
        receta: true,
        observaciones: 'Cambio de armazón',
        confirmado: true,
    },
    {
        id: 6,
        fecha: '2026-09-12',
        hora: '10:00',
        nombre: 'Pedro Sánchez',
        telefono: '351 666-1234',
        receta: false,
        observaciones: 'Consulta por lentes de contacto',
        confirmado: true,
    },
    {
        id: 7,
        fecha: '2026-09-10',
        hora: '12:00',
        nombre: 'Sofía Fernández',
        telefono: '351 777-5678',
        receta: true,
        observaciones: '',
        confirmado: true,
    },
]

const ADMIN_PASSWORD = '123'

function formatDate(fecha) {
    const d = new Date(fecha + 'T00:00:00')
    return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function isPast(fecha) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const d = new Date(fecha + 'T00:00:00')
    return d < today
}

// ── Phone actions popup ──
function PhoneActions({ telefono, onClose }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(telefono)
        onClose()
    }

    const handleWhatsApp = () => {
        const cleaned = telefono.replace(/\D/g, '')
        window.open(`https://wa.me/54${cleaned}`, '_blank')
        onClose()
    }

    return (
        <div className="absolute z-30 mt-1 right-0 bg-surface rounded-xl border border-border shadow-xl py-1 min-w-[200px] animate-slide-down">
            <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-accent/5 hover:text-accent transition-all duration-200"
            >
                <Copy className="w-4 h-4" />
                Copiar número
            </button>
            <button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-accent/5 hover:text-accent transition-all duration-200"
            >
                <MessageCircle className="w-4 h-4" />
                Enviar WhatsApp
            </button>
        </div>
    )
}

// ── Login screen ──
function LoginScreen({ onLogin }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password === ADMIN_PASSWORD) {
            onLogin()
        } else {
            setError(true)
            setTimeout(() => setError(false), 2000)
        }
    }

    return (
        <div className="py-10 md:py-20 flex items-center justify-center px-6">
            <form
                onSubmit={handleSubmit}
                className="bg-surface rounded-2xl border border-border p-8 md:p-10 w-full max-w-sm opacity-0 animate-fade-in-up"
            >
                <p className="text-text-muted text-sm mb-6">Para continuar necesitamos que ingreses tu contraseña:</p>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    autoFocus
                    className={`
                        w-full px-4 py-3 rounded-xl border bg-bg text-text placeholder-text-light text-sm
                        focus:outline-none transition-all duration-300 mb-4
                        ${error
                            ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                            : 'border-border focus:border-accent/50 focus:ring-2 focus:ring-accent/10'
                        }
                    `}
                />

                {error && (
                    <p className="text-red-500 text-xs mb-3 animate-fade-in">Contraseña incorrecta</p>
                )}

                <button
                    type="submit"
                    className="w-full py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 text-sm"
                >
                    Ingresar
                </button>
            </form>
        </div>
    )
}

// ── Dashboard ──
function Dashboard() {
    const [appointments, setAppointments] = useState(initialAppointments)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('all') // all | pending | confirmed | past
    const [phonePopup, setPhonePopup] = useState(null) // appointment id
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)

    const filterLabels = {
        all: 'Todos',
        pending: 'Pendientes',
        confirmed: 'Confirmados',
        past: 'Finalizados',
    }

    const filtered = useMemo(() => {
        return appointments
            .filter((a) => {
                // Search
                const q = search.toLowerCase()
                if (q && !a.nombre.toLowerCase().includes(q) && !a.telefono.includes(q) && !a.fecha.includes(q)) {
                    return false
                }
                // Filter
                if (filterStatus === 'pending') return !isPast(a.fecha) && !a.confirmado
                if (filterStatus === 'confirmed') return !isPast(a.fecha) && a.confirmado
                if (filterStatus === 'past') return isPast(a.fecha)
                return true
            })
            .sort((a, b) => {
                // Show upcoming first, then past
                const aPast = isPast(a.fecha)
                const bPast = isPast(b.fecha)
                if (aPast !== bPast) return aPast ? 1 : -1
                return a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)
            })
    }, [appointments, search, filterStatus])

    const handleDelete = (id) => {
        setAppointments(prev => prev.filter(a => a.id !== id))
    }

    const handleToggleConfirm = (id) => {
        setAppointments(prev => prev.map(a =>
            a.id === id ? { ...a, confirmado: !a.confirmado } : a
        ))
    }

    const startEdit = (appointment) => {
        setEditingId(appointment.id)
        setEditForm({ ...appointment })
    }

    const saveEdit = () => {
        setAppointments(prev => prev.map(a =>
            a.id === editingId ? { ...editForm } : a
        ))
        setEditingId(null)
        setEditForm({})
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm({})
    }

    return (
        <div className="opacity-0 animate-fade-in-up">
            {/* Search & Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, teléfono o fecha..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text placeholder-text-light text-sm focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all duration-300"
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text hover:border-accent/50 transition-all duration-300 w-full sm:w-auto justify-between sm:justify-start"
                    >
                        <Filter className="w-4 h-4 text-text-muted" />
                        {filterLabels[filterStatus]}
                        <ChevronDown className="w-4 h-4 text-text-light" />
                    </button>
                    {showFilterDropdown && (
                        <div className="absolute z-20 top-full mt-1 right-0 left-0 sm:left-auto bg-surface rounded-xl border border-border shadow-xl py-1 min-w-[160px] animate-slide-down">
                            {Object.entries(filterLabels).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => { setFilterStatus(key); setShowFilterDropdown(false) }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 ${filterStatus === key
                                        ? 'text-accent bg-accent/5 font-medium'
                                        : 'text-text hover:bg-accent/5 hover:text-accent'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Results count */}
            <p className="text-xs text-text-light mb-4">
                {filtered.length} turno{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* ── Table (desktop) ── */}
            <div className="hidden md:block bg-surface rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Fecha y hora</th>
                                <th className="text-left px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Paciente</th>
                                <th className="text-left px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Teléfono</th>
                                <th className="text-left px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Receta</th>
                                <th className="text-left px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Observaciones</th>
                                <th className="text-left px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Confirmado?</th>
                                <th className="text-right px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((a) => {
                                const past = isPast(a.fecha)
                                const isEditing = editingId === a.id

                                if (isEditing) {
                                    return (
                                        <tr key={a.id} className="border-b border-border bg-accent/5">
                                            <td className="px-5 py-3">
                                                <input type="date" value={editForm.fecha} onChange={e => setEditForm({ ...editForm, fecha: e.target.value })} className="px-2 py-1 rounded-lg border border-border bg-bg text-text text-xs w-28" />
                                                <input type="text" value={editForm.hora} onChange={e => setEditForm({ ...editForm, hora: e.target.value })} className="px-2 py-1 rounded-lg border border-border bg-bg text-text text-xs w-16 ml-1" />
                                            </td>
                                            <td className="px-5 py-3">
                                                <input type="text" value={editForm.nombre} onChange={e => setEditForm({ ...editForm, nombre: e.target.value })} className="px-2 py-1 rounded-lg border border-border bg-bg text-text text-xs w-full" />
                                            </td>
                                            <td className="px-5 py-3">
                                                <input type="text" value={editForm.telefono} onChange={e => setEditForm({ ...editForm, telefono: e.target.value })} className="px-2 py-1 rounded-lg border border-border bg-bg text-text text-xs w-full" />
                                            </td>
                                            <td className="px-5 py-3">
                                                <select value={editForm.receta ? 'si' : 'no'} onChange={e => setEditForm({ ...editForm, receta: e.target.value === 'si' })} className="px-2 py-1 rounded-lg border border-border bg-bg text-text text-xs">
                                                    <option value="si">Sí</option>
                                                    <option value="no">No</option>
                                                </select>
                                            </td>
                                            <td className="px-5 py-3">
                                                <input type="text" value={editForm.observaciones} onChange={e => setEditForm({ ...editForm, observaciones: e.target.value })} className="px-2 py-1 rounded-lg border border-border bg-bg text-text text-xs w-full" />
                                            </td>
                                            <td className="px-5 py-3">—</td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={saveEdit} className="p-2 rounded-lg hover:bg-green-500/10 text-green-600 transition-colors"><Check className="w-4 h-4" /></button>
                                                    <button onClick={cancelEdit} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }

                                return (
                                    <tr
                                        key={a.id}
                                        className={`border-b border-border last:border-b-0 transition-colors duration-200 ${past ? 'bg-text/[0.03] text-text-light' : 'hover:bg-accent/[0.03]'
                                            }`}
                                    >
                                        <td className="px-5 py-4">
                                            <div className={`font-medium ${past ? 'text-text-light' : 'text-text'}`}>
                                                {formatDate(a.fecha)}
                                            </div>
                                            <div className="text-text-light text-xs">{a.hora}hs</div>
                                        </td>
                                        <td className={`px-5 py-4 font-medium ${past ? 'text-text-light' : 'text-text'}`}>
                                            {a.nombre}
                                        </td>
                                        <td className="px-5 py-4 relative">
                                            <button
                                                onClick={() => setPhonePopup(phonePopup === a.id ? null : a.id)}
                                                className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors text-sm"
                                            >
                                                {a.telefono}
                                            </button>
                                            {phonePopup === a.id && (
                                                <PhoneActions telefono={a.telefono} onClose={() => setPhonePopup(null)} />
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${a.receta
                                                ? 'bg-accent/10 text-accent'
                                                : 'bg-text/5 text-text-muted'
                                                }`}>
                                                {a.receta ? 'Sí' : 'No'}
                                            </span>
                                        </td>
                                        <td className={`px-5 py-4 text-xs max-w-[200px] truncate ${past ? 'text-text-light' : 'text-text-muted'}`}>
                                            {a.observaciones || '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            {past ? (
                                                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-text/10 text-text-light">
                                                    Finalizada
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleConfirm(a.id)}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${a.confirmado
                                                        ? 'bg-green-500/10 text-green-700'
                                                        : 'bg-amber-500/10 text-amber-700'
                                                        }`}
                                                >
                                                    {a.confirmado ? <Check className="w-3 h-3" /> : null}
                                                    {a.confirmado ? 'Sí' : 'No'}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {!past && (
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => startEdit(a)}
                                                        className="p-2 rounded-lg hover:bg-accent/10 text-text-muted hover:text-accent transition-all duration-200"
                                                        title="Editar"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(a.id)}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-all duration-200"
                                                        title="Borrar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="py-12 text-center text-text-muted text-sm">
                        No se encontraron turnos
                    </div>
                )}
            </div>

            {/* ── Cards (mobile) ── */}
            <div className="md:hidden flex flex-col gap-3">
                {filtered.map((a) => {
                    const past = isPast(a.fecha)
                    const isEditing = editingId === a.id

                    if (isEditing) {
                        return (
                            <div key={a.id} className="bg-surface rounded-2xl border border-accent/30 p-5 space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="date" value={editForm.fecha} onChange={e => setEditForm({ ...editForm, fecha: e.target.value })} className="px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs" />
                                    <input type="text" value={editForm.hora} onChange={e => setEditForm({ ...editForm, hora: e.target.value })} className="px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs" placeholder="Hora" />
                                </div>
                                <input type="text" value={editForm.nombre} onChange={e => setEditForm({ ...editForm, nombre: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs" placeholder="Nombre" />
                                <input type="text" value={editForm.telefono} onChange={e => setEditForm({ ...editForm, telefono: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs" placeholder="Teléfono" />
                                <input type="text" value={editForm.observaciones} onChange={e => setEditForm({ ...editForm, observaciones: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs" placeholder="Observaciones" />
                                <div className="flex gap-2">
                                    <select value={editForm.receta ? 'si' : 'no'} onChange={e => setEditForm({ ...editForm, receta: e.target.value === 'si' })} className="flex-1 px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs">
                                        <option value="si">Con receta</option>
                                        <option value="no">Sin receta</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <button onClick={saveEdit} className="flex-1 py-2 bg-accent text-white rounded-full text-xs font-semibold hover:bg-accent-hover transition-colors">Guardar</button>
                                    <button onClick={cancelEdit} className="flex-1 py-2 border border-border text-text-muted rounded-full text-xs font-semibold hover:bg-accent/5 transition-colors">Cancelar</button>
                                </div>
                            </div>
                        )
                    }

                    return (
                        <div
                            key={a.id}
                            className={`bg-surface rounded-2xl border p-5 transition-all duration-200 ${past ? 'border-border/50 opacity-60' : 'border-border'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className={`font-medium text-sm ${past ? 'text-text-light' : 'text-text'}`}>
                                        {a.nombre}
                                    </p>
                                    <p className="text-xs text-text-light mt-0.5">
                                        {formatDate(a.fecha)} · {a.hora}hs
                                    </p>
                                </div>
                                {past ? (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-text/10 text-text-light">
                                        Finalizada
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleToggleConfirm(a.id)}
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${a.confirmado
                                            ? 'bg-green-500/10 text-green-700'
                                            : 'bg-amber-500/10 text-amber-700'
                                            }`}
                                    >
                                        {a.confirmado ? '✓ Confirmado' : 'Pendiente'}
                                    </button>
                                )}
                            </div>

                            <div className="space-y-1.5 text-xs mb-3">
                                <div className="relative inline-block">
                                    <button
                                        onClick={() => setPhonePopup(phonePopup === a.id ? null : a.id)}
                                        className="text-accent underline underline-offset-2"
                                    >
                                        📱 {a.telefono}
                                    </button>
                                    {phonePopup === a.id && (
                                        <PhoneActions telefono={a.telefono} onClose={() => setPhonePopup(null)} />
                                    )}
                                </div>
                                <p className="text-text-muted">
                                    📋 Receta: <span className={a.receta ? 'text-accent font-medium' : ''}>{a.receta ? 'Sí' : 'No'}</span>
                                </p>
                                {a.observaciones && (
                                    <p className="text-text-muted">💬 {a.observaciones}</p>
                                )}
                            </div>

                            {!past && (
                                <div className="flex gap-2 pt-2 border-t border-border">
                                    <button
                                        onClick={() => startEdit(a)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-text-muted hover:text-accent hover:bg-accent/5 transition-all"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(a.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Borrar
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
                {filtered.length === 0 && (
                    <div className="py-12 text-center text-text-muted text-sm bg-surface rounded-2xl border border-border">
                        No se encontraron turnos
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Main page ──
export default function Admin() {
    const [authenticated, setAuthenticated] = useState(false)

    return (
        <div className="min-h-screen bg-bg">
            <Header />

            <main className="pt-28 pb-20 px-6">
                <div className="max-w-5xl mx-auto">

                    {/* Hero */}
                    <div className="mb-8 opacity-0 animate-fade-in-up">
                        <span className="inline-block text-xs tracking-[0.3em] uppercase text-accent font-medium mb-3">
                            Perfil de administración
                        </span>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-text mb-3">
                            Gestiona tus turnos
                        </h1>
                        <p className="text-text-muted leading-relaxed max-w-lg">
                            Visualizá, editá y borrá tus turnos a tu gusto.
                        </p>
                    </div>

                    {/* Content */}
                    {authenticated ? <Dashboard /> : <LoginScreen onLogin={() => setAuthenticated(true)} />}

                </div>
            </main>

            <Footer />
        </div>
    )
}
