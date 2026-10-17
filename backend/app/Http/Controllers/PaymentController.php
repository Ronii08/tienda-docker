<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;
use OpenApi\Attributes as OA;

class PaymentController extends Controller
{
    #[OA\Post(
        path: "/api/payments",
        summary: "Procesar el pago de una orden mediante Stripe",
        tags: ["Payments"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["order_id"],
                properties: [
                    new OA\Property(property: "order_id", type: "integer", example: 1),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Pago procesado exitosamente",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Pago procesado exitosamente"),
                        new OA\Property(
                            property: "data",
                            type: "object",
                            properties: [
                                new OA\Property(property: "stripe_payment_id", type: "string", example: "pi_3Nx..."),
                                new OA\Property(property: "monto", type: "string", example: "25.98"),
                                new OA\Property(property: "estado", type: "string", example: "succeeded"),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(response: 402, description: "El pago fue rechazado"),
            new OA\Response(response: 404, description: "Orden no encontrada"),
            new OA\Response(response: 422, description: "La orden ya fue procesada"),
            new OA\Response(response: 401, description: "No autenticado"),
        ]
    )]
    public function process(Request $request): JsonResponse
    {
        $validado = $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
        ]);

        $order = Order::where('user_id', Auth::guard('api')->id())
            ->find($validado['order_id']);

        if (!$order) {
            return response()->json(['message' => 'Orden no encontrada'], 404);
        }

        if ($order->estado !== 'pendiente') {
            return response()->json(['message' => 'Esta orden ya fue procesada'], 422);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $intent = PaymentIntent::create([
                'amount' => (int) round($order->total * 100), // Stripe usa centavos
                'currency' => 'usd',
                'payment_method' => 'pm_card_visa', // método de prueba de Stripe
                'confirm' => true,
                'automatic_payment_methods' => [
                    'enabled' => true,
                    'allow_redirects' => 'never',
                ],
            ]);

            $estadoPago = $intent->status === 'succeeded' ? 'succeeded' : 'failed';

            $payment = Payment::create([
                'order_id' => $order->id,
                'stripe_payment_id' => $intent->id,
                'monto' => $order->total,
                'estado' => $estadoPago,
            ]);

            $order->update([
                'estado' => $estadoPago === 'succeeded' ? 'pagado' : 'cancelado',
            ]);

            return response()->json([
                'message' => $estadoPago === 'succeeded'
                    ? 'Pago procesado exitosamente'
                    : 'El pago fue rechazado',
                'data' => $payment,
            ], $estadoPago === 'succeeded' ? 201 : 402);

        } catch (ApiErrorException $e) {
            Payment::create([
                'order_id' => $order->id,
                'stripe_payment_id' => null,
                'monto' => $order->total,
                'estado' => 'failed',
            ]);

            return response()->json([
                'message' => 'Error al procesar el pago',
                'error' => $e->getMessage(),
            ], 402);
        }
    }
}