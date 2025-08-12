'use client'

import { useEffect, useState } from 'react'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

interface Consejo {
  texto: string
  estado: string
}

const estados = ['motivado', 'estresado', 'triste', 'desenfocado', 'feliz', 'ansioso']

export default function Consejos() {
  const router = useRouter()

  const [consejos, setConsejos] = useState<Consejo[]>([])
  const [nuevoConsejo, setNuevoConsejo] = useState('')
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('motivado')
  const [filtro, setFiltro] = useState('motivado')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchConsejos = async () => {
      const snapshot = await getDocs(collection(db, 'consejos'))
      const data = snapshot.docs.map(doc => ({
        texto: doc.data().texto,
        estado: doc.data().estado || 'motivado',
      }))
      setConsejos(data)
    }
    fetchConsejos()
  }, [])

  const handleAgregar = async () => {
    if (nuevoConsejo.trim() === '') return
    setLoading(true)
    try {
      await addDoc(collection(db, 'consejos'), {
        texto: nuevoConsejo,
        estado: estadoSeleccionado,
      })
      setConsejos([...consejos, { texto: nuevoConsejo, estado: estadoSeleccionado }])
      setNuevoConsejo('')
    } catch (err) {
      console.error('Error al agregar consejo:', err)
    }
    setLoading(false)
  }

  const consejosFiltrados = consejos.filter(c => c.estado === filtro)

  // Función para salir / ir a home o página que desees
  function handleSalir() {
    router.push('/') // Cambia la ruta si quieres otro destino
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6">
      
      {/* Botón Salir */}
      <button
        onClick={() => router.push('/')} 
        className="flex items-center mb-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Salir
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">🌟 Consejos por Estado de Ánimo</h1>

      {/* Formulario */}
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Agregar Consejo</h2>
        <textarea
          value={nuevoConsejo}
          onChange={(e) => setNuevoConsejo(e.target.value)}
          className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          placeholder="Escribe un consejo..."
          rows={3}
        />
        <select
          value={estadoSeleccionado}
          onChange={(e) => setEstadoSeleccionado(e.target.value)}
          className="mt-4 w-full p-2 bg-gray-100 dark:bg-gray-700 rounded"
        >
          {estados.map((estado) => (
            <option key={estado} value={estado}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </option>
          ))}
        </select>
        <button
          onClick={handleAgregar}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Agregando...' : 'Agregar Consejo'}
        </button>
      </div>

      {/* Filtro */}
      <div className="max-w-xl mx-auto mb-4">
        <label className="block mb-2 text-lg font-semibold">Filtrar por estado de ánimo:</label>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full p-2 rounded bg-white dark:bg-gray-700"
        >
          {estados.map((estado) => (
            <option key={estado} value={estado}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Lista */}
      <div className="max-w-xl mx-auto space-y-3">
        {consejosFiltrados.length > 0 ? (
          consejosFiltrados.map((consejo, i) => (
            <div key={i} className="bg-white dark:bg-gray-700 p-4 rounded shadow">
              {consejo.texto}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No hay consejos para este estado 😔
          </p>
        )}
      </div>
    </div>
  )
}





