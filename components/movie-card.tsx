import { Play } from "lucide-react"

import { useRouter } from "next/navigation"

interface MovieCardProps {
  title: string
  image: string
  id?: string
}

export function MovieCard({ title, image, id }: MovieCardProps) {
  const router = useRouter();
  return (
    <div className="group cursor-pointer" onClick={() => id && router.push(`/play/${id}`)}>
      <div className="relative overflow-hidden rounded-lg mb-2 sm:mb-3">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-32 xs:h-36 sm:h-48 md:h-60 lg:h-72 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
          <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <h3 className="text-white font-medium text-xs sm:text-sm line-clamp-2">{title}</h3>
    </div>
  )
}
