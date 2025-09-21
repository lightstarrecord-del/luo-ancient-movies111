"use client";
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { db } from "@/lib/realtime-db"
import { ref, onValue } from "firebase/database"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [slides, setSlides] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const slidesRef = ref(db, "slideImages")
    const unsub = onValue(slidesRef, (snap) => {
      const data = snap.val()
      if (data) setSlides(Object.entries(data).map(([id, v]) => ({ id, ...(v as any) })))
      else setSlides([])
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides])

  const slide = slides[current] || { image: "/placeholder.svg", title: "", link: "" }

  return (
    <div className="relative h-[250px] md:h-[300px] bg-gradient-to-r from-black via-transparent to-black">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${slide.image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

      <div className="relative h-full flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
          onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="px-6 md:px-12 max-w-lg">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-3">{slide.title}</h2>
          <div className="flex items-center gap-4 text-gray-300 mb-3 text-xs md:text-sm">
            {slide.link && <span className="underline cursor-pointer" onClick={() => router.push(slide.link)}>Go to Link</span>}
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => slide.link && router.push(slide.link)}>
            <Play className="w-4 h-4 mr-2" />
            Watch Now
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
          onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${i === current ? "bg-white" : "bg-white/30"}`} />
        ))}
      </div>
    </div>
  )
}
