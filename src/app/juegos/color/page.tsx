'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const colores = [
  { nombre: 'rojo', codigo: 'red' },
  { nombre: 'azul', codigo: 'blue' },
  { nombre: 'verde', codigo: 'green' },
  { nombre: 'amarillo', codigo: 'yellow' },
  { nombre: 'morado', codigo: 'purple' },
  { nombre: 'naranja', codigo: 'orange' },
  { nombre: 'rosa', codigo: 'pink' },
  { nombre: 'marrón', codigo: 'brown' },
  { nombre: 'gris', codigo: 'gray' },
  { nombre: 'cian', codigo: 'cyan' },
  { nombre: 'magenta', codigo: 'magenta' },
  { nombre: 'negro', codigo: 'black' },
  { nombre: 'blanco', codigo: 'white' },
  { nombre: 'lima', codigo: 'lime' },
  { nombre: 'aguamarina', codigo: 'teal' },
  { nombre: 'marino', codigo: 'navy' }
]

const generateColors = (count: number) => {
  return Array.from({ length: count }, () => {
    const color = colores[Math.floor(Math.random() * colores.length)]
    return color
  })
}

export default function ColorFinder() {
  const [colors, setColors] = useState<{ nombre: string, codigo: string }[]>([])
  const [target, setTarget] = useState<{ nombre: string, codigo: string } | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState<number | null>(null)
  const [gameOver, setGameOver] = useState(false)

  const router = useRouter();

  const handleSalir = () => {
    router.push("/");
  };

  // Cargar mejor puntaje desde Firebase
  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const ref = doc(db, 'scores', 'color')
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const data = snap.data()
          if (typeof data.score === "number") {
            setHighScore(data.score)
          }
        }
      } catch (error) {
        console.error("Error al obtener el puntaje:", error)
      }
    }
    fetchHighScore()
  }, [])

  // Iniciar el juego
  useEffect(() => {
    startGame()
  }, [])

  // Actualizar el mejor puntaje
  useEffect(() => {
    const updateHighScore = async () => {
      if (gameOver && (highScore === null || score > highScore)) {
        try {
          await setDoc(doc(db, 'scores', 'color'), { score }, { merge: true })
          setHighScore(score)
        } catch (error) {
          console.error("Error al guardar el puntaje:", error)
        }
      }
    }
    updateHighScore()
  }, [gameOver])

  const startGame = () => {
    const nuevos = generateColors(6)
    const objetivo = nuevos[Math.floor(Math.random() * nuevos.length)]
    setColors(nuevos)
    setTarget(objetivo)
    setGameOver(false)
    setScore(0)
  }

  const handleChoice = (color: { nombre: string, codigo: string }) => {
    if (gameOver || !target) return
    if (color.nombre === target.nombre) {
      setScore(prev => prev + 1)
      const nuevos = generateColors(6)
      const nuevoObjetivo = nuevos[Math.floor(Math.random() * nuevos.length)]
      setColors(nuevos)
      setTarget(nuevoObjetivo)
    } else {
      setGameOver(true)
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">

      {/* Botón salir flotante */}
      <button
        onClick={() => router.push('/juegos')} 
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-full shadow-lg transition flex items-center gap-2"
      >
        ⏻ Salir
      </button>

      <h1 className="text-3xl font-bold mb-4">🎨 Color Finder</h1>

      {gameOver ? (
        <div className="text-center">
          <p className="text-lg mb-2 text-red-500">¡Juego terminado!</p>
          <p className="text-lg mb-2">Tu puntaje: <strong>{score}</strong></p>
          {highScore !== null && (
            <p className="text-lg mb-4 text-green-600">Puntaje más alto: <strong>{highScore}</strong></p>
          )}
          <div className="flex flex-col items-center gap-3 mt-4">
            <button
              onClick={startGame}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reiniciar
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-2 text-xl">
            ¿Cuál es el color <span className="font-mono">{target?.nombre}</span>?
          </p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(color)}
                style={{ backgroundColor: color.codigo }}
                className="w-20 h-20 rounded shadow-md border-2 border-gray-200"
              />
            ))}
          </div>
          <p className="mt-4 text-lg">Puntaje: <strong>{score}</strong></p>
          {highScore !== null && (
            <p className="text-sm text-gray-500">Puntaje más alto: {highScore}</p>
          )}
        </>
      )}
    </div>
  )
}
