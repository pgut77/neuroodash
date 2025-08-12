'use client'

import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useRouter } from "next/navigation"

const generateProblem = () => {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  const ops = ['+', '-', '×']
  const op = ops[Math.floor(Math.random() * ops.length)]

  let answer = 0
  if (op === '+') answer = a + b
  else if (op === '-') answer = a - b
  else if (op === '×') answer = a * b

  const choices = new Set([answer])
  while (choices.size < 4) {
    choices.add(answer + Math.floor(Math.random() * 10) - 5)
  }

  return {
    question: `${a} ${op} ${b}`,
    answer,
    options: Array.from(choices).sort(() => Math.random() - 0.5),
  }
}

export default function CalculoRapido() {
  const [problem, setProblem] = useState(generateProblem())
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(5)
  const [gameOver, setGameOver] = useState(false)
  const [highScore, setHighScore] = useState<number | null>(null)

  const router = useRouter();

  const handleSalir = () => {
    router.push("/juegos") // redirige al inicio
  }

  useEffect(() => {
    const fetchHighScore = async () => {
      const ref = doc(db, 'scores', 'calculo')
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setHighScore(snap.data().score)
      }
    }
    fetchHighScore()
  }, [])

  useEffect(() => {
    if (gameOver) return
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameOver])

  useEffect(() => {
    const updateHighScore = async () => {
      if (gameOver && (highScore === null || score > highScore)) {
        await setDoc(doc(db, 'scores', 'calculo'), { score })
        setHighScore(score)
      }
    }
    updateHighScore()
  }, [gameOver])

  const handleAnswer = (val: number) => {
    if (val === problem.answer) {
      setScore(score + 1)
      setProblem(generateProblem())
      setTime(5)
    } else {
      setGameOver(true)
    }
  }

  const restart = () => {
    setScore(0)
    setGameOver(false)
    setProblem(generateProblem())
    setTime(5)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">🧮 Cálculo Rápido</h1>

      {!gameOver ? (
        <>
          <p className="text-xl mb-2">⏱️ Tiempo: <span className="font-bold">{time}</span>s</p>
          <p className="text-2xl font-bold mb-4">{problem.question}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {problem.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {opt}
              </button>
            ))}
          </div>

          <p className="text-lg">🎯 Puntaje: <strong>{score}</strong></p>
          {highScore !== null && (
            <p className="text-sm text-gray-500 dark:text-gray-300">🏆 Mejor puntaje: {highScore}</p>
          )}

          <button
            onClick={handleSalir}
            className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition"
          >
            ⏻ Salir
          </button>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-500 mb-4">¡Juego terminado!</h2>
          <p className="text-lg mb-2">Tu puntaje fue: <strong>{score}</strong></p>
          {highScore !== null && (
            <p className="text-md text-blue-600 dark:text-blue-300">🏆 Mejor puntaje: {highScore}</p>
          )}

          <div className="flex flex-col gap-4 mt-6">
            <button
              onClick={restart}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              🔁 Reiniciar
            </button>

            <button
              onClick={handleSalir}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              🚪 Salir
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


