import { getSiteConfig } from "@atpdev/database";

export async function GET() {
  const config = await getSiteConfig().catch(() => null);
  const rawPubId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || config?.adsense_id || 'pub-5414009811868137';
  
  // Extraer solo la parte numérica o prefijo pub-
  const pubId = rawPubId.replace(/^ca-/, "");

  // Formato oficial de Google AdSense ads.txt
  const content = `# Google AdSense ads.txt for atpdev.dev network
google.com, ${pubId}, DIRECT, f08c47fec0942fa0
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
