import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supportedLocales = ['es', 'en', 'ru', 'hi', 'zh', 'fr', 'de', 'pt', 'ja'];
const defaultLocale = 'es';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  // Simple parser: gets the first preferred language code (e.g. "en-US,en;q=0.9" -> "en")
  const preferred = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
  
  if (supportedLocales.includes(preferred)) {
    return preferred;
  }
  
  // You could return preferred anyway to support ANY language, 
  // but bounding it to a known list is safer for SEO. 
  // For infinite languages, just return preferred if it's a valid 2-letter code.
  if (/^[a-z]{2}$/.test(preferred)) {
    return preferred;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, API routes, and standalone pages
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/sitemap') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt' ||
    pathname === '/ads.txt' ||
    pathname === '/app-ads.txt' ||
    pathname.includes('.') // like favicon.ico, images, pdfs
  ) {
    return NextResponse.next();
  }

  // Check if the pathname is missing a locale
  // We check if the first segment is a valid 2-letter code
  const pathnameIsMissingLocale = !/^\/[a-z]{2}(\/|$)/.test(pathname);

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const targetUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    
    // Si es el idioma principal (español), ocultamos el prefijo /es en la URL
    // usando "rewrite" (el servidor carga /es internamente pero el usuario no lo ve).
    if (locale === defaultLocale) {
      return NextResponse.rewrite(targetUrl);
    }
    
    // Para otros idiomas (inglés, ruso), sí mostramos el prefijo /en o /ru en la URL
    return NextResponse.redirect(targetUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, and root machine-readable files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|llms.txt|robots.txt|sitemap.xml|ads.txt|app-ads.txt).*)'],
};
