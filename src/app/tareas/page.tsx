'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { format, isBefore } from 'date-fns'
import { CalendarIcon, LogOutIcon, PlusIcon, Trash2Icon, CheckCircle2Icon } from 'lucide-react'

type Task = {
  id: string
  text: string
  dueDate: string
  priority: 'alta' | 'media' | 'baja'
  completed: boolean
  category?: string
}

export default function ListaTareas() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<'alta' | 'media' | 'baja'>('media')
  const [category, setCategory] = useState('')

  const tasksRef = collection(db, 'tasks')
    const router = useRouter();

  const handleSalir = () => {
    // Aquí puedes limpiar datos si usas algo como localStorage o contexto
    // localStorage.clear(); // ejemplo

    router.push("/"); // redirige a la página de inicio
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(tasksRef, orderBy('priority', 'desc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[]
      setTasks(data)
    }

    fetchTasks()
  }, [])

  const addTask = async () => {
    if (!text.trim()) return
    const newTask: Omit<Task, 'id'> = {
      text,
      dueDate,
      priority,
      completed: false,
      category,
    }
    const docRef = await addDoc(tasksRef, newTask)
    setTasks([...tasks, { ...newTask, id: docRef.id }])
    setText('')
    setDueDate('')
    setPriority('media')
    setCategory('')
  }

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    await updateDoc(doc(db, 'tasks', id), {
      completed: !task.completed,
    })
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id))
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const completionRate = Math.round(
    (tasks.filter((t) => t.completed).length / tasks.length) * 100 || 0
  )

  const priorityColor = {
    alta: 'text-red-600',
    media: 'text-yellow-600',
    baja: 'text-green-600',
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">📋 Lista de Tareas</h1>
        <button
          onClick={handleSalir}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
           ⏻ Salir
        </button>
      </div>

      {/* Formulario de nueva tarea */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nueva tarea..."
          className="p-2 rounded border w-full dark:bg-gray-900 dark:border-gray-700"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 rounded border dark:bg-gray-900 dark:border-gray-700"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="p-2 rounded border dark:bg-gray-900 dark:border-gray-700"
        >
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Categoría"
          className="p-2 rounded border dark:bg-gray-900 dark:border-gray-700"
        />
        <button
          onClick={addTask}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <PlusIcon size={18} />
          Agregar
        </button>
      </div>

      {/* Progreso */}
      {completionRate > 0 && (
        <div className="mb-4">
          <p className="text-sm mb-1">Progreso: {completionRate}% completado</p>
          <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded">
            <div
              className="h-2 rounded bg-green-500 transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Lista de tareas */}
      <ul className="space-y-3">
        {tasks.map((task) => {
          const isOverdue = isBefore(new Date(task.dueDate), new Date())
          const taskBg = task.completed
            ? 'bg-gray-200 dark:bg-gray-700 line-through text-gray-500'
            : isOverdue
            ? 'bg-red-100 dark:bg-red-900'
            : 'bg-green-100 dark:bg-green-900'

          return (
            <li
              key={task.id}
              className={`p-4 rounded-lg shadow-md flex justify-between items-center transition ${taskBg}`}
            >
              <div className="flex-1">
                <p className="text-lg font-semibold">{task.text}</p>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                  Vence: {task.dueDate && format(new Date(task.dueDate), 'dd/MM/yyyy')} |{' '}
                  <span className={`${priorityColor[task.priority]} font-semibold`}>
                    Prioridad: {task.priority}
                  </span>
                  {task.category && <> | Categoría: {task.category}</>}
                </p>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="text-green-600 hover:text-green-800 transition"
                  title="Completar"
                >
                  <CheckCircle2Icon size={20} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Eliminar"
                >
                  <Trash2Icon size={20} />
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
