"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { Shield, Lock, Mail, User, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Initial animation for the page
    const tl = gsap.timeline()

    tl.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
    })

    tl.from(
      ".animate-item",
      {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4",
    )

    // Animated background
    gsap.to(".bg-pattern", {
      backgroundPosition: "100% 100%",
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "none",
    })

    // Floating particles animation
    const particles = document.querySelectorAll(".particle")
    particles.forEach((particle) => {
      gsap.to(particle, {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: "random(0, 2)",
      })
    })

    return () => {
      tl.kill()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }

    setIsSubmitting(true)

    // Animate the form on submit
    gsap.to(formRef.current, {
      scale: 0.98,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    })

    // Simulate API call
    try {
      // Replace with actual registration logic
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Success animation
      setIsSuccess(true)

      const tl = gsap.timeline()

      tl.to(formRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power3.out",
      })

      tl.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" },
      )

      // Confetti effect
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement("div")
        particle.className = "absolute w-2 h-2 rounded-full bg-green-500"
        particle.style.top = "50%"
        particle.style.left = "50%"
        particle.style.zIndex = "20"
        containerRef.current?.appendChild(particle)

        gsap.to(particle, {
          x: `random(-200, 200)`,
          y: `random(-200, 200)`,
          opacity: 0,
          scale: "random(0.5, 2)",
          duration: "random(1, 2)",
          ease: "power3.out",
          onComplete: () => {
            particle.remove()
          },
        })
      }

      // Redirect after success animation
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (error) {
      console.error("Signup failed", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden"
      ref={containerRef}
    >
      {/* Animated background pattern */}
      <div
        className="bg-pattern absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      <div className="particle absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-green-200 opacity-20"></div>
      <div className="particle absolute top-3/4 left-1/3 w-16 h-16 rounded-full bg-green-300 opacity-20"></div>
      <div className="particle absolute top-1/2 left-3/4 w-20 h-20 rounded-full bg-green-100 opacity-20"></div>
      <div className="particle absolute top-1/3 left-2/3 w-10 h-10 rounded-full bg-green-400 opacity-10"></div>
      <div className="particle absolute top-2/3 left-1/5 w-14 h-14 rounded-full bg-green-200 opacity-15"></div>

      <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center z-10">
        <div className="w-full max-w-md">
          {!isSuccess ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8 animate-item">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
                  <p className="text-gray-600 mt-2">Join SafetySpot to help make your community safer</p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2 animate-item">
                    <Label htmlFor="name" className="text-gray-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 bg-gray-50 border-gray-200 focus:ring-green-500 focus:border-green-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 animate-item">
                    <Label htmlFor="email" className="text-gray-700">
                      Email
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 bg-gray-50 border-gray-200 focus:ring-green-500 focus:border-green-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 animate-item">
                    <Label htmlFor="password" className="text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-gray-50 border-gray-200 focus:ring-green-500 focus:border-green-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 animate-item">
                    <Label htmlFor="confirmPassword" className="text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-gray-50 border-gray-200 focus:ring-green-500 focus:border-green-500"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Link href="/">
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-all animate-item"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                    </Link>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600 animate-item z-10">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-800 hover:underline">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div ref={successRef} className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
              <p className="text-gray-600 mb-6">
                Your account has been successfully created. You can now sign in to SafetySpot.
              </p>
              <Button
                onClick={() => router.push("/auth/login")}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition-all"
              >
                Go to Login
              </Button>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-500 animate-item">
            <p>
              By creating an account, you agree to our{" "}
              <a href="#" className="text-green-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-green-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

