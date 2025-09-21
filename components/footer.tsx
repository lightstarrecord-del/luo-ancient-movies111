import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Image src="/luo-ancient-logo.png" alt="LUO ANCIENT" width={40} height={40} className="mr-3" />
              <span className="text-yellow-400 font-bold text-xl">LUO ANCIENT MOVIES</span>
            </div>
            <p className="text-gray-400 mb-4">
              Experience the magic of ancient stories through our curated collection of movies and TV shows. Discover
              timeless tales that connect cultures and generations.
            </p>
            <p className="text-gray-500 text-sm">Make your tribe proud of you.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-yellow-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-gray-400 hover:text-yellow-400">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tv-shows" className="text-gray-400 hover:text-yellow-400">
                  TV Shows
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-yellow-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-yellow-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-yellow-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-gray-400 hover:text-yellow-400">
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2024 LUO ANCIENT MOVIES. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Find any content infringes on your rights, please contact us.
          </p>
        </div>
      </div>
    </footer>
  )
}
