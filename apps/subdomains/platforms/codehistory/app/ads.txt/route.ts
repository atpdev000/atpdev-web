export async function GET() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-5414009811868137';
  const pubId = adsenseId.replace(/^ca-/, '');
  const adsTxt = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(adsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
