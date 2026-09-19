import { ArrowRight, ChevronDown, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
    return (
        <section
            id="inicio"
            className="relative flex flex-col items-center justify-center px-6 pt-32 lg:pt-40 pb-24 lg:pb-32 overflow-hidden"
        >
            {/* Subtle background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">

                {/* Left Content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col pt-8 lg:pt-0">
                    {/* Title */}
                    <h1 className="opacity-0 animate-fade-in-up animation-delay-100 mb-4">
                        <span className="block text-base sm:text-lg md:text-xl tracking-[0.4em] uppercase text-text-muted font-light mb-4 lg:mb-6">
                            Óptica
                        </span>
                        <span className="block text-[3.2rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-display font-black text-text leading-[1]">
                            FRANCESCA
                        </span>
                    </h1>

                    {/* Divider */}
                    <div className="w-16 h-0.5 bg-accent mx-auto lg:mx-0 my-6 md:my-8 opacity-0 animate-fade-in-up animation-delay-200 rounded-full" />

                    {/* Tagline */}
                    <p className="text-sm sm:text-base md:text-lg text-text-muted leading-relaxed max-w-md md:max-w-xl mx-auto lg:mx-0 mb-8 md:mb-10 opacity-0 animate-fade-in-up animation-delay-300">
                        Porque cada mirada cuenta una historia, y nosotros queremos que la veas con toda claridad.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 opacity-0 animate-fade-in-up animation-delay-400">
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

                {/* Right Content - Image */}
                <div className="w-full lg:w-1/2 opacity-0 animate-fade-in-up animation-delay-500 mt-6 lg:mt-0 flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-sm lg:max-w-lg aspect-square mb-8 lg:mb-0">
                        <img
                            src="/hero-glasses.jpg"
                            alt="Anteojos Óptica Francesca"
                            className="w-full h-full object-cover rounded-[2rem] md:rounded-[3rem] shadow-2xl relative z-10 border border-border"
                        />

                        {/* Top right circular Badge */}
                        <div className="absolute z-20 top-[-1rem] right-[-1rem] lg:top-[-2rem] lg:right-[-2rem] w-24 h-24 lg:w-32 lg:h-32 bg-[#e8e6e5] rounded-full flex items-center justify-center shadow-xl border-4 border-[#f0eeed]">
                            <span className="text-center text-[9px] lg:text-[11px] font-bold tracking-[0.15em] text-[#222] uppercase leading-relaxed">
                                Tu mirada<br />importa
                            </span>
                        </div>

                        {/* Floating Badge Bottom Left */}
                        <div className="absolute z-20 bottom-[-1.5rem] lg:bottom-[-2rem] left-1/2 lg:left-[-3rem] -translate-x-1/2 lg:translate-x-0 bg-[#151515] rounded-[1.25rem] p-4 pr-6 flex items-center gap-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-white/10 w-max max-w-[90vw]">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                                <Calendar className="w-5 h-5 text-white/90" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-semibold text-[15px] leading-snug">Atención personalizada</span>
                                <span className="text-white/50 text-[14px]">En cada visita</span>
                            </div>
                        </div>

                        {/* Image decoration */}
                        <div className="absolute inset-0 bg-accent/10 rounded-[2.5rem] -z-10 blur-3xl opacity-60 translate-y-4"></div>
                    </div>
                </div>

            </div>

        </section>
    )
}
