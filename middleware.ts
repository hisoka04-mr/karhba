import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

export async function middleware(request: NextRequest) {
  // 1. Handle i18n
  const response = intlMiddleware(request)

  // 2. Handle Supabase Auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Note: We need to update the locale response if we were changing it
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes check
  // We need to account for the locale prefix: /en/dashboard, /ar/dashboard, etc.
  const path = request.nextUrl.pathname
  const isProtected = locales.some(locale => 
    path.startsWith(`/${locale}/dashboard`) || 
    path.startsWith(`/${locale}/bookings`) || 
    path.startsWith(`/${locale}/owner`) || 
    path.startsWith(`/${locale}/profile`)
  )

  if (isProtected && !user) {
    const locale = path.split('/')[1] || defaultLocale
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/auth/login`
    url.searchParams.set('redirectTo', path)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
