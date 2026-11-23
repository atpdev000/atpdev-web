import { getSiteConfig } from "@atpdev/database";

export async function GET() {
    const config = await getSiteConfig().catch(() => null);
    const rawId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || config?.adsense_id || "pub-5414009811868137";
    const pubId = rawId.replace("ca-", "");

    const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`;

    return new Response(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
