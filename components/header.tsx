import { Search, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="text-white font-semibold text-lg">Welcome to LUO ANCIENT MOVIES</div>
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          🌐 ENGLISH ▼
        </Button>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search movies/ TV Shows"
            className="pl-10 bg-black/40 border-gray-600 text-white placeholder-gray-400 backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">📱 Download App</Button>
        <Button variant="ghost" className="text-gray-300 hover:text-white">
          <Clock className="w-4 h-4 mr-2" />
          Watch history
        </Button>
      </div>
    </header>
  )
}
