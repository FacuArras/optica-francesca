import { useEffect, useState, useMemo } from 'react'
import { Search, Filter, Trash2, Edit3, Check, X, Copy, MessageCircle, ChevronDown, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react'
import { createPortal } from 'react-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

// ── Variables ──

function formatDate(fecha) {
    const d = new Date(fecha + 'T00:00:00')
    return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function isPast(fecha, hora) {
    const today = new Date()
    if (!hora) {
        today.setHours(0, 0, 0, 0)
        const d = new Date(fecha + 'T00:00:00')
        return d < today
    }

    const [year, month, day] = fecha.split('-').map(Number)
    const [h, m] = hora.split(':').map(Number)
    const d = new Date(year, month - 1, day, h, m)
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
        <>
            <div className="fixed inset-0 z-20" onClick={onClose} />
            <div className="absolute z-30 mt-1 md:mt-0 md:top-1/2 md:-translate-y-1/2 right-0 md:right-auto md:left-full md:ml-2 bg-surface rounded-xl border border-border shadow-xl py-1 min-w-[200px] animate-slide-down">
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
        </>
    )
}

// ── Login screen ──
function LoginScreen({ onLogin }) {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(false)

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            if (res.ok) {
                // If it's valid, we store in session and enter
                sessionStorage.setItem('adminAuth', 'true')
                onLogin()
            } else {
                throw new Error('Incorrecta')
            }
        } catch (err) {
            setError(true)
            setTimeout(() => setError(false), 2000)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="py-10 md:py-20 flex items-center justify-center px-6">
            <form
                onSubmit={handleSubmit}
                className="bg-surface rounded-2xl border border-border p-8 md:p-10 w-full max-w-sm opacity-0 animate-fade-in-up"
            >
                <p className="text-text-muted text-sm mb-6">Para continuar necesitamos que ingreses tu contraseña:</p>

                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        autoFocus
                        className={`
                            w-full px-4 py-3 rounded-xl border bg-bg text-text placeholder-text-light text-sm
                            focus:outline-none transition-all duration-300 pr-12
                            ${error
                                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                                : 'border-border focus:border-accent/50 focus:ring-2 focus:ring-accent/10'
                            }
                        `}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>

                {error && (
                    <p className="text-red-500 text-xs mb-3 animate-fade-in">Contraseña incorrecta</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 text-sm disabled:opacity-70"
                >
                    {loading ? 'Verificando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    )
}

// ── Dashboard ──
function Dashboard() {
    const [appointments, setAppointments] = useState([])
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('all') // all | pending | confirmed | past
    const [phonePopup, setPhonePopup] = useState(null) // appointment id
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [confirmModal, setConfirmModal] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        setCurrentPage(1)
    }, [search, filterStatus])

    useEffect(() => {
        fetch('/api/turnos/all')
            .then(res => res.json())
            .then(data => setAppointments(data))
            .catch(err => console.error('Error fetching appointments:', err))
    }, [])

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
                if (q && !a.nombre.toLowerCase().includes(q) && !(a.email || '').toLowerCase().includes(q) && !a.telefono.includes(q) && !a.fecha.includes(q)) {
                    return false
                }
                // Filter
                if (filterStatus === 'pending') return !isPast(a.fecha, a.hora) && !a.confirmado
                if (filterStatus === 'confirmed') return !isPast(a.fecha, a.hora) && a.confirmado
                if (filterStatus === 'past') return isPast(a.fecha, a.hora)
                return true
            })
            .sort((a, b) => {
                // Show upcoming first, then past
                const aPast = isPast(a.fecha, a.hora)
                const bPast = isPast(b.fecha, b.hora)
                if (aPast !== bPast) return aPast ? 1 : -1
                return a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)
            })
    }, [appointments, search, filterStatus])

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleDelete = (id) => setConfirmModal({ type: 'delete', id })

    const confirmDelete = async (id) => {
        try {
            const res = await fetch(`/api/turnos/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setAppointments(prev => prev.filter(a => a.id !== id))
            } else {
                alert('No se pudo borrar el turno')
            }
        } catch (err) {
            console.error('Error deleting:', err)
            alert('Error de conexión al intentar borrar')
        }
        setConfirmModal(null)
    }

    const handleToggleConfirm = async (id, isConfirmado) => {
        try {
            const res = await fetch(`/api/turnos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmado: !isConfirmado })
            })
            if (res.ok) {
                setAppointments(prev => prev.map(a =>
                    a.id === id ? { ...a, confirmado: !isConfirmado } : a
                ))
            }
        } catch (err) {
            console.error('Error toggling confirm:', err)
        }
    }

    const startEdit = (appointment) => {
        setEditingId(appointment.id)
        setEditForm({ ...appointment })
    }

    const saveEdit = () => setConfirmModal({ type: 'edit' })

    const confirmSaveEdit = async () => {
        try {
            const res = await fetch(`/api/turnos/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            })

            const data = await res.json()
            if (res.ok) {
                setAppointments(prev => prev.map(a =>
                    a.id === editingId ? { ...data.turno } : a
                ))
                setEditingId(null)
                setEditForm({})
            } else {
                alert(data.error || 'Error al guardar los cambios')
            }
        } catch (err) {
            console.error('Error saving:', err)
            alert('Error de conexión')
        }
        setConfirmModal(null)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm({})
    }

    const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']
    const afternoonSlots = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30']
    const allSlots = [...morningSlots, ...afternoonSlots]

    const reservedSlotsOnEditDate = useMemo(() => {
        if (!editForm.fecha) return []
        return appointments
            .filter(a => a.fecha === editForm.fecha && a.id !== editingId)
            .map(a => a.hora)
    }, [appointments, editForm.fecha, editingId])

    const renderEditForm = () => (
        <div className="bg-surface rounded-2xl border border-accent/30 p-5 space-y-3 w-full">
            <div className="grid grid-cols-2 gap-2">
                <input type="date" value={editForm.fecha} onChange={e => setEditForm({ ...editForm, fecha: e.target.value })} className="px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs" />
                <select value={editForm.hora} onChange={e => setEditForm({ ...editForm, hora: e.target.value })} className="px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs">
                    <option value="" disabled>Selecciona hora</option>
                    {allSlots.map(time => {
                        const isReserved = reservedSlotsOnEditDate.includes(time)
                        if (isReserved) return null
                        return <option key={time} value={time}>{time}</option>
                    })}
                </select>
            </div>
            <input type="text" value={editForm.nombre} onChange={e => setEditForm({ ...editForm, nombre: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs" placeholder="Nombre" />
            <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs" placeholder="Email" />
            <input type="text" value={editForm.telefono} onChange={e => setEditForm({ ...editForm, telefono: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs" placeholder="Teléfono" />
            <input type="text" value={editForm.observaciones} onChange={e => setEditForm({ ...editForm, observaciones: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs" placeholder="Observaciones" />
            <div className="grid grid-cols-2 gap-2">
                <select value={editForm.receta ? 'si' : 'no'} onChange={e => setEditForm({ ...editForm, receta: e.target.value === 'si' })} className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs">
                    <option value="si">Con receta</option>
                    <option value="no">Sin receta</option>
                </select>
                <select value={editForm.confirmado ? 'si' : 'no'} onChange={e => setEditForm({ ...editForm, confirmado: e.target.value === 'si' })} className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-text text-xs">
                    <option value="si">Confirmado</option>
                    <option value="no">Pendiente</option>
                </select>
            </div>
            <div className="flex flex-col gap-2 pt-1">
                <button onClick={saveEdit} className="w-full py-2 bg-accent text-white rounded-full text-xs font-semibold hover:bg-accent-hover transition-colors">Guardar</button>
                <button onClick={cancelEdit} className="w-full py-2 border border-border text-text-muted rounded-full text-xs font-semibold hover:bg-accent/5 transition-colors">Cancelar</button>
            </div>
        </div>
    )

    return (
        <div className="opacity-0 animate-fade-in-up">
            {/* Search & Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                    <input
                        type="text"
                        placeholder="Buscar por día, teléfono o nombre ..."
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

            {/* Results count & Actions */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-text-light">
                    {filtered.length} turno{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* ── Table (desktop) ── */}
            <div className="hidden md:block bg-surface rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-center px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Fecha y hora</th>
                                <th className="text-center px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Paciente info</th>
                                <th className="text-center px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Teléfono</th>
                                <th className="text-center px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Receta</th>
                                <th className="text-center px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Observaciones</th>
                                <th className="text-center px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Confirmado?</th>
                                <th className="text-right px-5 py-4 text-xs tracking-wider uppercase text-text-muted font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedItems.map((a) => {
                                const past = isPast(a.fecha, a.hora)
                                const isEditing = editingId === a.id

                                if (isEditing) {
                                    return (
                                        <tr key={a.id} className="border-b border-border bg-accent/5">
                                            <td colSpan="7" className="p-4">
                                                {renderEditForm()}
                                            </td>
                                        </tr>
                                    )
                                }

                                return (
                                    <tr
                                        key={a.id}
                                        className={`border-b border-border last:border-b-0 transition-all duration-200 ${past ? 'bg-text/5 opacity-60' : 'hover:bg-accent/[0.03]'
                                            }`}
                                    >
                                        <td className="px-5 py-4 text-center">
                                            <div className={`font-medium ${past ? 'text-text-light' : 'text-text'}`}>
                                                {formatDate(a.fecha)}
                                            </div>
                                            <div className="text-text-light text-xs">{a.hora}hs</div>
                                        </td>
                                        <td className={`px-5 py-4 text-center font-medium ${past ? 'text-text-light' : 'text-text'}`}>
                                            <div>{a.nombre}</div>
                                            <div className="text-xs font-normal text-text-muted">{a.email}</div>
                                        </td>
                                        <td className="px-5 py-4 text-center relative">
                                            <button
                                                onClick={() => setPhonePopup(phonePopup === a.id ? null : a.id)}
                                                className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors text-sm inline-block"
                                            >
                                                {a.telefono}
                                            </button>
                                            {phonePopup === a.id && (
                                                <PhoneActions telefono={a.telefono} onClose={() => setPhonePopup(null)} />
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${a.receta
                                                ? 'bg-accent/10 text-accent'
                                                : 'bg-text/5 text-text-muted'
                                                }`}>
                                                {a.receta ? 'Sí' : 'No'}
                                            </span>
                                        </td>
                                        <td className={`px-5 py-4 text-center text-xs max-w-xs break-words mx-auto ${past ? 'text-text-light' : 'text-text-muted'}`}>
                                            {a.observaciones || '—'}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            {past ? (
                                                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-text/10 text-text-muted">
                                                    Terminado
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleConfirm(a.id, a.confirmado)}
                                                    className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${a.confirmado
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
                                            <div className="flex items-center justify-end gap-1">
                                                {!past && (
                                                    <button
                                                        onClick={() => startEdit(a)}
                                                        className="p-2 rounded-lg hover:bg-accent/10 text-text-muted hover:text-accent transition-all duration-200"
                                                        title="Editar"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(a.id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-all duration-200"
                                                    title="Borrar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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
                {paginatedItems.map((a) => {
                    const past = isPast(a.fecha, a.hora)
                    const isEditing = editingId === a.id

                    if (isEditing) {
                        return (
                            <div key={a.id}>
                                {renderEditForm()}
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
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-text/10 text-text-muted">
                                        Terminado
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleToggleConfirm(a.id, a.confirmado)}
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
                                    <div className="text-text-muted mt-1 mb-1">✉️ {a.email}</div>
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

                            <div className="flex gap-2 pt-2 border-t border-border">
                                {!past && (
                                    <button
                                        onClick={() => startEdit(a)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-text-muted hover:text-accent hover:bg-accent/5 transition-all"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" /> Editar
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(a.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Borrar
                                </button>
                            </div>
                        </div>
                    )
                })}
                {filtered.length === 0 && (
                    <div className="py-12 text-center text-text-muted text-sm bg-surface rounded-2xl border border-border">
                        No se encontraron turnos
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
                    <p className="text-xs text-text-muted">
                        Página {currentPage} de {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.max(1, p - 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl border border-border bg-surface text-text hover:bg-accent/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.min(totalPages, p + 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-xl border border-border bg-surface text-text hover:bg-accent/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {confirmModal && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmModal(null)} />
                    <div className="relative bg-surface rounded-2xl border border-border p-8 w-full max-w-sm flex flex-col items-center justify-center text-center shadow-2xl animate-fade-in-up">
                        <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-5 bg-bg">
                            {confirmModal.type === 'edit'
                                ? <Edit3 className="w-8 h-8 text-text" />
                                : <Trash2 className="w-8 h-8 text-red-500" />
                            }
                        </div>
                        <p className="text-text-muted text-sm mb-2">
                            {confirmModal.type === 'edit'
                                ? 'Esta accion modificará el turno guardado'
                                : 'Esta acción eliminará el turno de forma irreversible'}
                        </p>
                        <h3 className="text-xl font-semibold text-text mb-8">
                            ¿Estás seguro?
                        </h3>
                        <div className="flex items-center gap-3 w-full">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="flex-1 py-3 bg-bg border border-border text-text rounded-[10px] text-sm font-semibold hover:bg-text/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmModal.type === 'edit' ? confirmSaveEdit : () => confirmDelete(confirmModal.id)}
                                className={`flex-1 py-3 text-white rounded-[10px] text-sm font-semibold transition-colors ${confirmModal.type === 'edit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

// ── Main page ──
export default function Admin() {
    const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('adminAuth') === 'true')

    return (
        <div className="min-h-screen bg-bg">
            <Header />

            <main className="pt-28 pb-20 px-6 min-h-[90vh]">
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
