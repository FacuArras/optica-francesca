import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Ubicación', href: '#ubicacion' },
]

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // After navigating to home with a hash, scroll to the section
    useEffect(() => {
        if (location.pathname === '/' && location.hash) {
            const el = document.querySelector(location.hash)
            if (el) {
                setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
            }
        }
    }, [location])

    const handleNavClick = (e, href) => {
        if (location.pathname !== '/') {
            e.preventDefault()
            navigate('/' + href)
        }
        setIsOpen(false)
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-bg/90 backdrop-blur-xl border-b border-border shadow-sm'
                : 'bg-transparent'
                }`}
        >
            <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl  border border-accent/20 flex items-center justify-center group-hover:bg-accent/15 transition-all duration-300 overflow-hidden p-1">
                        <img src="/logo.png" alt="Logo Óptica Francesca" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs tracking-[0.3em] uppercase text-text-muted font-medium">Óptica</span>
                        <span className="text-lg font-display font-bold text-text leading-tight -mt-0.5">Francesca</span>
                    </div>
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="px-4 py-2 text-sm text-text-muted hover:text-accent rounded-lg hover:bg-accent/5 transition-all duration-300"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link
                        to="/turnos"
                        className="ml-4 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
                    >
                        Reservar turno
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-accent/50 transition-all duration-300"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="w-5 h-5 text-text" /> : <Menu className="w-5 h-5 text-text" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden animate-slide-down bg-surface/95 backdrop-blur-xl border-b border-border">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="px-4 py-3 text-text-muted hover:text-accent hover:bg-accent/5 rounded-xl transition-all duration-300"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            to="/turnos"
                            onClick={() => setIsOpen(false)}
                            className="mt-2 px-5 py-3 bg-accent text-white text-center font-semibold rounded-full hover:bg-accent-hover transition-all duration-300"
                        >
                            Reservar turno
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
