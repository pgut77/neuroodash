import './globals.css'

export const metadata = {
  title: 'NeuroDashboard',
  description: 'Panel interactivo de cuidado mental',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="w-full h-full">
      <body className="bg-[#0e1629] text-white w-full h-full m-0 p-0 overflow-hidden">
        <main className="w-full h-full flex flex-col">
          <section className="w-full h-full overflow-y-auto">
            {children}
          </section>
            <>
      {children}
            </>
        </main>
      </body>
    </html>
  )
}




