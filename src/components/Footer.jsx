import { Instagram, Phone, MapPin, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerLinks = {
    empresa: [
        { label: 'Inicio', href: '#inicio' },
        { label: 'Servicios', href: '#servicios' },
        { label: 'Ubicación', href: '#ubicacion' },
        { label: 'Reservar turno', href: '/turnos', isRoute: true },
    ],
    contacto: [
        { icon: Phone, label: '3515575877', href: 'https://wa.me/5493515575877' },
        { icon: MessageCircle, label: 'Enviar WhatsApp', href: 'https://wa.me/5493515575877' },
        { icon: MapPin, label: 'Carlos Gimenez 64, Córdoba', href: "https://www.google.com/maps/dir//''/data=!4m7!4m6!1m1!4e2!1m2!1m1!1s0x94329834a0ae6807:0x8be826879e1fa39b!3e0?g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF" },
    ],
}

export default function Footer() {
    return (
        <footer id="contacto" className="relative pt-16 pb-8 px-6 bg-accent text-white">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <a href="#inicio" className="flex items-center gap-3 mb-5 group">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                                <img src="/logo-blanco.png" alt="Logo Óptica Francesca" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs tracking-[0.3em] uppercase text-white/60 font-medium">Óptica</span>
                                <span className="text-lg font-display font-bold text-white leading-tight -mt-0.5">Francesca</span>
                            </div>
                        </a>
                        <p className="text-sm text-white/70 leading-relaxed">
                            Porque cada mirada cuenta una historia, y nosotros queremos que la veas con toda claridad.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 font-semibold mb-5">
                            Navegación
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {footerLinks.empresa.map((link) => (
                                <li key={link.label}>
                                    {link.isRoute ? (
                                        <Link
                                            to={link.href}
                                            className="text-sm text-white/70 hover:text-white transition-colors duration-300"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            className="text-sm text-white/70 hover:text-white transition-colors duration-300"
                                        >
                                            {link.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 font-semibold mb-5">
                            Contáctanos
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {footerLinks.contacto.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target={link.href.startsWith('http') ? "_blank" : undefined}
                                        rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
                                        className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors duration-300 group"
                                    >
                                        <link.icon className="w-4 h-4 text-white/50 group-hover:text-white transition-colors duration-300" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 font-semibold mb-5">
                            Redes sociales
                        </h4>
                        <a
                            href="https://instagram.com/opticafrancesca"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 hover:border-white/25 transition-all duration-300 group"
                        >
                            <Instagram className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                            <span className="text-sm text-white/70 group-hover:text-white transition-colors duration-300">
                                @opticafrancesca_
                            </span>
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/40">
                        © {new Date().getFullYear()} Óptica Francesca, Argentina. Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-white/25">
                        Diseñado y desarrollado por <span className="text-white/40">DobleR</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}
