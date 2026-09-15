import { FileText, Eye, Glasses } from 'lucide-react'

const services = [
    {
        icon: FileText,
        title: 'Recetas médicas',
        description:
            'Realizamos estudios completos para hacer o actualizar tu receta médica con precisión.',
    },
    {
        icon: Glasses,
        title: 'Lentes a medida',
        description:
            'Trabajamos con lentes monofocales, bifocales y multifocales, evaluamos cuál es la mejor opción según tu graduación, tus necesidades visuales y el uso que le das a tus anteojos.',
    },
    {
        icon: Eye,
        title: 'Lentes de contacto',
        description:
            'Olvidate de las armazones y disfrutá de una visión natural. Te guiamos en la elección y adaptación de tus lentes de contacto para que veas el mundo con total libertad y comodidad.',
    },
]

export default function Services() {
    return (
        <section id="servicios" className="relative py-16 md:py-32 px-6 bg-[#f2ece2]">
            {/* Top divider */}
            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-accent/30 transition-all duration-500" />

            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16 md:mb-20">
                    <span className="inline-block text-xs tracking-[0.3em] uppercase text-accent font-medium mb-4">
                        Lo que hacemos
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-text mb-5">
                        Cuidamos tu mirada
                    </h2>
                    <p className="text-text-muted max-w-md mx-auto leading-relaxed">
                        Todo lo que necesitás para ver, sentir y elegir mejor.
                    </p>
                </div>

                {/* Services grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="group relative p-8 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5"
                        >

                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 group-hover:bg-accent/15 group-hover:border-accent/30 transition-all duration-500">
                                <service.icon className="w-5 h-5 text-accent" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-display font-bold text-text mb-3 group-hover:text-accent transition-colors duration-300">
                                {service.title}
                            </h3>
                            <p className="text-sm text-text-muted leading-relaxed">
                                {service.description}
                            </p>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-accent/30 transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
