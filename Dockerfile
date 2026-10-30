FROM node:20-bookworm-slim AS runner

# Instalar dependencias del sistema para procesamiento de video (FFmpeg y yt-dlp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    curl \
    ca-certificates \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar archivos de dependencias para aprovechar caché de capas Docker
COPY package*.json ./
COPY apps/subdomains/web-apps/descargador/package*.json ./apps/subdomains/web-apps/descargador/
COPY packages ./packages

# Instalar todas las dependencias
RUN npm install

# Copiar el resto del código fuente del proyecto
COPY . .

# Variables de entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Compilar la aplicación descargador
RUN npm run build:descargador

# Puerto por defecto (Koyeb usa 8000, Render usa 10000, se adapta automáticamente)
ENV PORT=8000
EXPOSE 8000

# Iniciar servidor Next.js
CMD ["sh", "-c", "npx next start apps/subdomains/web-apps/descargador -p ${PORT:-8000}"]
