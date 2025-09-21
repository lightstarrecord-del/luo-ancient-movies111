"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"

import { useRouter } from "next/navigation"
import { getAuth, signInWithPopup, GoogleAuthProvider, updateProfile, createUserWithEmailAndPassword } from "firebase/auth"
import { app } from "@/lib/firebase"
import { useCallback } from "react"
import { FcGoogle } from "react-icons/fc"
import { toast } from "sonner"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
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
      const result = await signInWithPopup(auth, provider)
      if (result.user) {
        localStorage.setItem("user", JSON.stringify({ email: result.user.email, loggedIn: true }))
        router.push("/")
      }
    } catch (err: any) {
      toast.error(err.message || "Google signup failed")
    }
    setIsLoading(false)
  }, [auth, provider, router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      setIsLoading(false)
      return
    }

    try {
  const auth = getAuth(app)
  // Create user with email and password
  const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
  const user = userCredential.user
      // Generate avatar using DiceBear API
      const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(formData.email)}`
      await updateProfile(user, {
        displayName: formData.name,
        photoURL: avatarUrl,
      })
      // Optionally save to Realtime DB
      // ...
      router.push("/")
    } catch (err: any) {
      toast.error(err.message || "Signup failed")
    }
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-yellow-400">Join LUO ANCIENT</CardTitle>
          <CardDescription className="text-gray-400">Create your account to start watching</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-black/40 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
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
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-black/40 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="bg-black/40 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
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
              {isLoading ? "Please wait..." : "Sign up with Google"}
            </button>
          </div>
          <div className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-yellow-400 hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
