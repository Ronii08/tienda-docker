<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: "/api/auth/register",
        summary: "Registrar un nuevo cliente",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "email", "password", "password_confirmation"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Roni Sura"),
                    new OA\Property(property: "email", type: "string", format: "email", example: "roni@example.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "password123"),
                    new OA\Property(property: "password_confirmation", type: "string", format: "password", example: "password123"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Usuario registrado exitosamente",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Usuario registrado exitosamente"),
                        new OA\Property(property: "token", type: "string"),
                        new OA\Property(property: "token_type", type: "string", example: "bearer"),
                    ]
                )
            ),
            new OA\Response(response: 422, description: "Error de validación"),
        ]
    )]
    public function register(Request $request): JsonResponse
    {
        $validado = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|string|email|max:150|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validado['name'],
            'email' => $validado['email'],
            'password' => Hash::make($validado['password']),
        ]);

        $token = Auth::guard('api')->login($user);

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
        ], 201);
    }

    #[OA\Post(
        path: "/api/auth/login",
        summary: "Iniciar sesión y obtener token JWT",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email", "password"],
                properties: [
                    new OA\Property(property: "email", type: "string", format: "email", example: "roni@example.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "password123"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Inicio de sesión exitoso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Inicio de sesión exitoso"),
                        new OA\Property(property: "token", type: "string"),
                        new OA\Property(property: "token_type", type: "string", example: "bearer"),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Credenciales incorrectas"),
        ]
    )]
    public function login(Request $request): JsonResponse
    {
        $credenciales = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $token = Auth::guard('api')->attempt($credenciales);

        if (!$token) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user' => Auth::guard('api')->user(),
            'token' => $token,
            'token_type' => 'bearer',
        ], 200);
    }

    #[OA\Post(
        path: "/api/auth/logout",
        summary: "Cerrar sesión e invalidar el token actual",
        tags: ["Auth"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Sesión cerrada exitosamente"),
            new OA\Response(response: 401, description: "No autenticado"),
        ]
    )]
    public function logout(): JsonResponse
    {
        Auth::guard('api')->logout();
        return response()->json(['message' => 'Sesión cerrada exitosamente'], 200);
    }

    #[OA\Get(
        path: "/api/auth/me",
        summary: "Obtener el perfil del usuario autenticado",
        tags: ["Auth"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Perfil del usuario",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "user", type: "object"),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "No autenticado"),
        ]
    )]
    public function me(): JsonResponse
    {
        return response()->json(['user' => Auth::guard('api')->user()], 200);
    }
}