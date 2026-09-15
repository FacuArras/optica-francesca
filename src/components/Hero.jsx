import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
    return (
        <section
            id="inicio"
            className="relative flex flex-col items-center justify-center px-6 pt-36 pb-24 overflow-hidden"
        >
            {/* Subtle background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="relative w-full max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-border bg-surface/80 backdrop-blur-sm opacity-0 animate-fade-in-up">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-xs text-text-muted tracking-wide uppercase">Cuidado visual profesional</span>
                </div>

                {/* Title */}
                <h1 className="opacity-0 animate-fade-in-up animation-delay-100 mb-4">
                    <span className="block text-base sm:text-lg md:text-xl tracking-[0.4em] uppercase text-text-muted font-light mb-2">
                        Óptica
                    </span>
                    <span className="block text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-black text-text leading-[0.95]">
                        FRANCESCA
                    </span>
                </h1>

                {/* Divider */}
                <div className="w-16 h-0.5 bg-accent mx-auto my-6 md:my-8 opacity-0 animate-fade-in-up animation-delay-200 rounded-full" />

                {/* Tagline */}
                <p className="text-sm sm:text-base md:text-lg text-text-muted leading-relaxed max-w-md md:max-w-xl mx-auto mb-8 md:mb-10 opacity-0 animate-fade-in-up animation-delay-300 px-2">
                    Porque cada mirada cuenta una historia, y nosotros queremos que la veas con toda claridad.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 opacity-0 animate-fade-in-up animation-delay-400 px-2">
                    <Link
                        to="/turnos"
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent-hover transition-all duration-300 hover:shadow-xl hover:shadow-accent/15 hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                        Reservá acá tu turno
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    <a
                        href="#servicios"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 border border-border text-text-muted rounded-full hover:border-accent/50 hover:text-accent hover:bg-accent/5 transition-all duration-300 text-sm sm:text-base"
                    >
                        Conocé más sobre nosotros
                    </a>
                </div>
            </div>

        </section>
    )
}
