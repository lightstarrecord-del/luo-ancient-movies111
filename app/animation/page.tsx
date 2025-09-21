import { Navbar } from "@/components/navbar"
import { MovieSection } from "@/components/movie-section"

export default function AnimationPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="px-4 md:px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Animation</h1>

        <div className="space-y-8">
          <MovieSection title="Popular Anime" />
          <MovieSection title="Animated Movies" />
          <MovieSection title="Kids Animation" />
          <MovieSection title="Adult Animation" />
        </div>
      </div>
    </div>
  )
}
