'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { db, auth } from '../lib/firebase'
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore'
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday
} from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  PencilLine,
  X,
  LogOut
} from 'lucide-react'

type EventCategory = 'Escolar' | 'Personal' | 'Otros'

type CalendarEvent = {
  id?: string
  title: string
  date: string        // ISO yyyy-MM-dd
  startTime?: string  // HH:mm
  endTime?: string    // HH:mm
  category: EventCategory
  notes?: string
  createdAt?: Timestamp
}

const CATEGORY_STYLES: Record<EventCategory, string> = {
  Escolar: 'bg-blue-500 text-white',
  Personal: 'bg-emerald-500 text-white',
  Otros: 'bg-violet-500 text-white',
}

export default function CalendarPage() {
  const [user, setUser] = useState(auth.currentUser)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => setUser(u))
    return () => unsubscribe()
  }, [])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)

  const days = useMemo(() => {
    const weekStart = startOfWeek(monthStart, { locale: es })
    const weekEnd = endOfWeek(monthEnd, { locale: es })
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }, [currentMonth, monthStart, monthEnd])

  // Colección del usuario
  const eventsRef = user ? collection(db, 'users', user.uid, 'events') : null

  useEffect(() => {
    if (!eventsRef) return

    const q = query(
      eventsRef,
      where('date', '>=', format(monthStart, 'yyyy-MM-dd')),
      where('date', '<=', format(monthEnd, 'yyyy-MM-dd')),
      orderBy('date', 'asc')
    )

    const unsub = onSnapshot(q, (snap) => {
      const list: CalendarEvent[] = []
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as CalendarEvent) }))
      setEvents(list)
    })

    return () => unsub()
  }, [eventsRef, monthStart, monthEnd])

  const openCreate = (dateISO?: string) => {
    setEditing(null)
    setSelectedDate(dateISO || null)
    setModalOpen(true)
  }

  const openEdit = (ev: CalendarEvent) => {
    setEditing(ev)
    setSelectedDate(ev.date)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setSelectedDate(null)
  }

  const saveEvent = async (payload: CalendarEvent) => {
    if (!user || !eventsRef) return

    if (editing?.id) {
      await updateDoc(doc(db, 'users', user.uid, 'events', editing.id), { ...payload })
    } else {
      await addDoc(eventsRef, {
        ...payload,
        createdAt: Timestamp.now(),
      })
    }
    closeModal()
  }

  const removeEvent = async (id: string) => {
    if (!user || !eventsRef) return
    await deleteDoc(doc(db, 'users', user.uid, 'events', id))
  }

  const weeks = useMemo(() => {
    const matrix: Date[][] = []
    for (let i = 0; i < days.length; i += 7) {
      matrix.push(days.slice(i, i + 7))
    }
    return matrix
  }, [days])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6">
      {/* Header */}
      <div className="mx-auto max-w-6xl mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700" aria-label="Mes anterior">
            <ChevronLeft />
          </button>
          <h1 className="text-2xl font-bold">{format(currentMonth, "MMMM yyyy", { locale: es })}</h1>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700" aria-label="Mes siguiente">
            <ChevronRight />
          </button>
          <button onClick={() => setCurrentMonth(new Date())} className="ml-4 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold">
            Hoy
          </button>
        </div>

        <button onClick={() => openCreate()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold">
          <Plus size={18} /> Nuevo evento
        </button>
      </div>

      {/* Grid nombres de días */}
      <div className="mx-auto max-w-6xl grid grid-cols-7 text-sm mb-2">
        {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => (
          <div key={d} className="px-3 py-2 font-medium text-gray-600 dark:text-gray-300">{d}</div>
        ))}
      </div>

      {/* Calendario */}
      <div className="mx-auto max-w-6xl grid grid-cols-7 gap-px bg-neutral-800 rounded-xl overflow-hidden">
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            const dateISO = format(day, 'yyyy-MM-dd')
            const dayEvents = events.filter(ev => ev.date === dateISO)
            const out = !isSameMonth(day, currentMonth)
            const today = isToday(day)

            return (
              <div key={`${wi}-${di}`} className={`min-h-[120px] bg-neutral-900 p-2 relative ${out ? 'opacity-30' : ''}`} onDoubleClick={() => openCreate(dateISO)}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${today ? 'text-emerald-400 font-bold' : 'text-neutral-300'}`}>{format(day, 'd', { locale: es })}</span>
                  <button onClick={() => openCreate(dateISO)} className="p-1 rounded bg-neutral-800 hover:bg-neutral-700" title="Añadir evento"><Plus size={14} /></button>
                </div>

                <div className="flex flex-col gap-1">
                  {dayEvents.map(ev => (
                    <div key={ev.id} className={`group ${CATEGORY_STYLES[ev.category]} rounded-md px-2 py-1 text-xs flex items-center justify-between`}>
                      <div className="truncate">
                        <span className="font-semibold">{ev.title}</span>
                        {ev.startTime ? <span className="opacity-90"> · {ev.startTime}{ev.endTime ? `–${ev.endTime}` : ''}</span> : null}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 ml-2">
                        <button onClick={() => openEdit(ev)} className="p-1 rounded hover:bg-white/20" title="Editar"><PencilLine size={14} /></button>
                        {ev.id && (
                          <button onClick={() => removeEvent(ev.id!)} className="p-1 rounded hover:bg-white/20" title="Eliminar"><Trash2 size={14} /></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Botón salir */}
      <div className="fixed bottom-6 left-6">
        <button onClick={() => router.push('/')} className="p-3 rounded-full bg-red-600 hover:bg-red-500 shadow-lg text-white" title="Salir">
          <LogOut size={20} />
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <EventModal
          onClose={closeModal}
          onSave={saveEvent}
          defaultDate={selectedDate || format(new Date(), 'yyyy-MM-dd')}
          editing={editing}
        />
      )}
    </div>
  )
}

/* Modal igual que antes */
function EventModal({ onClose, onSave, defaultDate, editing }: { onClose: () => void, onSave: (e: CalendarEvent) => Promise<void>, defaultDate: string, editing: CalendarEvent | null }) {
  const [form, setForm] = useState<CalendarEvent>(() => ({
    title: editing?.title ?? '',
    date: editing?.date ?? defaultDate,
    startTime: editing?.startTime ?? '',
    endTime: editing?.endTime ?? '',
    category: (editing?.category ?? 'Escolar') as EventCategory,
    notes: editing?.notes ?? '',
  }))

  const canSave = form.title.trim().length > 0 && form.date

  const handleChange = (k: keyof CalendarEvent, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-neutral-950 text-white rounded-2xl shadow-2xl border border-neutral-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <h3 className="text-lg font-semibold">{editing ? 'Editar evento' : 'Nuevo evento'}</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-neutral-800"><X /></button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Título</label>
            <input value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="Ej. Estudiar matemáticas" className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-indigo-600"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-neutral-300 mb-1">Fecha</label>
              <input type="date" value={form.date} onChange={e => handleChange('date', e.target.value)} className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-indigo-600"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Inicio</label>
                <input type="time" value={form.startTime} onChange={e => handleChange('startTime', e.target.value)} className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-indigo-600"/>
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Fin</label>
                <input type="time" value={form.endTime} onChange={e => handleChange('endTime', e.target.value)} className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-indigo-600"/>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-neutral-300 mb-1">Categoría</label>
              <select value={form.category} onChange={e => handleChange('category', e.target.value)} className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-indigo-600">
                <option value="Escolar">Escolar</option>
                <option value="Personal">Personal</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-neutral-300 mb-1">Notas</label>
              <input value={form.notes} onChange={e => handleChange('notes', e.target.value)} placeholder="Detalle opcional" className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-indigo-600"/>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-neutral-800 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700">Cancelar</button>
          <button disabled={!canSave} onClick={() => onSave(form)} className={`px-4 py-2 rounded-lg font-semibold ${canSave ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-neutral-700 cursor-not-allowed'}`}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
