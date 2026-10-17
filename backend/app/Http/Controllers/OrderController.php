<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

class OrderController extends Controller
{
    #[OA\Post(
        path: "/api/orders",
        summary: "Crear una orden de compra",
        tags: ["Orders"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["items"],
                properties: [
                    new OA\Property(
                        property: "items",
                        type: "array",
                        items: new OA\Items(
                            type: "object",
                            required: ["product_id", "cantidad"],
                            properties: [
                                new OA\Property(property: "product_id", type: "integer", example: 1),
                                new OA\Property(property: "cantidad", type: "integer", example: 2),
                            ]
                        )
                    ),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Orden creada exitosamente"),
            new OA\Response(response: 422, description: "Error de validación o stock insuficiente"),
            new OA\Response(response: 401, description: "No autenticado"),
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        $validado = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.cantidad' => 'required|integer|min:1',
        ]);

        try {
            $order = DB::transaction(function () use ($validado) {
                $total = 0;
                $itemsData = [];

                foreach ($validado['items'] as $item) {
                    $product = Product::find($item['product_id']);

                    if ($product->stock < $item['cantidad']) {
                        throw new \Exception("Stock insuficiente para: {$product->nombre}");
                    }

                    $subtotal = $product->precio * $item['cantidad'];
                    $total += $subtotal;

                    $itemsData[] = [
                        'product' => $product,
                        'cantidad' => $item['cantidad'],
                        'precio_unitario' => $product->precio,
                    ];
                }

                $order = Order::create([
                    'user_id' => Auth::guard('api')->id(),
                    'total' => $total,
                    'estado' => 'pendiente',
                ]);

                foreach ($itemsData as $data) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $data['product']->id,
                        'cantidad' => $data['cantidad'],
                        'precio_unitario' => $data['precio_unitario'],
                    ]);

                    $data['product']->decrement('stock', $data['cantidad']);
                }

                return $order;
            });

            return response()->json([
                'message' => 'Orden creada exitosamente',
                'data' => $order->load('items.product'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'No se pudo crear la orden',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    #[OA\Get(
        path: "/api/orders",
        summary: "Historial de compras del usuario autenticado",
        tags: ["Orders"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Listado de órdenes del usuario"),
            new OA\Response(response: 401, description: "No autenticado"),
        ]
    )]
    public function history(): JsonResponse
    {
        $orders = Order::where('user_id', Auth::guard('api')->id())
            ->with(['items.product', 'payment'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $orders], 200);
    }

    #[OA\Get(
        path: "/api/orders/{id}",
        summary: "Obtener el detalle de una orden específica",
        tags: ["Orders"],
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
            new OA\Response(response: 200, description: "Detalle de la orden"),
            new OA\Response(response: 404, description: "Orden no encontrada"),
            new OA\Response(response: 401, description: "No autenticado"),
        ]
    )]
    public function show(string $id): JsonResponse
    {
        $order = Order::where('user_id', Auth::guard('api')->id())
            ->with(['items.product', 'payment'])
            ->find($id);

        if (!$order) {
            return response()->json(['message' => 'Orden no encontrada'], 404);
        }

        return response()->json(['data' => $order], 200);
    }
}