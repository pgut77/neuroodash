'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, googleProvider, db } from '../lib/firebase'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  // 🔹 Redirigir si ya está logueado
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/')
    })
    return () => unsub()
  }, [router])

  // 🔹 Función para crear documento del usuario en Firestore
  const crearDocumentoUsuario = async (user: any) => {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        email: user.email,
        displayName: user.displayName || '',
        createdAt: new Date(),
      },
      { merge: true } // merge evita sobreescribir si ya existe
    )
  }

  // 🔹 Iniciar sesión / Registro con correo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let userCredential
      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await crearDocumentoUsuario(userCredential.user)
        alert('Cuenta creada correctamente')
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password)
        await crearDocumentoUsuario(userCredential.user)
      }
      router.push('/')
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  // 🔹 Login con Google
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider)
      await crearDocumentoUsuario(userCredential.user)
      router.push('/')
    } catch (error) {
      alert('Error al iniciar con Google')
    }
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div
        className="rounded-2xl shadow-lg w-80 sm:w-96 p-6"
        style={{ backgroundColor: '#fff8e7', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all"
          >
            {isRegister ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <div className="flex flex-col items-center mt-4">
          <button
            onClick={handleGoogleLogin}
            className="bg-red-500 text-white p-2 rounded-md w-full hover:bg-red-600 transition-all"
          >
            Iniciar con Google
          </button>

          <p
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-blue-500 text-center mt-4 cursor-pointer hover:underline"
          >
            {isRegister
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </p>
        </div>
      </div>
    </div>
  )
}
