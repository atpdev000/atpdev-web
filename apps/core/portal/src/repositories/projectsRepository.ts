import { Project } from "../domain/projects/entities";

// Mock data (en el futuro consumirá packages/database)
const projectsMock: Project[] = [
  {
    id: 1,
    title: "Chamba Pro",
    description: "Portal de convocatorias laborales públicas y privadas en Perú con filtros avanzados y herramientas para postulantes.",
    category: "Web",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop",
    stack: ["Next.js", "Supabase", "Tailwind CSS", "Turborepo"],
    metrics: "Actualización Diaria",
    status: "En producción",
    demoLink: "https://chamba.atpdev.dev"
  },
  {
    id: 2,
    title: "Lector QR Pro",
    description: "Escáner rápido de códigos QR y códigos de barras con historial y generación personalizada.",
    category: "Android",
    image: "https://images.unsplash.com/photo-1595054225547-063fbbe73289?q=80&w=800&auto=format&fit=crop",
    stack: ["Kotlin", "Hilt", "Room", "KSP"],
    metrics: "4.8 Estrellas",
    status: "En producción",
    demoLink: "https://lectorqr.atpdev.dev",
    playStore: "https://play.google.com/store"
  },
  {
    id: 3,
    title: "Almaniq Content Bot",
    description: "Pipeline automatizado que busca tendencias y publica videos diarios en TikTok y YouTube Shorts.",
    category: "IA",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    stack: ["Node.js", "Telegram API", "Gemini AI", "FFmpeg"],
    metrics: "15+ Videos/día",
    status: "En producción",
    demoLink: "#"
  },
  {
    id: 4,
    title: "Portafolio ATP DEV",
    description: "Portal profesional con arquitectura de 3 capas, panel de administración y diseño enfocado a UX.",
    category: "Web",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=800&auto=format&fit=crop",
    stack: ["Next.js", "Tailwind", "Supabase", "Turborepo"],
    metrics: "Lighthouse 100",
    status: "Beta",
    demoLink: "https://atpdev.dev"
  },
  {
    id: 5,
    title: "DNI Master Scanner Pro",
    description: "Escáner inteligente de DNI a PDF en formato A4 con eliminación de fondo, homografía y realce CamScanner.",
    category: "Android",
    image: "https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?q=80&w=800&auto=format&fit=crop",
    stack: ["React", "Capacitor", "Canvas HD", "jsPDF"],
    metrics: "Escala 1:1 Oficial",
    status: "En producción",
    demoLink: "https://dni.atpdev.dev",
    playStore: "https://play.google.com/store"
  },
  {
    id: 6,
    title: "MasterAtPDF Pro",
    description: "Suite integral de herramientas PDF con procesamiento client-side de alta velocidad (unir, dividir, organizar, rotar, comprimir) y microservicio de conversión Word de alta fidelidad.",
    category: "Web",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    stack: ["Next.js", "pdf-lib", "pdfjs-dist", "FastAPI", "Python"],
    metrics: "100% Client/API Pro",
    status: "En producción",
    demoLink: "https://masteratpdf.atpdev.dev",
  },
  {
    id: 7,
    title: "Colorear Pro & Estudio KDP",
    description: "Biblioteca gratuita de dibujos para colorear en PDF 300 DPI con pizarra interactiva y estudio completo para compilar libros Amazon KDP (limpieza line-art, reversos anti-traspaso y portada con lomo exacto).",
    category: "Web",
    image: "https://colorear.atpdev.dev/opengraph-image",
    stack: ["Next.js", "pdf-lib", "Canvas 300 DPI", "Gemini AI", "Stripe"],
    metrics: "300 DPI & Amazon KDP",
    status: "En producción",
    demoLink: "https://colorear.atpdev.dev",
  },
];

export async function getAllProjects(): Promise<Project[]> {
  // Simulando llamada asíncrona a la DB
  return new Promise((resolve) => setTimeout(() => resolve(projectsMock), 100));
}
