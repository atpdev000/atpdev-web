import crypto from "crypto";

function buildRevalidateToken(): string | null {
  const secret = process.env.REVALIDATE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update("atpdev-portal-revalidate").digest("hex");
}

/**
 * Invalida la caché ISR del portal principal cuando cambia contenido desde Admin.
 * No lanza excepción si el portal no es alcanzable (p. ej. desarrollo local parcial).
 */
export async function revalidatePortalCache(paths: string[] = []): Promise<void> {
  const token = buildRevalidateToken();
  if (!token) return;

  const endpoints = Array.from(
    new Set(
      [
        process.env.PORTAL_INTERNAL_URL || "http://127.0.0.1:3000",
        process.env.NEXT_PUBLIC_PORTAL_URL || "https://www.atpdev.dev",
      ]
        .filter(Boolean)
        .map((base) => `${base.replace(/\/$/, "")}/api/revalidate`)
    )
  );

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-revalidate-token": token,
        },
        body: JSON.stringify({ paths }),
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) return;
    } catch {
      // Probamos siguiente endpoint si localhost:3000 no aplica en este entorno
    }
  }
}
