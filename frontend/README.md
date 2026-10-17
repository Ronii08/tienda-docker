# Carnalitos Shop — Frontend E-commerce (Next.js + Laravel API)

Frontend en Next.js App Router que consume la API REST de e-commerce "Carnalitos Shop" (Laravel 12 + JWT + Stripe), implementando un flujo completo de compra: catálogo → carrito → orden → pago → historial.

## Tecnologías

- Next.js (App Router, Server Components, Server Actions, Middleware)
- TypeScript
- Tailwind CSS
- API consumida: Laravel 12 + `tymon/jwt-auth` + Stripe

## Configuración

1. Asegurate de tener la API de Laravel corriendo (por defecto en `http://localhost:8000`, con `php artisan serve`).
2. Copiá `.env.example` a `.env.local`:
   ```
   API_BASE_URL=http://localhost:8000/api
   ```

## Instalación local

```bash
git clone <url-del-repo>
cd ecommerce-frontend
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Rutas implementadas

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | Pública | Landing |
| `/productos` | Pública | Catálogo — Server Component con `Suspense` sobre la lista (sección pesada) |
| `/productos/[id]` | Pública | Detalle de producto + botón "Agregar al carrito" |
| `/login` | Pública (redirige si ya hay sesión) | Inicio de sesión — Server Action `loginAction` |
| `/registro` | Pública (redirige si ya hay sesión) | Registro — Server Action `registerAction` |
| `/carrito` | Pública | Carrito (estado local en cliente vía Context API) |
| `/checkout/[orderId]` | **Protegida** | Detalle de la orden + botón "Pagar con Stripe" — Server Action `payAction` |
| `/historial` | **Protegida** | Historial de compras del usuario — Server Component con `Suspense` |

## Flujo de compra

1. El usuario navega el catálogo (`/productos`, datos leídos en el servidor).
2. Agrega productos al carrito (estado local, `CartProvider` con `useReducer`).
3. En `/carrito`, "Crear orden" dispara la Server Action `createOrderAction`, que llama `POST /api/orders` con el token JWT. Si el usuario no está logueado, la API responde 401 y se muestra el error pidiendo iniciar sesión.
4. Al crearse la orden, se redirige a `/checkout/[orderId]`.
5. "Pagar con Stripe" dispara la Server Action `payAction`, que llama `POST /api/payments`.
6. Se muestra la confirmación con el `stripe_payment_id`, monto y estado.
7. La orden pagada aparece en `/historial`.

## Autenticación y manejo del token

- El login/registro llaman a la API (`POST /api/auth/login` o `/register`), que devuelve un JWT.
- Ese token se guarda en una **cookie httpOnly** (`src/lib/session.ts`), seteada desde las Server Actions (`src/app/actions/auth.ts`) — nunca se expone a `localStorage` ni a JavaScript del navegador.
- Cada llamada a un endpoint protegido (`auth: true` en `apiFetch`) lee el token de la cookie en el servidor y lo manda como `Authorization: Bearer <token>` — el navegador nunca ve el token, solo el servidor de Next.js.
- El middleware (`middleware.ts`) verifica la presencia de la cookie para proteger `/historial` y `/checkout`, y redirige a usuarios ya logueados fuera de `/login` y `/registro`.
- Como defensa en profundidad, `/historial` y `/checkout/[orderId]` también manejan el caso de un 401 de la API (token vencido o inválido) y redirigen a `/login`.

## Rendimiento y resiliencia

- `loading.tsx` en `/productos`, `/checkout` e `/historial` (con skeletons).
- `error.tsx` por segmento en `/productos`, `/checkout`, `/historial` y a nivel global.
- `<Suspense>` explícito envolviendo la lista de productos en `/productos` y el historial en `/historial`.
- `revalidateTag('products')` tras crear una orden (el stock cambia) y `revalidatePath('/historial')` tras crear una orden y tras pagar, para evitar mostrar datos desactualizados sin recargar toda la app.
- `not-found.tsx` para productos inexistentes.

## Reporte de Lighthouse

Para generar la evidencia pedida en los entregables:
```bash
npm run build
npm run start
```
Con la app corriendo en modo producción (`localhost:3000`), abrir Chrome DevTools → pestaña **Lighthouse** → analizar `/productos`. Guardar el reporte (HTML o PDF) como evidencia.

## Estructura del proyecto

```
middleware.ts                    # Protección de /historial y /checkout
src/
├── app/
│   ├── page.tsx                 # Landing
│   ├── actions/
│   │   ├── auth.ts              # Server Actions: login, registro, logout
│   │   ├── orders.ts            # Server Action: crear orden
│   │   └── payments.ts          # Server Action: pagar
│   ├── productos/                (catálogo + detalle, Suspense)
│   ├── login/ | registro/
│   ├── carrito/                 # Client Component, estado local
│   ├── checkout/[orderId]/      # Detalle de orden + pago
│   └── historial/               # Historial, protegida, Suspense
├── components/
│   ├── cart-context.tsx         # Estado local del carrito (Context API)
│   ├── nav.tsx                  # Nav condicional según haya token
│   └── ...
└── lib/
    ├── api.ts                   # Cliente HTTP base hacia Laravel
    ├── resources.ts             # Funciones por recurso (products, auth, orders, payments)
    ├── session.ts                # Cookie httpOnly del token JWT
    └── types.ts                  # Tipos de las entidades de la API
```
