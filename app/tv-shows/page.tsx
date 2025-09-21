import { Navbar } from "@/components/navbar"
import { MovieSection } from "@/components/movie-section"

export default function TVShowsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="px-4 md:px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">TV Shows</h1>

        <div className="space-y-8">
          <MovieSection title="Popular TV Shows" type="series" />
          <MovieSection title="K-Drama" type="series" />
          <MovieSection title="C-Drama" type="series" />
          <MovieSection title="Western Series" type="series" />
          <MovieSection title="Anime Series" type="series" />
        </div>
      </div>
    </div>
  )
}
