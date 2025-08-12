"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const sonidos = {
  lluvia: "/sounds/lluvia.mp3",
  bosque: "/sounds/bosque.mp3",
  olas: "/sounds/olas.mp3",
};

export default function ModoZen() {
  const router = useRouter();

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [sonidoSeleccionado, setSonidoSeleccionado] = useState("lluvia");
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    const nuevoAudio = new Audio(sonidos[sonidoSeleccionado]);
    nuevoAudio.loop = true;
    setAudio(nuevoAudio);

    if (activo) {
      nuevoAudio.play();
    }

    return () => {
      nuevoAudio.pause();
      nuevoAudio.currentTime = 0;
    };
  }, [sonidoSeleccionado]);

  const toggleAudio = () => {
    if (!audio) return;
    if (activo) {
      audio.pause();
    } else {
      audio.play();
    }
    setActivo(!activo);
  };

  // Función para manejar el botón salir
  const handleSalir = () => {
    // Si quieres puedes pausar el audio antes de salir
    if (audio) {
      audio.pause();
    }
    router.push("/"); // redirige a la página principal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center text-center text-gray-800 dark:text-white p-6">
      <h1 className="text-4xl font-bold mb-6">🧘 Modo Zen</h1>

      {/* Respiración */}
      <div className="w-48 h-48 bg-blue-400 dark:bg-blue-600 rounded-full animate-breathe mb-6" />

      {/* Selector de sonido */}
      <div className="mb-4">
        <label className="text-lg font-medium mr-2">Sonido relajante:</label>
        <select
          value={sonidoSeleccionado}
          onChange={(e) => setSonidoSeleccionado(e.target.value)}
          className="p-2 rounded bg-white dark:bg-gray-700"
        >
          <option value="lluvia">🌧️ Lluvia</option>
          <option value="bosque">🌲 Bosque</option>
          <option value="olas">🌊 Olas</option>
        </select>
      </div>

      {/* Botones */}
      <div className="flex gap-4">
        <button
          onClick={toggleAudio}
          className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          {activo ? "Pausar" : "Iniciar"}
        </button>

        <button
          onClick={handleSalir}
          className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
        >
           ⏻ Salir
        </button>
      </div>
    </div>
  );
}


