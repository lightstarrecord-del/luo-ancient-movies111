"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Plus, Share, Star, Calendar, Clock, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function MoviePage({ params }: { params: { id: string } }) {
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false)

  // Mock movie data - in real app, fetch based on params.id
  const movie = {
    id: params.id,
    title: "The Ancient Warrior",
    year: "2023",
    duration: "2h 15m",
    rating: "8.5",
    genre: ["Action", "Adventure", "Historical"],
    description:
      "In ancient times, a legendary warrior must unite the scattered tribes to defend against an invading empire. An epic tale of courage, honor, and sacrifice that spans across mystical lands filled with ancient magic and forgotten secrets.",
    cast: ["Zhang Wei", "Li Ming", "Wang Fei", "Chen Lu"],
    director: "Liu Zhang",
    poster: "/peacemaker-superhero-movie-poster.jpg",
    backdrop: "/dramatic-movie-scene.png",
    trailer: "sample-trailer.mp4",
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image src={movie.backdrop || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="flex-shrink-0">
                <Image
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  width={300}
                  height={450}
                  className="rounded-lg shadow-2xl"
                />
              </div>

              <div className="flex-1 space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold">{movie.title}</h1>

                <div className="flex items-center gap-4 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span>{movie.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-5 h-5" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{movie.duration}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {movie.genre.map((g) => (
                    <span key={g} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                      {g}
                    </span>
                  ))}
                </div>

                <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">{movie.description}</p>

                <div className="flex gap-4 pt-4">
                  <Link href={`/watch/${movie.id}`}>
                    <Button className="bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold px-8 py-3 text-lg">
                      <Play className="w-5 h-5 mr-2" />
                      Watch Now
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800 px-6 py-3 bg-transparent"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    My List
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800 px-6 py-3 bg-transparent"
                  >
                    <Share className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Trailer Section */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  {!isTrailerPlaying ? (
                    <Button
                      onClick={() => setIsTrailerPlaying(true)}
                      className="bg-gradient-to-r from-yellow-400 to-red-500 text-black font-semibold px-8 py-4"
                    >
                      <Play className="w-6 h-6 mr-2" />
                      Play Trailer
                    </Button>
                  ) : (
                    <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">Trailer would play here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Synopsis */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.description} The story unfolds across breathtaking landscapes, from ancient temples to mystical
                  forests, as our hero discovers the true meaning of leadership and the power of unity in the face of
                  overwhelming odds.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Movie Info</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Director:</span>
                    <p className="text-white">{movie.director}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Cast:</span>
                    <p className="text-white">{movie.cast.join(", ")}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Genre:</span>
                    <p className="text-white">{movie.genre.join(", ")}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Release Year:</span>
                    <p className="text-white">{movie.year}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <p className="text-white">{movie.duration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Ratings & Reviews</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold">{movie.rating}</span>
                  <span className="text-gray-400">/10</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>Based on 15,420 reviews</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
