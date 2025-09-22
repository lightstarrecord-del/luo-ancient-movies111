import { Play } from "lucide-react"
import ALLOWED_CATEGORIES, { ALLOWED_CATEGORIES as ALLOWED_CATEGORIES_NAMED } from '@/lib/categories'

import { useRouter } from "next/navigation"

interface MovieCardProps {
  title: string
  image: string
  id?: string
  category?: string
}

export function MovieCard({ title, image, id, category }: MovieCardProps) {
  const router = useRouter();
  const lc = (category || "").toLowerCase()
  const showCategory = !!category && ALLOWED_CATEGORIES.includes(lc)
  const label = showCategory ? (lc.charAt(0).toUpperCase() + lc.slice(1)) : null

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
        {showCategory && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">{label}</span>
        )}
      </div>
      <h3 className="text-white font-medium text-xs sm:text-sm line-clamp-2">{title}</h3>
    </div>
  )
}
