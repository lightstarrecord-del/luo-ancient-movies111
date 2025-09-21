import { Navbar } from "@/components/navbar"

export default function SportLivePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="px-4 md:px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Sport Live</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6">
              <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-red-500 font-bold">LIVE</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Live Sports Event {i + 1}</h3>
              <p className="text-gray-400 text-sm">Currently streaming live sports content</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
