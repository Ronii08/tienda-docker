<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class ProductController extends Controller
{
    #[OA\Get(
        path: "/api/products",
        summary: "Listar todos los productos",
        tags: ["Products"],
        responses: [
            new OA\Response(response: 200, description: "Listado de productos"),
        ]
    )]
    public function index(): JsonResponse
    {
        return response()->json(['data' => Product::all()], 200);
    }

    #[OA\Get(
        path: "/api/products/{id}",
        summary: "Obtener un producto específico",
        tags: ["Products"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: "Producto encontrado"),
            new OA\Response(response: 404, description: "Producto no encontrado"),
        ]
    )]
    public function show(string $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        return response()->json(['data' => $product], 200);
    }

    #[OA\Post(
        path: "/api/products",
        summary: "Crear un nuevo producto",
        tags: ["Products"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["nombre", "precio", "stock"],
                properties: [
                    new OA\Property(property: "nombre", type: "string", example: "Camiseta Básica"),
                    new OA\Property(property: "precio", type: "number", example: 12.99),
                    new OA\Property(property: "stock", type: "integer", example: 50),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Producto creado"),
            new OA\Response(response: 422, description: "Error de validación"),
        ]
    )]
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        return response()->json([
            'message' => 'Producto creado exitosamente',
            'data' => $product,
        ], 201);
    }

    #[OA\Put(
        path: "/api/products/{id}",
        summary: "Actualizar un producto existente",
        tags: ["Products"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            ),
        ],
        requestBody: new OA\RequestBody(
            required: false,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "nombre", type: "string", example: "Camiseta Premium"),
                    new OA\Property(property: "precio", type: "number", format: "float", example: 15.99),
                    new OA\Property(property: "stock", type: "integer", example: 40),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Producto actualizado"),
            new OA\Response(response: 404, description: "Producto no encontrado"),
            new OA\Response(response: 401, description: "No autenticado"),
        ]
    )]
    public function update(UpdateProductRequest $request, string $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $product->update($request->validated());

        return response()->json([
            'message' => 'Producto actualizado exitosamente',
            'data' => $product,
        ], 200);
    }

    #[OA\Delete(
        path: "/api/products/{id}",
        summary: "Eliminar un producto del catálogo",
        tags: ["Products"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: "Producto eliminado"),
            new OA\Response(response: 404, description: "Producto no encontrado"),
            new OA\Response(response: 401, description: "No autenticado"),
        ]
    )]
    public function destroy(string $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Producto eliminado exitosamente'], 200);
    }
}