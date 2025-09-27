"use client";

import { useRouter } from "next/navigation";

export default function EstadisticasPage() {
  const router = useRouter();

  const handleSalir = () => {
    // Aquí puedes limpiar datos si usas algo como localStorage o contexto
    // localStorage.clear(); // ejemplo

    router.push("/"); // redirige a la página de inicio
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Estadísticas</h1>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <StatCard label="Pomodoros Completados" value="12" />
        <StatCard label="Tiempo Total" value="5 hrs" />
        <StatCard label="Juegos Jugados" value="7" />
        <StatCard label="Consejos Leídos" value="4" />
      </div>

      <button
        onClick={handleSalir}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition"
      >
        Salir
      </button>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black-50 p-4 rounded-xl border shadow text-center">
      <h3 className="text-blue-600">{label}</h3>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  );
}



