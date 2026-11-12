export async function GET() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-5414009811868137';

  // Remove the 'ca-' prefix if it exists to form the correct pub-XXXXXXXX format
  const pubId = adsenseId.replace(/^ca-/, '');
  
  const adsTxt = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`;

  return new Response(adsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
