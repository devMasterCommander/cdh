import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // Importamos el nuevo componente

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Club de Desarrollo Humano",
  description: "Plataforma de cursos online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers> {/* Envolvemos children con Providers */}
      </body>
    </html>
  );
}
