'use client'

import { useState, useEffect } from 'react'
import { db, auth } from '../lib/firebase'
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore'
import { format, subDays } from 'date-fns'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const emociones = ['😄', '😐', '😔', '😡', '😴']

const emocionesMap: Record<string, number> = {
  '😄': 5,
  '😐': 3,
  '😔': 2,
  '😡': 1,
  '😴': 2,
}

const reverseMap: Record<number, string> = {
  5: '😄',
  3: '😐',
  2: '😔/😴',
  1: '😡',
}

export default function MoodDashboard() {
  const [selected, setSelected] = useState<string | null>(null)
  const [data, setData] = useState<any[]>([])
  const router = useRouter()

  const uid = auth.currentUser?.uid
  if (!uid) {
    // Opcional: redirigir si no hay usuario
    router.push('/login')
    return null
  }

  // Guardar emoción en la subcolección del usuario
  const saveMood = async () => {
    if (!selected || !uid) return
    const today = format(new Date(), 'yyyy-MM-dd')
    const moodsRef = collection(db, 'users', uid, 'moods')
    await addDoc(moodsRef, { mood: selected, date: today, createdAt: new Date() })
    setSelected(null)
    fetchData()
  }

  // Consultar datos de los últimos 7 días
  const fetchData = async () => {
    if (!uid) return
    const moodsRef = collection(db, 'users', uid, 'moods')
    const last7Days = Array.from({ length: 7 }).map((_, i) =>
      format(subDays(new Date(), i), 'yyyy-MM-dd')
    )
    const q = query(moodsRef, where('date', '>=', last7Days[6]), orderBy('date', 'asc'))
    const snapshot = await getDocs(q)

    const moodData = last7Days
      .reverse()
      .map((date) => {
        const doc = snapshot.docs.find((d) => d.data().date === date)
        return {
          date: format(new Date(date), 'EEE'),
          mood: doc ? emocionesMap[doc.data().mood] : null,
        }
      })

    setData(moodData)
  }

  useEffect(() => {
    fetchData()
  }, [uid])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Mood Tracker
        </h1>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Salir
        </button>
      </div>

      {/* Selección de emoción */}
      <div className="p-6 max-w-3xl mx-auto rounded-2xl shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 text-center">
          ¿Cómo te sientes hoy?
        </h2>
        <div className="flex justify-center gap-4 mb-4">
          {emociones.map((emo) => (
            <button
              key={emo}
              onClick={() => setSelected(emo)}
              className={`text-4xl transition transform hover:scale-125 ${
                selected === emo ? 'scale-125' : ''
              }`}
            >
              {emo}
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={saveMood}
            disabled={!selected}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50 hover:bg-blue-700 transition"
          >
            Guardar emoción
          </button>
        </div>
      </div>

      {/* Historial */}
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          📊 Historial de emociones (últimos 7 días)
        </h2>
        <div className="w-full h-72 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} tickFormatter={(val) => reverseMap[val] || ''} />
              <Tooltip formatter={(value: number) => reverseMap[value] || ''} />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
