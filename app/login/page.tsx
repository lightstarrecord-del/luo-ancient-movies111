"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"

import { useRouter } from "next/navigation"
import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider, updateProfile } from "firebase/auth"
import { app } from "@/lib/firebase"
import { useCallback } from "react"
import { FcGoogle } from "react-icons/fc"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()

  // Keep user logged in and redirect if already authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/")
      }
    })
    return () => unsubscribe()
  }, [auth, router])

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true)
    try {
      // try popup first; if that fails (popup blocked / mobile), fallback to redirect
      let result: any = null
      try {
        result = await signInWithPopup(auth, provider)
      } catch (popupErr: any) {
        // If popup failed due to environment or was blocked, fallback to redirect
        console.warn('signInWithPopup failed, falling back to redirect', popupErr)
        try {
          await signInWithRedirect(auth, provider)
          // signInWithRedirect will navigate away; return early
          return
        } catch (redirectErr: any) {
          console.error('signInWithRedirect also failed', redirectErr)
          throw redirectErr
        }
      }
      if (result.user) {
        // If user has no avatar, set a generated one
        if (!result.user.photoURL) {
          const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(result.user.email || "user")}`
          await updateProfile(result.user, { photoURL: avatarUrl })
        }
        router.push("/")
      }
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        toast.error("Google login popup was closed.")
      } else if (err.code === "auth/cancelled-popup-request") {
        toast.error("Google login popup was cancelled.")
      } else {
        toast.error(err.message || "Google login failed")
      }
    }
    setIsLoading(false)
  }, [auth, provider, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        // Store user session (in real app, use proper auth)
        localStorage.setItem("user", JSON.stringify({ email, loggedIn: true }))
        router.push("/")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-yellow-400">Login to LUO ANCIENT</CardTitle>
          <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/40 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="my-4 flex items-center justify-center">
            <button
              type="button"
              onClick={e => { e.preventDefault(); handleGoogleLogin(); }}
              className="flex items-center justify-center w-full bg-white text-black py-2 rounded shadow hover:bg-gray-200 font-semibold"
              disabled={isLoading}
            >
              <FcGoogle className="mr-2 text-xl" />
              {isLoading ? "Please wait..." : "Login with Google"}
            </button>
          </div>
          <div className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-yellow-400 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
