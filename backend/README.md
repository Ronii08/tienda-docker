#  API de E-commerce Segura — JWT + Stripe + Swagger

API RESTful desarrollada con **Laravel 12** para la gestión de un e-commerce básico: catálogo de productos, clientes registrados, órdenes de compra y procesamiento de pagos mediante **Stripe**. Autenticación con **JWT** y documentación interactiva con **Swagger/OpenAPI**.

##  Objetivo del proyecto

Diseñar una API RESTful segura y documentada aplicando:
- Autenticación stateless con JSON Web Tokens
- Relaciones de base de datos entre usuarios, productos, órdenes, ítems de orden y pagos
- Integración con la pasarela de pago Stripe (modo de prueba)
- Validación mediante Form Requests
- Documentación automática con Swagger/OpenAPI
- Manejo consistente de errores en formato JSON
- Transacciones de base de datos para operaciones críticas (creación de órdenes)

##  Tecnologías utilizadas

- PHP 8.2+
- Laravel 12
- tymon/jwt-auth (autenticación JWT)
- stripe/stripe-php (pasarela de pago)
- darkaonline/l5-swagger (documentación OpenAPI)
- MySQL / MariaDB

##  Estructura del proyecto

```
ecommerce-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── OrderController.php
│   │   │   └── PaymentController.php
│   │   └── Requests/
│   │       ├── StoreProductRequest.php
│   │       └── UpdateProductRequest.php
│   └── Models/
│       ├── User.php
│       ├── Product.php
│       ├── Order.php
│       ├── OrderItem.php
│       └── Payment.php
├── database/
│   ├── migrations/
│   └── seeders/
│       └── ProductSeeder.php
├── routes/
│   └── api.php
├── screenshots/
└── README.md
```

##  Instalación y configuración

### Requisitos previos
- PHP 8.2 o superior
- [Composer](https://getcomposer.org/download/)
- MySQL / MariaDB (XAMPP funciona perfecto)
- Cuenta gratuita en [Stripe](https://stripe.com) (modo de prueba)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <URL-de-este-repositorio>
   cd ecommerce-api
   ```

2. **Instalar dependencias**
   ```bash
   composer install
   ```

3. **Configurar el entorno**
   ```bash
   copy .env.example .env
   ```

4. **Generar la clave de la aplicación**
   ```bash
   php artisan key:generate
   ```

5. **Crear la base de datos**

   Crea una base de datos vacía llamada `ecommerce_api`.

6. **Configurar la conexión en `.env`**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ecommerce_api
   DB_USERNAME=root
   DB_PASSWORD=
   ```

7. **Generar la clave secreta JWT**
   ```bash
   php artisan jwt:secret
   ```

8. **Configurar las claves de Stripe**

   Obtén tus claves de prueba en https://dashboard.stripe.com/test/apikeys y agrégalas al `.env`:
   ```env
   STRIPE_KEY=pk_test_...
   STRIPE_SECRET=sk_test_...
   ```

9. **Ejecutar migraciones y seeders**
   ```bash
   php artisan migrate --seed
   ```

10. **Generar la documentación Swagger**
    ```bash
    php artisan l5-swagger:generate
    ```

11. **Levantar el servidor**
    ```bash
    php artisan serve
    ```

La API queda en `http://127.0.0.1:8000/api` y la documentación interactiva en:
**`http://127.0.0.1:8000/api/documentation`**

##  Documentación de endpoints

### Públicos
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar nuevo cliente |
| POST | `/api/auth/login` | Iniciar sesión y obtener token JWT |
| GET | `/api/products` | Listar catálogo de productos |
| GET | `/api/products/{id}` | Ver un producto específico |

### Protegidos (requieren token JWT)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/logout` | Cerrar sesión |
| GET | `/api/auth/me` | Perfil del usuario autenticado |
| POST | `/api/products` | Crear producto |
| PUT/PATCH | `/api/products/{id}` | Actualizar producto |
| DELETE | `/api/products/{id}` | Eliminar producto |
| POST | `/api/orders` | Crear una orden de compra |
| GET | `/api/orders` | Historial de compras del usuario |
| GET | `/api/orders/{id}` | Detalle de una orden |
| POST | `/api/payments` | Procesar el pago de una orden vía Stripe |

##  Ejemplo de flujo completo

**1. Registro**
```json
POST /api/auth/register
{ "name": "Ana Pérez", "email": "ana@example.com", "password": "password123", "password_confirmation": "password123" }
```

**2. Crear una orden** (con `Authorization: Bearer <token>`)
```json
POST /api/orders
{ "items": [{ "product_id": 1, "cantidad": 2 }] }
```

**3. Procesar el pago**
```json
POST /api/payments
{ "order_id": 1 }
```

Respuesta esperada (201):
```json
{
    "message": "Pago procesado exitosamente",
    "data": {
        "order_id": 1,
        "stripe_payment_id": "pi_...",
        "monto": "25.98",
        "estado": "succeeded"
    }
}
```

> El pago se procesa usando el método de prueba `pm_card_visa` de Stripe, que simula una tarjeta válida sin necesidad de un frontend real. Ningún cargo real se realiza — todo ocurre en modo de prueba (Test mode).

## 🧪 Cómo probar la API

1. Usa [Postman](https://www.postman.com/downloads/) con las peticiones documentadas arriba.
2. O explora y prueba directamente desde la interfaz de **Swagger UI** en `/api/documentation`, que permite ejecutar peticiones desde el navegador.

##  Seguridad implementada

- Contraseñas cifradas con `Hash::make()` (bcrypt)
- Autenticación stateless mediante JWT
- Middleware `auth:api` protegiendo endpoints sensibles
- Validación de datos con Form Requests antes de tocar la base de datos
- Cada usuario solo puede ver/gestionar sus propias órdenes
- Transacciones de base de datos (`DB::transaction`) al crear órdenes, evitando estados inconsistentes de stock
- Claves de Stripe nunca expuestas en el código, solo en variables de entorno

##  Capturas de pantalla

Ver carpeta [`/screenshots`](./screenshots): registro, login, catálogo, creación de orden, pago procesado, historial de compras, y la interfaz de Swagger UI.
