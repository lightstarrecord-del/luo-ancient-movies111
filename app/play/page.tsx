"use client"

import { useState } from "react"
import { Play, Pause, Volume2, Settings, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function PlayPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(37)
  const [duration] = useState(6427) // 1:47:07 in seconds
  const [volume, setVolume] = useState([80])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Main Video Player */}
      <div className="flex-1 flex flex-col">
        <div className="relative flex-1 bg-black">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('/dramatic-movie-scene.png')`,
            }}
          />

          {/* Video Controls Overlay */}
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

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>

                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Volume2 className="w-5 h-5" />
                </Button>

                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 text-sm">
                  English
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 text-sm">
                  DualSub
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 text-sm">
                  480P
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Settings className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="bg-gray-900 p-4 flex items-center justify-between">
          <div className="text-gray-300 text-sm">Find any content infringes on your rights, please contact us.</div>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            🚨 Report
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-gray-900 border-l border-gray-800 p-4">
        <div className="mb-4">
          <h3 className="text-white font-semibold mb-2">Resources</h3>
          <div className="text-gray-400 text-sm mb-2">Source: fzmovies.cms</div>
          <div className="text-gray-400 text-sm mb-4">By Shehroz Jutt</div>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white mb-4">The Wrong Paris II</Button>
        </div>

        <div className="text-gray-400 text-sm">
          <h4 className="text-white font-semibold mb-2">Related Movies</h4>
          <div className="space-y-2">
            <div className="p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700">Ancient Warriors</div>
            <div className="p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700">Lost Kingdom</div>
            <div className="p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700">Dragon's Tale</div>
          </div>
        </div>
      </div>
    </div>
  )
}
