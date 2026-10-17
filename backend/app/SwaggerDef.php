<?php

namespace App;

use OpenApi\Attributes as OA;

#[OA\Info(title: "API de E-commerce - Carnalitos Shop", version: "1.0.0", description: "API RESTful para gestión de productos, órdenes y pagos con Stripe")]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT"
)]
class SwaggerDef
{
}