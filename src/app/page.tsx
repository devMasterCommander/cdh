import AuthButtons from "@/components/AuthButtons"; // Importamos los botones

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Club de Desarrollo Humano</h1>
      <AuthButtons /> {/* Añadimos los botones aquí */}
    </main>
  );
}
