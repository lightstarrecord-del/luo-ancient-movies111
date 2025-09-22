import {
  Home,
  Tv,
  Film,
  Palette,
  Radio,
  BookOpen,
  X,
  TicketIcon as TikTok,
  Facebook,
  MessageCircle,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Tv, label: "TV show" },
  { icon: Film, label: "Movie" },
  { icon: Palette, label: "Animation" },
  { icon: Radio, label: "Sport Live" },
  { icon: BookOpen, label: "Novel 🔥" },
]

const socialIcons = [
  { icon: X, href: "#" },
  { icon: TikTok, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: MessageCircle, href: "#" },
  { icon: Send, href: "#" },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-black border-r border-gray-800 h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src="/luo-ancient-logo.png" alt="LUO ANCIENT MOVIES" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-bold text-white">LUO ANCIENT</span>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 text-left ${
                item.active
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="flex gap-2 mb-4">
          {socialIcons.map((social, index) => (
            <Button key={index} variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400 hover:text-white">
              <social.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>contact@luoancientmovies.ng</p>
          <div className="flex gap-2">
            <span>Privacy Policy</span>
            <span>User Agreement</span>
          </div>
        </div>

        <a href="https://docs.google.com/uc?export=download&id=11_f6m5eNcJieLRmdZ6tuTk6m7aAyJneh" target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
            📱 Download App
          </Button>
        </a>
      </div>
    </div>
  )
}
