import { NextResponse, type NextRequest } from 'next/server'

const TOKEN_COOKIE = 'ecommerce_token'
const PROTECTED_PREFIXES = ['/historial', '/checkout']
const AUTH_PAGES = ['/login', '/registro']

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value
  const path = request.nextUrl.pathname

  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p))
  const isAuthPage = AUTH_PAGES.some((p) => path.startsWith(p))

  if (!token && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  if (token && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/historial'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
