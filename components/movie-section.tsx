"use client";
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieCard } from "@/components/movie-card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { db } from "@/lib/realtime-db"
import { ref, onValue } from "firebase/database"

interface MovieSectionProps {
  title: string
  type?: "movie" | "series"
}

interface Movie {
  id: string
  title: string
  image: string
  [key: string]: any
}

export function MovieSection({ title, type = "movie" }: MovieSectionProps) {
  const [items, setItems] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const refPath = type === "series" ? "series" : "movies"
    const dbRefObj = ref(db, refPath)
    const unsubscribe = onValue(dbRefObj, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        let list = Object.entries(data).map(([id, value]) => ({ id, ...(value as any) }))
        // Filter for categories
        if (title.toLowerCase() === "latest") {
          // Show movies uploaded in last 7 days
          const now = Date.now()
          list = list.filter((item) => {
            if (!item.createdAt) return false;
            return now - item.createdAt < 7 * 24 * 60 * 60 * 1000;
          })
          // Sort newest first
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        } else {
          // Only show movies with matching category (case-insensitive)
          list = list.filter((item) => (item.category || "").toLowerCase() === title.toLowerCase())
        }
        setItems(list)
      } else {
        setItems([])
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [title, type])

  return (
    <section className="py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Button variant="ghost" className="text-gray-400 hover:text-yellow-400">
          More <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-5">
          {items.map((item) => (
            <Link key={item.id} href={`/play/${item.id}`} className="flex flex-col items-center group">
              <div className="w-[150px] h-[225px] bg-gray-800 rounded overflow-hidden flex items-center justify-center group-hover:shadow-lg transition">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="mt-2 w-full text-center">
                <span className="block text-sm text-white truncate group-hover:text-yellow-400">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
