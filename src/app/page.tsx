'use client'

import { TimerIcon, BrainIcon, BarChartIcon, LeafIcon, LightbulbIcon,  BookOpenIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const sections = [
  {
    title: 'Pomodoro',
    description: 'Enfócate con sesiones temporizadas.',
    icon: <TimerIcon className="w-6 h-6 text-red-500" />,
    href: '/pomodoro',
  },
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
    title: 'Modo Zen',
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
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">🎯 Bienvenido</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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


