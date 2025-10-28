'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase' // Asegúrate que este path sea correcto
import { TimerIcon, BrainIcon, BarChartIcon, LeafIcon, LightbulbIcon, BookOpenIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const sections = [
  {
    title: 'Juegos Mentales',
    description: 'Entrena tu mente diariamente.',
    icon: <BrainIcon className="w-6 h-6 text-indigo-500" />,
    href: '/juegos',
  },
  {
    title: 'Consejos',
    description: 'Tips de productividad y bienestar.',
    icon: <LightbulbIcon className="w-6 h-6 text-yellow-500" />,
    href: '/consejos',
  },
  {
    title: 'Estadísticas',
    description: 'Visualiza tu progreso.',
    icon: <BarChartIcon className="w-6 h-6 text-green-500" />,
    href: '/estadisticas',
  },
  {
    title: 'Pomodoro Zen',
    description: 'Relájate y respira.',
    icon: <LeafIcon className="w-6 h-6 text-emerald-500" />,
    href: '/zen',
  },
  {
    title: 'Lista de Tareas',
    description: 'Organiza tus tareas.',
    icon: <BookOpenIcon className="w-6 h-6 text-blue-500" />,
    href: '/tareas',
  },
  {
    title: 'Materias',
    description: 'Organiza tus materias.',
    icon: <BookOpenIcon className="w-6 h-6 text-yellow-500" />,
    href: '/materias',
  },
  {
    title: 'Calendario',
    description: 'Organizate a tu manera.',
    icon: <BookOpenIcon className="w-6 h-6 text-yellow-500" />,
    href: '/calendario',
  },
  {
    title: 'Rutina',
    description: 'Organiza tu rutina diaria.',
    icon: <BookOpenIcon className="w-6 h-6 text-purple-500" />,
    href: '/rutina',
  },
  {
    title: 'Diario',
    description: 'Lleva un registro de tus emociones y pensamientos.',
    icon: <BookOpenIcon className="w-6 h-6 text-purple-500" />,
    href: '/emociones',
  },
]

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          ❕Bienvenido {user.displayName || user.email}❕
        </h1>
        <button
          onClick={() => {
            auth.signOut()
            router.push('/login')
          }}
          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6">
        {sections.map((section, i) => (
          <Link key={section.title} href={section.href}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-2">
                {section.icon}
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {section.description}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
