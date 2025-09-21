import { Navbar } from "@/components/navbar"
import { WelcomeBanner } from "@/components/welcome-banner"
import { HeroSection } from "@/components/hero-section"
import { MovieSection } from "@/components/movie-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <WelcomeBanner />
      <HeroSection />

      <div className="px-4 md:px-6 space-y-8 py-8">
        <MovieSection title="Latest" />
        <MovieSection title="Action" />
        <MovieSection title="Indian" />
        <MovieSection title="Nollywood" />
        <MovieSection title="Cartoon" />
        <MovieSection title="War" />
        <MovieSection title="Korean" />
      </div>
    </div>
  )
}
