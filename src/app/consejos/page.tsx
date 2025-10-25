'use client'

import { useEffect, useState } from 'react'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db, auth } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

interface Consejo {
  texto: string
  estado: string
}

const estados = ['motivado', 'estresado', 'triste', 'desenfocado', 'feliz', 'ansioso']

export default function Consejos() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [consejos, setConsejos] = useState<Consejo[]>([])
  const [nuevoConsejo, setNuevoConsejo] = useState('')
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('motivado')
  const [filtro, setFiltro] = useState('motivado')
  const [loading, setLoading] = useState(false)

  // 🔹 Detectar si hay usuario logueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        router.push('/login') // redirige si no hay usuario
      }
    })
    return () => unsubscribe()
  }, [router])

  // 🔹 Cargar consejos del usuario actual
  useEffect(() => {
    const fetchConsejos = async () => {
      if (!user) return
      const snapshot = await getDocs(collection(db, 'users', user.uid, 'consejos'))
      const data = snapshot.docs.map(doc => ({
        texto: doc.data().texto,
        estado: doc.data().estado || 'motivado',
      }))
      setConsejos(data)
    }

    fetchConsejos()
  }, [user])

  // 🔹 Agregar nuevo consejo
  const handleAgregar = async () => {
    if (!user) return alert('Debes iniciar sesión primero.')
    if (nuevoConsejo.trim() === '') return

    setLoading(true)
    try {
      const ref = collection(db, 'users', user.uid, 'consejos')
      await addDoc(ref, {
        texto: nuevoConsejo,
        estado: estadoSeleccionado,
        fecha: new Date(),
      })

      setConsejos([...consejos, { texto: nuevoConsejo, estado: estadoSeleccionado }])
      setNuevoConsejo('')
    } catch (err) {
      console.error('Error al agregar consejo:', err)
    }
    setLoading(false)
  }

  const consejosFiltrados = consejos.filter(c => c.estado === filtro)

  return (
    <div className="min-h-screen bg-[#ffffff] text-gray-900 p-6">
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
      <div className="max-w-xl mx-auto bg-[#f8f5f0] p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Agregar Consejo</h2>
        <textarea
          value={nuevoConsejo}
          onChange={(e) => setNuevoConsejo(e.target.value)}
          className="w-full p-3 rounded bg-white text-gray-900 resize-none"
          placeholder="Escribe un consejo..."
          rows={3}
        />
        <select
          value={estadoSeleccionado}
          onChange={(e) => setEstadoSeleccionado(e.target.value)}
          className="mt-4 w-full p-2 bg-white rounded"
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
          className="w-full p-2 rounded bg-white"
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
            <div key={i} className="bg-white p-4 rounded shadow">
              {consejo.texto}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            No hay consejos para este estado 😔
          </p>
        )}
      </div>
    </div>
  )
}
