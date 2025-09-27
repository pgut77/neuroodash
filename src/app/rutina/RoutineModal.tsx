'use client'

import { useState, useEffect } from 'react'
import { Routine, TaskItem } from '../types' // Opcional: si defines tipos separados
import { X } from 'lucide-react'

type RoutineModalProps = {
  onClose: () => void
  onSave: (routine: Omit<Routine, 'id' | 'createdAt'>) => void
  editing?: Routine | null
}

export default function RoutineModal({ onClose, onSave, editing }: RoutineModalProps) {
  const [title, setTitle] = useState('')
  const [tasks, setTasks] = useState<TaskItem[]>([])

  useEffect(() => {
    if (editing) {
      setTitle(editing.title)
      setTasks(editing.tasks)
    } else {
      setTitle('')
      setTasks([])
    }
  }, [editing])

  const addTask = () => {
    setTasks(prev => [...prev, { id: crypto.randomUUID(), text: '', done: false }])
  }

  const updateTaskText = (id: string, text: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text } : t))
  }

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const handleSubmit = () => {
    if (!title.trim()) return alert('El título es obligatorio')
    onSave({ title, tasks })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
        >
          <X size={18} />
        </button>
        <h2 className="text-xl font-bold mb-4">{editing ? 'Editar rutina' : 'Nueva rutina'}</h2>

        <input
          type="text"
          placeholder="Título de la rutina"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        />

        <div className="space-y-2 mb-4">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-2">
              <input
                type="text"
                value={task.text}
                onChange={e => updateTaskText(task.id, e.target.value)}
                className="flex-1 p-1 border rounded dark:bg-gray-700 dark:text-white"
              />
              <button onClick={() => removeTask(task.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
            </div>
          ))}
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
