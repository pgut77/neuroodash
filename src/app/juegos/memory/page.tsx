'use client'

import { useEffect, useState } from 'react'
import './memory.css'
import { db } from '../../lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const emojis = ['🍎', '🚀', '🐶', '🎲', '⚽', '🍕', '🌈', '🎧']

function createShuffledCards() {
  return [...emojis, ...emojis]
    .sort(() => 0.5 - Math.random())
    .map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false,
    }))
}

export default function MemoryGame() {
  const [cards, setCards] = useState(createShuffledCards)
  const [selected, setSelected] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState<number | null>(null)

  useEffect(() => {
    const fetchHighScore = async () => {
      const docRef = doc(db, 'scores', 'memory')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setHighScore(docSnap.data().score)
      }
    }
    fetchHighScore()
  }, [])

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected
      const isMatch = cards[first].emoji === cards[second].emoji
      if (isMatch) {
        setCards((prev) =>
          prev.map((card, i) =>
            i === first || i === second ? { ...card, matched: true } : card
          )
        )
        setMatches((prev) => prev + 1)
      }
      setTimeout(() => {
        setCards((prev) =>
          prev.map((card, i) =>
            i === first || i === second ? { ...card, flipped: false } : card
          )
        )
        setSelected([])
      }, 1000)
      setScore((prev) => prev + 1)
    }
  }, [selected])

  useEffect(() => {
    if (matches === emojis.length) {
      if (highScore === null || score < highScore) {
        const saveScore = async () => {
          await setDoc(doc(db, 'scores', 'memory'), { score })
          setHighScore(score)
        }
        saveScore()
      }
    }
  }, [matches])

  const handleFlip = (index: number) => {
    if (selected.length < 2 && !cards[index].flipped && !cards[index].matched) {
      setCards((prev) =>
        prev.map((card, i) =>
          i === index ? { ...card, flipped: true } : card
        )
      )
      setSelected((prev) => [...prev, index])
    }
  }

  const restartGame = () => {
    setCards(createShuffledCards())
    setSelected([])
    setMatches(0)
    setScore(0)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-10">
      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">🧠 Memoria Visual</h1>
      {highScore !== null && (
        <p className="text-sm mb-2 text-gray-600 dark:text-gray-300">
          Mejor puntaje: <strong>{highScore} intentos</strong>
        </p>
      )}
      <p className="text-sm mb-6 text-gray-600 dark:text-gray-300">
        Intentos: {score}
      </p>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`memory-card ${card.flipped || card.matched ? 'flipped' : ''}`}
            onClick={() => handleFlip(index)}
          >
            <div className="memory-card-inner">
              <div className="memory-card-front">❓</div>
              <div className="memory-card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>
      {matches === emojis.length && (
        <p className="mt-6 text-green-600 font-semibold">¡Juego completado! 🎉</p>
      )}
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={restartGame}
      >
        Reiniciar juego
      </button>
    </div>
  )
}


