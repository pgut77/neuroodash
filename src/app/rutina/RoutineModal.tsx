'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

type Periodo = 'Mañana' | 'Tarde' | 'Noche'

export type TaskItem = {
  id: string
  text: string
  done: boolean
}

export type Routine = {
  id?: string
  title: string
  tasks: TaskItem[]
  period: Periodo
}

type RoutineModalProps = {
  onClose: () => void
  onSave: (routine: Omit<Routine, 'id'>) => void
  editing?: Routine | null
}

export default function RoutineModal({ onClose, onSave, editing }: RoutineModalProps) {
  const [title, setTitle] = useState('')
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [period, setPeriod] = useState<Periodo>('Mañana')

  useEffect(() => {
    if (editing) {
      setTitle(editing.title)
      setTasks(editing.tasks)
      setPeriod(editing.period)
    } else {
      setTitle('')
      setTasks([])
      setPeriod('Mañana')
    }
  }, [editing])

  const addTask = () => {
    setTasks(prev => [...prev, { id: crypto.randomUUID(), text: '', done: false }])
  }

  const updateTaskText = (id: string, text: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, text } : t)))
  }

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const handleSubmit = () => {
    if (!title.trim()) return alert('El título es obligatorio')
    if (tasks.some(t => !t.text.trim())) return alert('Todas las tareas deben tener texto')
    onSave({ title: title.trim(), tasks, period })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {editing ? 'Editar rutina' : 'Nueva rutina'}
        </h2>

        {/* Campo título */}
        <input
          type="text"
          placeholder="Título de la rutina"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        />

        {/* Selector de periodo */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">Periodo del día</label>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as Periodo)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="Mañana">🌅 Mañana</option>
            <option value="Tarde">🌇 Tarde</option>
            <option value="Noche">🌙 Noche</option>
          </select>
        </div>

        {/* Lista de tareas */}
        <div className="space-y-2 mb-4">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-2">
              <input
                type="text"
                value={task.text}
                onChange={e => updateTaskText(task.id, e.target.value)}
                placeholder="Escribe una tarea..."
                className="flex-1 p-1 border rounded dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => removeTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">No hay tareas aún.</p>
          )}
        </div>

        <button
          onClick={addTask}
          className="mb-4 px-3 py-1 rounded bg-blue-500 hover:bg-blue-400 text-white font-semibold"
        >
          Añadir tarea
        </button>

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
        >
          {editing ? 'Guardar cambios' : 'Crear rutina'}
        </button>
      </div>
    </div>
  )
}
