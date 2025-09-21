"use client"

import { useState, useEffect } from "react"
import type { User } from "firebase/auth"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsubscribe()
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "TV Shows", href: "/tv-shows" },
    { name: "Movies", href: "/movies" },
    { name: "Advert", href: "/advert" },
    { name: "Premium", href: "/premium" },
  ]

  const isAdmin = user?.email === "lightstarrecord@gmail.com"
  return (
    <>
      <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Image src="/luo-ancient-logo.png" alt="LUO ANCIENT" width={40} height={40} className="mr-3" />
              <Link href="/" className="text-yellow-400 font-bold text-xl">
                LUO ANCIENT MOVIES
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                {user ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin/dashboard" className="ml-4 text-yellow-400 font-bold px-3 py-2 rounded-md text-sm transition-colors border border-yellow-400 hover:bg-yellow-400 hover:text-black">
                        Admin Panel
                      </Link>
                    )}
                    <Link href="/profile" className="ml-4 flex items-center">
                      <img
                        src={user.photoURL || "/placeholder-user.jpg"}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border-2 border-yellow-400 object-cover"
                        onError={e => (e.currentTarget.src = "/placeholder-user.jpg")}
                      />
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ml-4"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search movies/ TV Shows"
                  className="pl-10 bg-black/40 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold">
                📱 Download App
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-80 bg-black/95 backdrop-blur-sm border-r border-gray-800 z-50 md:hidden transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-yellow-400 font-bold text-lg">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-300 hover:text-yellow-400 px-3 py-3 rounded-md text-base font-medium border-b border-gray-800/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search movies/ TV Shows"
                    className="pl-10 bg-black/40 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold">
                  📱 Download App
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
