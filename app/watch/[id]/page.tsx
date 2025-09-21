"use client"

import { useState } from "react"
import { useSubscriptionAccess } from "@/hooks/use-subscription-access"
import { Play, Pause, Volume2, Settings, Maximize, PictureInPicture } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"


export default function WatchPage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(37)
  const [duration] = useState(6427) // 01:47:07 in seconds
  const [volume, setVolume] = useState(80)

  const { status: subStatus } = useSubscriptionAccess();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Show paywall if not subscribed
  if (subStatus === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">Checking subscription...</div>;
  }
  if (subStatus === 'inactive') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="bg-gray-900 rounded-lg p-8 shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Premium Required</h2>
          <p className="mb-6 text-gray-300">You need an active subscription to watch this content.</p>
          <Link href="/premium">
            <Button className="bg-yellow-400 text-black font-bold px-6 py-2 rounded hover:bg-yellow-500">Go to Premium</Button>
          </Link>
        </div>
      </div>
    );
  }

  // If active, show player as normal
  return (
    <div className="min-h-screen bg-black">
      {/* Video Player */}
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        {/* Video placeholder - in real app this would be a video element */}
        <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <img src="/dramatic-movie-scene.png" alt="Movie scene" className="w-full h-full object-cover" />

          {/* Play/Pause overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              variant="ghost"
              className="w-20 h-20 rounded-full bg-black/50 hover:bg-black/70"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
            </Button>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                className="w-full"
                onValueChange={(value) => setCurrentTime(value[0])}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-yellow-400"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-white" />
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    className="w-20"
                    onValueChange={(value) => setVolume(value[0])}
                  />
                </div>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" className="text-white hover:text-yellow-400">
                  English
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:text-yellow-400">
                  DualSub
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:text-yellow-400">
                  480P
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:text-yellow-400">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:text-yellow-400">
                  <PictureInPicture className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:text-yellow-400">
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="absolute top-0 right-0 w-80 h-full bg-gray-900/95 p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Resources</h3>
            <p className="text-gray-400 text-sm mb-1">Source: luoancientmovies.com</p>
            <p className="text-gray-400 text-sm">By LUO ANCIENT</p>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white mb-6">The Wrong Paris II</Button>

          <div className="space-y-4">
            <h4 className="text-white font-medium">Related Movies</h4>
            {/* Related movies would go here */}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-xs mb-2">Find any content infringes on your rights, please contact us.</p>
            <Button variant="outline" size="sm" className="text-white border-gray-600 bg-transparent">
              🚨 Report
            </Button>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="ghost" className="text-white hover:text-yellow-400">
            ← Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
