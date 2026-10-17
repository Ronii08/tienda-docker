import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import { CartProvider } from "@/components/cart-context";

export const metadata: Metadata = {
  title: "Carnalitos Shop",
  description: "Frontend Next.js que consume la API de e-commerce (Laravel + Stripe)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Nav />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
