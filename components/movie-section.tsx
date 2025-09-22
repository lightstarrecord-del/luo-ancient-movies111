"use client";
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieCard } from "@/components/movie-card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { db } from "@/lib/realtime-db"
import ALLOWED_CATEGORIES from "@/lib/categories"
import { ref, onValue } from "firebase/database"

interface MovieSectionProps {
  title: string
  type?: "movie" | "series"
  categoryKey?: string
}

interface Movie {
  id: string
  title: string
  image: string
  [key: string]: any
}

export function MovieSection({ title, type = "movie", categoryKey }: MovieSectionProps) {
  const [items, setItems] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const refPath = type === "series" ? "series" : "movies"
    const dbRefObj = ref(db, refPath)
    const unsubscribe = onValue(dbRefObj, (snapshot) => {
      const data = snapshot.val()
      if (!data) {
        setItems([])
        setLoading(false)
        return
      }

      let list = Object.entries(data).map(([id, value]) => ({ id, ...(value as any) }))

      // Determine the filter key: prefer explicit categoryKey, otherwise derive from title.
      // Try to match any admin-defined category substring first (handles messy titles like 'the institudeWar').
      const raw = (categoryKey ?? title).toString().trim()
      const lower = raw.toLowerCase()

      // Treat 'trending' or 'popular' as the 'latest' special case
      if (lower.includes("trending") || lower.includes("popular") || lower === "latest") {
        const now = Date.now()
        list = list.filter((item) => {
          if (!item.createdAt) return false
          return now - item.createdAt < 7 * 24 * 60 * 60 * 1000
        })
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      } else {
        // Prefer an allowed admin category if it appears in the title
        const matchedAllowed = ALLOWED_CATEGORIES.find((cat) => lower.includes(cat))
        let key = matchedAllowed ?? ""

        if (!key) {
          // Strip common suffixes like ' movies', ' movie', ' series' and non-letter characters
          key = lower.replace(/\bmovies\b|\bmovie\b|\bseries\b/gi, "").replace(/[^a-z\s-]/gi, "").trim()
        }

        // If still empty, fall back to using the raw lower title
        if (!key) key = lower

        list = list.filter((item) => ((item.category || "") as string).toLowerCase() === key)
      }

      setItems(list)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [title, type, categoryKey])

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
            <div key={item.id} className="flex flex-col items-center group">
              <MovieCard id={item.id} title={item.title} image={item.image} category={item.category} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
