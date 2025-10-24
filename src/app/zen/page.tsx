'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

// Mensajes motivacionales
const mensajes = [
  'Respira profundamente...',
  'Concéntrate en el presente...',
  'Suelta las tensiones...',
  'Tómate este momento para ti...'
]

// GIFs o videos
const media = {
  trabajo: '/images/trabajo.gif',  // o .mp4
  descanso: '/images/relax.gif'
}

export default function PomodoroZen() {
  const router = useRouter()
  const [segundos, setSegundos] = useState(25 * 60) // 25 min Pomodoro
  const [enDescanso, setEnDescanso] = useState(false)
  const [mensaje, setMensaje] = useState(mensajes[0])
  const [gifActual, setGifActual] = useState(media.trabajo)
  const intervaloRef = useRef<NodeJS.Timer | null>(null)
  const [activo, setActivo] = useState(false)

  // Cambiar mensaje cada 10 segundos
  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMensaje(mensajes[Math.floor(Math.random() * mensajes.length)])
    }, 10000)
    return () => clearInterval(msgInterval)
  }, [])

  // Temporizador
  useEffect(() => {
    if (!activo) return
    intervaloRef.current = setInterval(() => {
      setSegundos(prev => prev - 1)
    }, 1000)
    return () => clearInterval(intervaloRef.current!)
  }, [activo])

  // Cambio de fase Pomodoro / Descanso
  useEffect(() => {
    if (segundos < 0) {
      setEnDescanso(!enDescanso)
      setSegundos(enDescanso ? 25 * 60 : 5 * 60)
      setGifActual(enDescanso ? media.trabajo : media.descanso)
    }
  }, [segundos])

  const iniciar = () => setActivo(true)
  const pausar = () => setActivo(false)
  const reiniciar = () => {
    setActivo(false)
    setSegundos(enDescanso ? 5 * 60 : 25 * 60)
    setGifActual(enDescanso ? media.descanso : media.trabajo)
  }

  const formatTime = (seg: number) => {
    const m = Math.floor(seg / 60)
    const s = seg % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6">

      {/* GIF / Video grande */}
      <div className="w-[500px] h-[500px] rounded-2xl overflow-hidden shadow-lg mb-6">
        <img src='images/night.gif' alt="Zen Media" className="w-full h-full object-cover"/>
        {/* Si quieres video, reemplaza <img> por <video src={gifActual} autoPlay loop muted className="w-full h-full object-cover"/> */}
      </div>

      {/* Temporizador */}
      <h1 className="text-6xl font-bold mb-4">{formatTime(segundos)}</h1>
      <p className="mb-6 text-2xl">{enDescanso ? 'Tiempo de Descanso 😌' : 'Tiempo de Trabajo 💪'}</p>

      {/* Mensaje motivacional */}
      <p className="mb-6 text-center text-lg italic">{mensaje}</p>

      {/* Botones */}
      <div className="flex gap-4 mb-6">
        {!activo && (
          <button onClick={iniciar} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white">Iniciar</button>
        )}
        {activo && (
          <button onClick={pausar} className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl text-white">Pausar</button>
        )}
        <button onClick={reiniciar} className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white">Reiniciar</button>
        <button onClick={() => router.push('/')} className="px-6 py-2 bg-gray-400 hover:bg-gray-500 rounded-xl text-white">Salir</button>
      </div>

    </div>
  )
}









