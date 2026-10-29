import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Política de Copyright y Propiedad Intelectual | FTY Downloader Pro',
    description: 'Información sobre derechos de autor, uso justo (fair use) y cómo reportar contenido protegido en FTY Downloader Pro.',
}

export default function CopyrightPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Política de Copyright</h1>

            <div className="prose prose-lg max-w-none text-gray-700">
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Respeto por los Derechos de Autor</h2>
                    <p>
                        En <strong>FTY Downloader Pro</strong>, respetamos los derechos de propiedad intelectual de los demás y esperamos que nuestros usuarios hagan lo mismo.
                        Nuestra plataforma es una herramienta técnica que permite el intercambio de formato (format-shifting) para uso personal y privado, de acuerdo con las leyes internacionales de propiedad intelectual.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Uso Justo (Fair Use)</h2>
                    <p>
                        Recordamos a los usuarios que la descarga de material protegido por derechos de autor sin el permiso explícito del titular del derecho
                        puede ser legalmente permisible bajo la doctrina de <strong>Uso Justo (Fair Use)</strong> o excepciones similares en su jurisdicción, siempre que se utilice para fines de:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Crítica y comentario.</li>
                        <li>Información de noticias.</li>
                        <li>Enseñanza y educación académica.</li>
                        <li>Investigación académica.</li>
                        <li>Uso personal no comercial.</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Responsabilidad del Usuario</h2>
                    <p>
                        El usuario es el único responsable de los datos que procesa a través de nuestra herramienta. FTY Downloader Pro no aloja contenido en sus servidores;
                        actuamos como un puente técnico entre el servidor de origen y el dispositivo del usuario final.
                    </p>
                    <p className="mt-4">
                        Al utilizar este sitio, usted acepta no utilizar nuestra plataforma para infringir leyes de derechos de autor ni para realizar redistribución comercial de contenido protegido sin autorización.
                    </p>
                </section>

                <section className="mb-10 bg-gray-50 p-8 rounded-2xl border">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 font-bold italic">4. Procedimiento de Notificación (DMCA)</h2>
                    <p>
                        Si usted es el titular de los derechos de autor de un contenido y cree que nuestra herramienta está facilitando un acceso no autorizado a su obra de una manera que perjudica sus derechos,
                        puede contactarnos para solicitar el bloqueo de URLs específicas en nuestro sistema.
                    </p>
                    <p className="mt-4">
                        Para procesar su solicitud, incluya:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Identificación de la obra protegida.</li>
                        <li>La URL específica que desea bloquear en nuestro convertidor.</li>
                        <li>Su información de contacto (email y firma digital).</li>
                    </ul>
                    <p className="mt-4 font-semibold text-blue-600">
                        Envíe su solicitud a: atp.dev000@gmail.com
                    </p>
                </section>
            </div>
        </div>
    )
}
