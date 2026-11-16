import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, Wifi, QrCode, Printer, ArrowLeft, Layers } from 'lucide-react';

export default function GuiasQrPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8">
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <Link
          href="/generar"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Generador QR Pro</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Guías Técnicas: Estándares QR, Seguridad e Impresión Profesional
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Manual práctico sobre ingeniería de códigos bidimensionales ISO/IEC 18004, niveles de tolerancia a daños, formatos URI seguros y buenas prácticas de diseño escaneable.
        </p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed text-slate-300">
        <article className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2>1. Cómo elegir el nivel de corrección de errores (L, M, Q, H)</h2>
          </div>
          <p>
            Todo código QR incorpora redundancia matemática mediante códigos <strong>Reed-Solomon</strong>, lo que permite recuperar información incluso cuando parte de la matriz queda cubierta, rayada o reemplazada por un logotipo central:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-300">
            <li><strong>Nivel L (7 % de recuperación):</strong> matrices más simples y fáciles de enfocar a distancia; recomendado para enlaces cortos sin logotipo en pantallas o tarjetas limpias.</li>
            <li><strong>Nivel M (15 % de recuperación):</strong> equilibrio ideal para cartas de restaurante, tickets y material impreso cotidiano sin daño severo esperado.</li>
            <li><strong>Nivel Q (25 % de recuperación):</strong> recomendado en entornos comerciales, etiquetas logísticas o códigos expuestos al desgaste físico.</li>
            <li><strong>Nivel H (30 % de recuperación):</strong> imprescindible siempre que insertes un logotipo central en nuestro{' '}
              <Link href="/generar" className="text-cyan-400 underline font-semibold">Generador QR</Link>, pues compensa los módulos centrales cubiertos por el emblema.</li>
          </ul>
        </article>

        <article className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <h2>2. Estándar Wi-Fi QR, vCard 3.0 y enlaces seguros</h2>
          </div>
          <p>
            Los escáneres nativos de Android e iOS interpretan esquemas estructurados sin necesidad de servidores intermedios ni acortadores opacos:
          </p>
          <p className="text-xs sm:text-sm text-slate-300">
            Para acceso inalámbrico se utiliza la cadena <code>WIFI:T:WPA;S:NombreRed;P:Clave;;</code>, escapando puntos y comas o barras invertidas dentro del SSID y la contraseña. Para tarjetas de contacto digitales se emplea <strong>vCard 3.0</strong>, mientras que para direcciones web se recomienda usar enlaces directos <code>https://</code> con destino visible para evitar desconfianza en el usuario final.
          </p>
        </article>

        <article className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h2>3. Prevención de QRishing (phishing mediante códigos QR)</h2>
          </div>
          <p>
            El <em>QRishing</em> ocurre cuando un atacante adhiere una calcomanía maliciosa encima de un cartel legítimo o incrusta un QR hacia una página de suplantación. Con nuestro{' '}
            <Link href="/" className="text-cyan-400 underline font-semibold">Escáner QR Web</Link>, ningún enlace se abre automáticamente a menos que lo confirmes tras inspeccionar el dominio real, el protocolo TLS y los parámetros de consulta.
          </p>
        </article>

        <article className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Printer className="w-4 h-4 text-blue-400" />
            <h2>4. Reglas de contraste, zona de silencio (Quiet Zone) e impresión SVG</h2>
          </div>
          <p>
            Para garantizar lectura instantánea en cualquier cámara móvil: mantén siempre un margen blanco limpio alrededor de la matriz equivalente al menos a cuatro módulos (<em>Quiet Zone</em>), conserva un contraste elevado entre módulos oscuros y fondo claro (evita invertir códigos blancos sobre fondo negro en lectores antiguos) y exporta en formato vectorial <strong>SVG</strong> cuando vayas a imprimir carteles o vinilos de gran formato.
          </p>
        </article>

        <article className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Layers className="w-4 h-4 text-purple-400" />
            <h2>5. Diferencias entre QR, Data Matrix, Aztec, PDF-417 y EAN-13</h2>
          </div>
          <p>
            Aunque el código QR domina el marketing y los pagos móviles, otros formatos cumplen estándares industriales específicos: <strong>EAN-13</strong> y <strong>UPC-A</strong> identifican productos minoristas GS1; <strong>Code 128</strong> optimiza guías de transporte alfanuméricas; <strong>Data Matrix</strong> destaca en empaques farmacéuticos compactos; <strong>Aztec</strong> se usa en boletos aéreos por prescindir de zona de silencio externa; y <strong>PDF-417</strong> almacena datos estructurados en licencias e identificaciones.
          </p>
        </article>
      </section>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-bold text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>¿Listo para generar o verificar tu próximo código?</span>
          </p>
          <p className="text-xs text-slate-400">
            Procesamiento 100 % local en tu navegador sin subir imágenes ni datos personales.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/generar"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
          >
            Abrir Generador QR
          </Link>
          <Link
            href="/contacto"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Soporte Técnico
          </Link>
        </div>
      </div>
    </div>
  );
}
