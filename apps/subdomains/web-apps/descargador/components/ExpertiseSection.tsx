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
        <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">Autoridad Digital</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Líderes en gestión de contenido multimedia
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        En FTY Downloader Pro, nos tomamos en serio la integridad de tus archivos y la seguridad de tu navegación.
                        Nuestra plataforma está diseñada cumpliendo los más altos estándares de rendimiento y ética digital.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                        {markers.map((marker) => (
                            <div key={marker.name} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    <marker.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                                    {marker.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
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
