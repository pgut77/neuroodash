'use client'

import { useState, useEffect } from 'react'
import { db, auth } from '../../lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation' 

const generateNumbers = (count: number) => {
  return Array.from({ length: count }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
}

export default function SecuenciaNumerica() {
  const router = useRouter() 
  const total = 10
  const [numbers, setNumbers] = useState<number[]>(generateNumbers(total))
  const [current, setCurrent] = useState(1)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [highScore, setHighScore] = useState<number | null>(null)

  // Cargar el mejor tiempo desde la subcolección del usuario
  useEffect(() => {
    const fetchHighScore = async () => {
      const user = auth.currentUser
      if (!user) return

      const ref = doc(db, 'users', user.uid, 'scores', 'sequence')
      const snap = await getDoc(ref)
      if (snap.exists()) setHighScore(snap.data().time)
    }

    const timer = setTimeout(fetchHighScore, 500) // esperar auth
    return () => clearTimeout(timer)
  }, [])

  const handleClick = async (num: number) => {
    if (num === current) {
      if (current === 1) setStartTime(Date.now())
      if (current === total) {
        const completionTime = Date.now()
        setEndTime(completionTime)

        const timeTaken = (completionTime - (startTime || completionTime)) / 1000

        const user = auth.currentUser
        if (user && (highScore === null || timeTaken < highScore)) {
          await setDoc(doc(db, 'users', user.uid, 'scores', 'sequence'), { time: timeTaken })
          setHighScore(timeTaken)
        }
      }
      setCurrent(current + 1)
    }
  }

  const resetGame = () => {
    setNumbers(generateNumbers(total))
    setCurrent(1)
    setStartTime(null)
    setEndTime(null)
  }

  const getTime = () => {
    if (!startTime || !endTime) return null
    return ((endTime - startTime) / 1000).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">🔢 Secuencia Numérica</h1>

      <div className="grid grid-cols-5 gap-4">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => handleClick(num)}
            className={`w-16 h-16 text-xl font-bold rounded shadow transition 
              ${num < current
                ? 'bg-green-400 text-white'
                : 'bg-blue-200 hover:bg-blue-300 dark:bg-blue-800 dark:hover:bg-blue-700'
              }`}
            disabled={num < current}
          >
            {num}
          </button>
        ))}
      </div>

      {endTime && (
        <div className="mt-6 text-lg font-semibold text-green-600">
          ¡Completado en {getTime()} segundos! 🎉
        </div>
      )}

      {highScore !== null && (
        <div className="mt-2 text-md text-blue-600 dark:text-blue-300">
          🏆 Mejor tiempo: {highScore.toFixed(2)}s
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex-1"
        >
          Reiniciar
        </button>

        <button
          onClick={() => router.push('/juegos')} 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex-1"
        >
          Salir
        </button>
      </div>
    </div>
  )
}
