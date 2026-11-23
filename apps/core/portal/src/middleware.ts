import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const INDEXABLE_LOCALES = ['es', 'en'];
const LEGACY_LOCALES = ['ru', 'hi', 'zh', 'fr', 'de', 'pt', 'ja'];
const DEFAULT_LOCALE = 'es';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Static assets, metadata routes, and internal files bypass locale routing
    if (
        [
            '/manifest.json',
            '/favicon.ico',
            '/robots.txt',
            '/sitemap.xml',
            '/ads.txt',
            '/app-ads.txt',
        ].includes(pathname)
    ) {
        return;
    }

    // Permanent redirect (308) from legacy auto-translated locale prefixes to canonical root
    const matchedLegacyLocale = LEGACY_LOCALES.find(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    if (matchedLegacyLocale) {
        const strippedPath = pathname.replace(new RegExp(`^/${matchedLegacyLocale}`), '') || '/';
        return NextResponse.redirect(new URL(strippedPath, request.url), 308);
    }

    // Redirect explicit /es/... to canonical unprefixed URL so Spanish has a single canonical URL
    if (pathname.startsWith(`/${DEFAULT_LOCALE}/`) || pathname === `/${DEFAULT_LOCALE}`) {
        const newPathname = pathname.replace(`/${DEFAULT_LOCALE}`, '') || '/';
        return NextResponse.redirect(new URL(newPathname, request.url), 308);
    }

    // Check if the URL starts with an indexable non-default locale (/en)
    const hasIndexableLocalePrefix = INDEXABLE_LOCALES.some(
        (locale) =>
            locale !== DEFAULT_LOCALE &&
            (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
    );

    // When no locale prefix is present, ALWAYS serve the canonical Spanish content via rewrite (200 OK).
    // Never auto-redirect crawlers (Googlebot / Mediapartners-Google) or users based on Accept-Language.
    if (!hasIndexableLocalePrefix) {
        return NextResponse.rewrite(
            new URL(`/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`, request.url)
        );
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
