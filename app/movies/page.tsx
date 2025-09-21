import { Navbar } from "@/components/navbar"
import { MovieSection } from "@/components/movie-section"

export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="px-4 md:px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Movies</h1>

        <div className="space-y-8">
          <MovieSection title="Trending Movies" />
          <MovieSection title="Hollywood Movie" />
          <MovieSection title="Action Movies" />
          <MovieSection title="Comedy Movies" />
          <MovieSection title="Drama Movies" />
        </div>
      </div>
    </div>
  )
}
