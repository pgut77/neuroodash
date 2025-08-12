export default function Topbar() {
  return (
    <header className="w-full px-6 py-4 bg-white border-b shadow-sm flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Bienvenido</h2>
      <div className="text-sm text-gray-500">📅 {new Date().toLocaleDateString()}</div>
    </header>
  )
}
