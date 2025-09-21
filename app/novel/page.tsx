import { Navbar } from "@/components/navbar"

export default function NovelPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="px-4 md:px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Novel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-[3/4] bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">Novel Cover</span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">Novel Title {i + 1}</h3>
                <p className="text-gray-400 text-sm">Author Name</p>
                <p className="text-gray-500 text-xs mt-2">Genre • Status</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
