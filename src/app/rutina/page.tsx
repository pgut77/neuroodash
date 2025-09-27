'use client'

import { useEffect, useMemo, useState } from 'react'
import  RoutineModal  from './RoutineModal'
import { useRouter } from 'next/navigation'
import { db } from '../lib/firebase'
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, Timestamp, updateDoc
} from 'firebase/firestore'
import { Plus, PencilLine, Trash2, CheckSquare, RefreshCcw, X } from 'lucide-react'

type Periodo = 'Mañana' | 'Tarde' | 'Noche'
type TaskItem = { id: string; text: string; done: boolean }
type Routine = {
  id?: string
  title: string
  period: Periodo
  tasks: TaskItem[]
  createdAt?: Timestamp
}

const PERIODS: Periodo[] = ['Mañana', 'Tarde', 'Noche']
const PERIOD_COLORS: Record<Periodo, string> = {
  Mañana: 'from-amber-400 to-orange-500',
  Tarde: 'from-blue-500 to-indigo-600',
  Noche: 'from-violet-600 to-fuchsia-600',
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Routine | null>(null)
  const router = useRouter()

  useEffect(() => {
    const ref = collection(db, 'routines')
    const q = query(ref, orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, snap => {
      const list: Routine[] = []
      snap.forEach(d => list.push({ id: d.id, ...(d.data() as Routine) }))
      setRoutines(list)
    })
    return () => unsub()
  }, [])

  const grouped = useMemo(() => {
    return PERIODS.reduce((acc, p) => {
      acc[p] = routines.filter(r => r.period === p)
      return acc
    }, {} as Record<Periodo, Routine[]>)
  }, [routines])

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (r: Routine) => { setEditing(r); setModalOpen(true) }
  const closeModal = () => { setEditing(null); setModalOpen(false) }

  const saveRoutine = async (payload: Omit<Routine, 'id' | 'createdAt'>) => {
    if (editing?.id) {
      await updateDoc(doc(db, 'routines', editing.id), { ...payload })
    } else {
      await addDoc(collection(db, 'routines'), { ...payload, createdAt: Timestamp.now() })
    }
    closeModal()
  }

  const deleteRoutine = async (id: string) => {
    await deleteDoc(doc(db, 'routines', id))
  }

  const toggleTask = async (routine: Routine, taskId: string) => {
    if (!routine.id) return
    const tasks = routine.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
    await updateDoc(doc(db, 'routines', routine.id), { tasks })
  }

  const markAll = async (routine: Routine, value: boolean) => {
    if (!routine.id) return
    const tasks = routine.tasks.map(t => ({ ...t, done: value }))
    await updateDoc(doc(db, 'routines', routine.id), { tasks })
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6">
      <div className="mx-auto max-w-6xl flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Rutinas personalizadas</h1>
        <div className="flex gap-3">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white shadow-md"
          >
            <Plus size={18} /> Nueva rutina
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md"
          >
            Salir
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-6">
        {PERIODS.map(period => (
          <div
            key={period}
            className="rounded-2xl overflow-hidden shadow-lg
              bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-neutral-300 dark:border-neutral-700"
          >
            <div className={`px-4 py-3 bg-gradient-to-r ${PERIOD_COLORS[period]} text-white font-semibold`}>
              {period}
            </div>

            <div className="p-4 space-y-4">
              {grouped[period].length === 0 && (
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Sin rutinas en {period.toLowerCase()}…
                </p>
              )}

              {grouped[period].map(r => (
                <div
                  key={r.id}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">{r.title}</h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(r)}
                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        title="Editar"
                      >
                        <PencilLine size={16} />
                      </button>
                      {r.id && (
                        <button
                          onClick={() => deleteRoutine(r.id!)}
                          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <ul className="mt-3 space-y-2">
                    {r.tasks.map(task => (
                      <li key={task.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleTask(r, task.id)}
                          className="size-4 accent-emerald-500"
                        />
                        <span className={`text-sm ${task.done ? 'line-through text-neutral-500 dark:text-neutral-400' : ''}`}>
                          {task.text}
                        </span>
                      </li>
                    ))}
                    {r.tasks.length === 0 && (
                      <li className="text-xs text-neutral-500 dark:text-neutral-400">Sin tareas aún.</li>
                    )}
                  </ul>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => markAll(r, true)}
                      className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-sm text-white flex items-center gap-2 shadow"
                    >
                      <CheckSquare size={14} /> Marcar todo
                    </button>
                    <button
                      onClick={() => markAll(r, false)}
                      className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm flex items-center gap-2"
                    >
                      <RefreshCcw size={14} /> Reiniciar día
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <RoutineModal onClose={closeModal} onSave={saveRoutine} editing={editing} />
      )}
    </div>
  )
}
