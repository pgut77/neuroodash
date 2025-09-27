'use client'

import { useEffect, useState } from 'react'
import { Plus, Book, LogOut } from 'lucide-react'
import { db } from '../lib/firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { useRouter } from 'next/navigation'

interface Subject {
  id: string
  name: string
  teacher: string
  color: string
  day: string
  time: string
}

export default function GestorMaterias() {
  const [materias, setMaterias] = useState<Subject[]>([])
  const [form, setForm] = useState({
    name: '',
    teacher: '',
    color: '#6b7280',
    day: '',
    time: '',
  })
  const [loading, setLoading] = useState(false)
  const [hora, setHora] = useState('')
  const [fecha, setFecha] = useState('')

  const router = useRouter()

  const handleSalir = () => {
    // Puedes limpiar datos aquí si es necesario
    router.push('/')
  }

  // Reloj
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setHora(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      setFecha(now.toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Cargar materias
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'materias'), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Subject))
      setMaterias(data)
    })
    return () => unsub()
  }, [])

  const handleAdd = async () => {
    if (!form.name || !form.teacher || !form.day || !form.time) return
    setLoading(true)
    await addDoc(collection(db, 'materias'), form)
    setForm({
      name: '',
      teacher: '',
      color: '#6b7280',
      day: '',
      time: '',
    })
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'materias', id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Book className="w-7 h-7 text-blue-600" />
          <h1 className="text-3xl font-bold">Gestor de Materias</h1>
        </div>
        <button
          onClick={handleSalir}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          Salir
        </button>
      </div>

      {/* Fecha y hora */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-100 to-purple-200 rounded-lg px-4 py-3 shadow">
        <div className="text-md text-gray-700 font-medium">{fecha}</div>
        <div className="text-xl font-bold text-gray-800">{hora}</div>
      </div>

      {/* Formulario */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Agregar nueva materia</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre de la materia"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Nombre del profesor"
            value={form.teacher}
            onChange={(e) => setForm({ ...form, teacher: e.target.value })}
            className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="color"
            value={form.color}
            
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-full h-10 rounded border border-gray-300 cursor-pointer"
          />
          <select
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value })}
            className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Día de la semana</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition"
        >
          <Plus className="inline-block mr-2" /> Agregar
        </button>
      </div>

      {/* Lista de materias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {materias.map((mat) => (
          <div
            key={mat.id}
            className="rounded-xl shadow-md p-4 relative text-white"
            style={{ backgroundColor: mat.color }}
          >
            <h3 className="text-xl font-bold mb-1">{mat.name}</h3>
            <p className="text-sm">Profesor: {mat.teacher}</p>
            <p className="text-sm">Día: {mat.day}</p>
            <p className="text-sm">Hora: {mat.time}</p>
            <button
              onClick={() => handleDelete(mat.id)}
              className="absolute top-2 right-2 text-xs text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

