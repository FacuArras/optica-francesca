import { MapPin, Clock, Phone } from 'lucide-react'

export default function Location() {
    return (
        <section id="ubicacion" className="relative py-16 md:py-32 px-6 bg-surface-warm">
            {/* Divider top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <span className="inline-block text-xs tracking-[0.3em] uppercase text-accent font-medium mb-4">
                        Visitanos
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-text mb-5">
                        ¿Dónde podés encontrarnos?
                    </h2>
                    <p className="text-text-muted max-w-lg mx-auto leading-relaxed">
                        Tu visión merece atención de cerca. Vení a conocernos y descubrí cómo podemos cuidar juntos de tus ojos.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Info cards */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-text mb-1">Dirección</h3>
                                    <p className="text-sm text-text-muted leading-relaxed">
                                        Carlos Giménez 64, Córdoba,<br />Argentina 5000
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                    <Clock className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-text mb-1">Horarios</h3>
                                    <p className="text-sm text-text-muted leading-relaxed">
                                        Lunes a Viernes: 9:00 - 13:00 y 17:00 a 20:00<br />
                                        Sábados: 9:00 - 13:00
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                    <Phone className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-text mb-1">Teléfono</h3>
                                    <p className="text-sm text-text-muted leading-relaxed">
                                        3515 57-5877
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-border bg-surface min-h-[350px]">
                        <iframe
                            title="Ubicación de Óptica Francesca"
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13626.915205284977!2d-64.1675211!3d-31.3664622!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94329834a0ae6807%3A0x8be826879e1fa39b!2sCarlos%20Gim%C3%A9nez%2064%2C%20X5012%20C%C3%B3rdoba!5e0!3m2!1ses-419!2sar!4v1789400059898!5m2!1ses-419!2sar"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '350px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
