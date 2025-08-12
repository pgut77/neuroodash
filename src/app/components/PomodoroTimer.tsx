'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const WORK_TIME = 25 * 60
const BREAK_TIME = 5 * 60

const sounds = [
  { name: 'Campana', src: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg' },
]

const phrases = [
  "✨ Enfócate en una cosa a la vez.",
  "🚀 Tú puedes con esto.",
  "🧠 La constancia es la clave.",
  "🌱 Cada segundo cuenta.",
  "🎯 Pequeños pasos logran grandes metas."
]

export default function PomodoroTimer() {
  const [seconds, setSeconds] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [isWork, setIsWork] = useState(true)
  const [cycleCount, setCycleCount] = useState(0)
  const [selectedSound] = useState(sounds[0].src)
  const [phrase, setPhrase] = useState(phrases[0])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const totalTime = isWork ? WORK_TIME : BREAK_TIME
  const percentage = ((totalTime - seconds) / totalTime) * 100

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${min}:${sec}`
  }

  const playSound = () => {
    const audio = new Audio(selectedSound)
    audio.play()
  }

  useEffect(() => {
    if (isRunning && seconds % 300 === 0 && seconds !== totalTime) {
      setPhrase(phrases[Math.floor(Math.random() * phrases.length)])
    }
  }, [seconds, isRunning])

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1)
      }, 1000)
    } else if (seconds === 0) {
      clearInterval(intervalRef.current!)
      playSound()
      setIsRunning(false)
      setIsWork((prev) => !prev)
      setSeconds(isWork ? BREAK_TIME : WORK_TIME)
      setCycleCount((prev) => prev + 1)
      setPhrase(phrases[Math.floor(Math.random() * phrases.length)])
    }

    return () => clearInterval(intervalRef.current!)
  }, [isRunning, seconds, isWork])

  return (
    <div className="bg-black text-white rounded-xl p-6 shadow-lg max-w-md mx-auto space-y-6">
      <div className="w-64 h-64 mx-auto">
        <CircularProgressbar
          value={percentage}
          text={formatTime(seconds)}
          styles={buildStyles({
            textColor: '#fff',
            pathColor: isWork ? '#3b82f6' : '#10b981',
            trailColor: '#044fc7ff',
            textSize: '20px',
          })}
        />
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-2 rounded-xl text-black bg-blue-500 hover:bg-blue-600"
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          onClick={() => {
            clearInterval(intervalRef.current!)
            setIsRunning(false)
            setSeconds(isWork ? WORK_TIME : BREAK_TIME)
          }}
          className="px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
        >
          Reiniciar
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 rounded-xl bg-gray-700 hover:bg-gray-800 text-white"
        >
          Salir
        </button>
      </div>

      <p className="text-center text-sm">
        Modo actual: <span className={isWork ? 'text-blue-400' : 'text-green-400'}>{isWork ? 'Trabajo' : 'Descanso'}</span>
      </p>

      <p className="text-center text-lg italic">💬 {phrase}</p>

      <p className="text-sm text-center">🔁 Ciclos completados: <strong>{cycleCount}</strong></p>
    </div>
  )
}




