'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Gamepad2, Brain, Palette, Calculator } from 'lucide-react'

const games = [
  {
    name: '🧠 Memoria Visual',
    route: '/juegos/memory',
    icon: <Brain className="w-6 h-6 mr-2" />,
    description: 'Encuentra las cartas iguales',
  },
  {
    name: '🔢 Secuencia Numérica',
    route: '/juegos/secuencia',
    icon: <Calculator className="w-6 h-6 mr-2" />,
    description: 'Haz clic en orden ascendente',
  },
  {
    name: '🎨 Encuentra el Color',
    route: '/juegos/color',
    icon: <Palette className="w-6 h-6 mr-2" />,
    description: 'Selecciona el color correcto',
  },
  {
    name: '⚡ Cálculo Rápido',
    route: '/juegos/focus',
    icon: <Gamepad2 className="w-6 h-6 mr-2" />,
    description: 'Responde operaciones mentales',
  },
]

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-10">🧠 Minijuegos Mentales</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {games.map((game, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-300 dark:border-gray-700 hover:shadow-2xl transition-all"
          >
            <Link href={game.route} className="flex items-center">
              <div className="text-2xl mr-4">{game.icon}</div>
              <div>
                <h2 className="text-xl font-semibold">{game.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{game.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
