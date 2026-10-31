'use client'

import { ShieldCheckIcon, UserGroupIcon, AcademicCapIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

const markers = [
    {
        name: 'Experiencia Técnica',
        description: 'Nuestro equipo de desarrolladores optimiza constantemente los algoritmos de extracción para garantizar la mejor calidad MP4 y MP3.',
        icon: AdjustmentsHorizontalIcon,
    },
    {
        name: 'Privacidad Absoluta',
        description: 'No procesamos datos personales. Nuestra herramienta actúa como un puente técnico efímero entre la web y tu dispositivo.',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Enfoque Educativo',
        description: 'Proveemos tutoriales detallados para que los usuarios comprendan cómo gestionar sus bibliotecas digitales de forma ética y legal.',
        icon: AcademicCapIcon,
    },
    {
        name: 'Comunidad Proactiva',
        description: 'Más de 100,000 usuarios mensuales confían en nuestras herramientas para respaldar sus contenidos favoritos de redes sociales.',
        icon: UserGroupIcon,
    },
]

export default function ExpertiseSection() {
    return (
        <div className="bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-gray-200/80 dark:border-slate-800 py-16 sm:py-20 px-6 sm:px-8 transition-colors">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Autoridad Digital
                    </h2>
                    <p className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Líderes en gestión de contenido multimedia
                    </p>
                    <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-slate-300">
                        En FTY Downloader Pro, nos tomamos en serio la integridad de tus archivos y la seguridad de tu navegación.
                        Nuestra plataforma está diseñada cumpliendo los más altos estándares de rendimiento y ética digital.
                    </p>
                </div>
                <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-16 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-4">
                        {markers.map((marker) => (
                            <div key={marker.name} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/40">
                                        <marker.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                    </div>
                                    {marker.name}
                                </dt>
                                <dd className="mt-3 flex flex-auto flex-col text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                                    <p className="flex-auto">{marker.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}
