import { getToken } from './session'
import type { ApiError } from './types'

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api'

export class ApiRequestError extends Error {
  status: number
  body: ApiError

  constructor(status: number, body: ApiError) {
    super(body.message || 'Error en la petición a la API')
    this.status = status
    this.body = body
  }
}

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean // si true, agrega el header Authorization con el token de la cookie
  cache?: RequestCache
  next?: NextFetchRequestConfig
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  if (options.auth) {
    const token = await getToken()
    if (!token) {
      throw new ApiRequestError(401, { message: 'No hay sesión activa.' })
    }
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    next: options.next,
  })

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : null

  if (!res.ok) {
    throw new ApiRequestError(res.status, data ?? { message: `Error ${res.status}` })
  }

  return data as T
}
