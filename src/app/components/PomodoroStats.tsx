'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const data = [
  { day: 'Lun', cycles: 3 },
  { day: 'Mar', cycles: 5 },
  { day: 'Mié', cycles: 4 },
  { day: 'Jue', cycles: 6 },
  { day: 'Vie', cycles: 2 },
  { day: 'Sáb', cycles: 4 },
  { day: 'Dom', cycles: 1 },
]

export default function PomodoroStats() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center dark:text-white">📊 Ciclos por Día</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="#888" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="cycles" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
