export type Product = {
  id: number
  nombre: string
  descripcion: string | null
  precio: string | number
  stock: number
  categoria: string | null
}

export type OrderItem = {
  id: number
  product_id: number
  cantidad: number
  precio_unitario: string | number
  product?: Product
}

export type Payment = {
  id: number
  order_id: number
  stripe_payment_id: string
  monto: string | number
  estado: string
}

export type Order = {
  id: number
  user_id: number
  total: string | number
  estado: string
  created_at: string
  items: OrderItem[]
  payment?: Payment | null
}

export type User = {
  id: number
  name: string
  email: string
}

export type ApiError = {
  message: string
  error?: string
  errors?: Record<string, string[]>
}
