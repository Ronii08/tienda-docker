import { cookies } from 'next/headers'

const TOKEN_COOKIE = 'ecommerce_token'

// Se usa desde Server Actions y Route Handlers (los únicos contextos donde
// Next.js permite escribir cookies). Nunca se expone al JavaScript del
// navegador porque httpOnly:true lo bloquea.
export async function setTokenCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días, igual que la expiración típica del JWT
  })
}

export async function clearTokenCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_COOKIE)
}

// Se puede leer desde Server Components, Server Actions y Route Handlers.
export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_COOKIE)?.value
}

export const TOKEN_COOKIE_NAME = TOKEN_COOKIE
