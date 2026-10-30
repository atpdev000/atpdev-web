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

# Copiar el código fuente completo del monorepo
COPY . .

# Instalar todas las dependencias completas del monorepo
RUN npm install

# Variables de entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Compilar la aplicación descargador
RUN npm run build:descargador

# Puerto dinámico (Render usa 10000, Koyeb usa 8000)
ENV PORT=10000
EXPOSE 10000

# Iniciar servidor Next.js
CMD ["sh", "-c", "npx next start apps/subdomains/web-apps/descargador -p ${PORT:-10000}"]
