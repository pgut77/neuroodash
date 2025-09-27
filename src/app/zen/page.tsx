'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pause, Play, LogOut, CloudRain, Trees, Waves } from 'lucide-react'

// Sonidos y GIFs asociados
const sonidos = {
  lluvia: { src: '/sounds/relax.mp3', gif: '/images/lluvia.gif' },
  bosque: { src: '/sounds/night.mp3', gif: '/images/night.gif' },
  olas: { src: '/sounds/sleep.mp3', gif: '/images/sleep.gif' },
}

// Mensajes motivacionales
const mensajes = [
  'Respira profundamente...',
  'Suelta las tensiones...',
  'Concéntrate en el presente...',
  'Escucha y relájate...',
  'Tómate este momento para ti...'
]

export default function ModoZen() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [pausado, setPausado] = useState(false)
  const [mensajeActual, setMensajeActual] = useState(mensajes[0])
  const [gifActual, setGifActual] = useState('/images/lluvia.gif')
  const router = useRouter()

  // Cambiar mensaje cada 6 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setMensajeActual(mensajes[Math.floor(Math.random() * mensajes.length)])
    }, 6000)
    return () => clearInterval(intervalo)
  }, [])

  const reproducirSonido = (tipo: keyof typeof sonidos) => {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    const nuevoAudio = new Audio(sonidos[tipo].src)
    nuevoAudio.loop = true
    nuevoAudio.play()
    setAudio(nuevoAudio)
    setGifActual(sonidos[tipo].gif) // Cambiar GIF según sonido
    setPausado(false)
  }

  const pausarReanudar = () => {
    if (!audio) return
    if (pausado) {
      audio.play()
    } else {
      audio.pause()
    }
    setPausado(!pausado)
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6">
      {/* Partículas flotando */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="absolute bg-white opacity-30 rounded-full animate-float"
            style={{
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 8 + 4}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <h1 className="text-3xl font-bold mb-4 z-10">Modo Zen 🌿</h1>

      {/* Mensaje motivacional */}
      <p className="mb-6 text-lg italic text-gray-700 z-10">{mensajeActual}</p>

      {/* GIF relajante dinámico */}
      <img
        src={gifActual}
        alt="GIF relajante"
        className="w-72 h-72 object-cover rounded-2xl shadow-lg mb-6 z-10 transition-all duration-500"
      />

      {/* Botones de sonidos */}
      <div className="flex gap-4 mb-6 z-10">
        <button onClick={() => reproducirSonido('lluvia')}
          className="px-4 py-2 bg-blue-200 rounded-xl hover:bg-blue-300 flex items-center gap-2">
          <CloudRain size={20}/> Relax
        </button>
        <button onClick={() => reproducirSonido('bosque')}
          className="px-4 py-2 bg-green-200 rounded-xl hover:bg-green-300 flex items-center gap-2">
          <Trees size={20}/> Night
        </button>
        <button onClick={() => reproducirSonido('olas')}
          className="px-4 py-2 bg-indigo-200 rounded-xl hover:bg-indigo-300 flex items-center gap-2">
          <Waves size={20}/> Sleep
        </button>
      </div>

      {/* Controles */}
      <div className="flex gap-4 z-10">
        <button onClick={pausarReanudar}
          className="px-4 py-2 bg-yellow-200 rounded-xl hover:bg-yellow-300 flex items-center gap-2">
          {pausado ? <Play size={20}/> : <Pause size={20}/> }
          {pausado ? 'Reanudar' : 'Pausar'}
        </button>

        <button onClick={() => router.push('/')}
          className="px-4 py-2 bg-red-200 rounded-xl hover:bg-red-300 flex items-center gap-2">
          <LogOut size={20}/> Salir
        </button>
      </div>

      {/* Animaciones flotantes CSS */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .animate-float {
          animation-name: float;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </div>
  )
}







