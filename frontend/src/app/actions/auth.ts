'use server'

import { redirect } from 'next/navigation'
import { apiLogin, apiRegister, apiLogout } from '@/lib/resources'
import { setTokenCookie, clearTokenCookie } from '@/lib/session'
import { ApiRequestError } from '@/lib/api'

export type AuthState = { error: string | null }

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function loginAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const next = String(formData.get('next') || '/historial')

  if (!isValidEmail(email)) {
    return { error: 'Ingresá un correo electrónico válido.' }
  }
  if (password.length < 1) {
    return { error: 'Ingresá tu contraseña.' }
  }

  try {
    const { token } = await apiLogin({ email, password })
    await setTokenCookie(token)
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 401) {
      return { error: 'Correo o contraseña incorrectos.' }
    }
    return { error: 'No se pudo iniciar sesión. Intentá de nuevo.' }
  }

  redirect(next)
}

export async function registerAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const passwordConfirmation = String(formData.get('password_confirmation') || '')

  if (name.length < 2) {
    return { error: 'Ingresá tu nombre completo.' }
  }
  if (!isValidEmail(email)) {
    return { error: 'Ingresá un correo electrónico válido.' }
  }
  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' }
  }
  if (password !== passwordConfirmation) {
    return { error: 'Las contraseñas no coinciden.' }
  }

  try {
    const { token } = await apiRegister({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })
    await setTokenCookie(token)
  } catch (err) {
    if (err instanceof ApiRequestError && err.body.errors) {
      const first = Object.values(err.body.errors)[0]?.[0]
      return { error: first || 'No se pudo completar el registro.' }
    }
    return { error: 'No se pudo completar el registro. Intentá de nuevo.' }
  }

  redirect('/historial')
}

export async function logoutAction() {
  try {
    await apiLogout()
  } catch {
    // Si el token ya venció, igual limpiamos la cookie local.
  }
  await clearTokenCookie()
  redirect('/login')
}
