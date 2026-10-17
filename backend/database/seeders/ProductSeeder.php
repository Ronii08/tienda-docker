<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $productos = [
            ['nombre' => 'Camiseta Básica', 'descripcion' => 'Camiseta de algodón 100%', 'precio' => 12.99, 'stock' => 50, 'categoria' => 'Ropa'],
            ['nombre' => 'Audífonos Bluetooth', 'descripcion' => 'Audífonos inalámbricos con cancelación de ruido', 'precio' => 45.00, 'stock' => 20, 'categoria' => 'Electrónica'],
            ['nombre' => 'Termo de Acero', 'descripcion' => 'Termo de acero inoxidable 500ml', 'precio' => 15.50, 'stock' => 35, 'categoria' => 'Hogar'],
            ['nombre' => 'Mochila Urbana', 'descripcion' => 'Mochila resistente al agua', 'precio' => 28.75, 'stock' => 15, 'categoria' => 'Accesorios'],
            ['nombre' => 'Mouse Inalámbrico', 'descripcion' => 'Mouse ergonómico con USB receptor', 'precio' => 9.99, 'stock' => 60, 'categoria' => 'Electrónica'],
        ];

        foreach ($productos as $producto) {
            Product::create($producto);
        }
    }
}