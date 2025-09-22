import { Navbar } from "@/components/navbar"
import { MovieSection } from "@/components/movie-section"
import ALLOWED_CATEGORIES from '@/lib/categories'

const FRIENDLY_LABELS: Record<string, string> = {
  korean: "K-Drama",
  indian: "C-Drama",
  action: "Western Series",
  cartoon: "Anime Series",
  nollywood: "Nollywood",
  war: "War",
}

export default function TVShowsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="px-4 md:px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">TV Shows</h1>

        <div className="space-y-8">
          <MovieSection title="Popular TV Shows" type="series" />
          {ALLOWED_CATEGORIES.map((cat) => (
            <MovieSection key={cat} title={FRIENDLY_LABELS[cat] ?? cat} type="series" categoryKey={cat} />
          ))}
        </div>
      </div>
    </div>
  )
}
