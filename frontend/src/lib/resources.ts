import { apiFetch } from './api'
import type { Product, Order, User } from './types'

// ---- Productos (públicos, lectura desde Server Components) ----

export function getProducts() {
  return apiFetch<{ data: Product[] }>('/products', {
    // Revalidamos por tag para poder invalidar el catálogo tras crear una orden
    // (el stock cambia) sin tener que desactivar el cache por completo.
    next: { tags: ['products'] },
  })
}

export function getProduct(id: string) {
  return apiFetch<{ data: Product }>(`/products/${id}`, {
    next: { tags: ['products', `product-${id}`] },
  })
}

// ---- Autenticación ----

export function apiRegister(input: {
  name: string
  email: string
  password: string
  password_confirmation: string
}) {
  return apiFetch<{ message: string; token: string; token_type: string }>('/auth/register', {
    method: 'POST',
    body: input,
  })
}

export function apiLogin(input: { email: string; password: string }) {
  return apiFetch<{ message: string; token: string; token_type: string }>('/auth/login', {
    method: 'POST',
    body: input,
  })
}

export function apiLogout() {
  return apiFetch<{ message: string }>('/auth/logout', { method: 'POST', auth: true })
}

export function apiMe() {
  return apiFetch<{ user: User }>('/auth/me', { auth: true, cache: 'no-store' })
}

// ---- Órdenes ----

export function apiCreateOrder(items: { product_id: number; cantidad: number }[]) {
  return apiFetch<{ message: string; data: Order }>('/orders', {
    method: 'POST',
    body: { items },
    auth: true,
  })
}

export function getOrders() {
  return apiFetch<{ data: Order[] }>('/orders', {
    auth: true,
    cache: 'no-store',
  })
}

export function getOrder(id: string) {
  return apiFetch<{ data: Order }>(`/orders/${id}`, {
    auth: true,
    cache: 'no-store',
  })
}

// ---- Pagos ----

export function apiPay(orderId: number) {
  return apiFetch<{
    message: string
    data: { stripe_payment_id: string; monto: string; estado: string }
  }>('/payments', {
    method: 'POST',
    body: { order_id: orderId },
    auth: true,
  })
}
