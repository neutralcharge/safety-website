"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { gsap } from "gsap"
import { AuthForm } from "../../components/auth/auth-form"

export default function AuthPage() {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Background animations
    const circles = Array.from(document.querySelectorAll('.animated-circle'))
    
    gsap.set(circles, {
      x: () => gsap.utils.random(-20, 20),
      y: () => gsap.utils.random(-20, 20),
      opacity: () => gsap.utils.random(0.1, 0.3),
      scale: () => gsap.utils.random(0.8, 1.2),
    })
    
    gsap.to(circles, {
      x: () => gsap.utils.random(-50, 50),
      y: () => gsap.utils.random(-50, 50),
      opacity: () => gsap.utils.random(0.1, 0.4),
      scale: () => gsap.utils.random(0.7, 1.3),
      duration: 10,
      ease: "sine.inOut",
      stagger: 0.1,
      repeat: -1,
      yoyo: true,
    })

    // Content animation
    gsap.from(contentRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })

    return () => {
      // Cleanup animations
      gsap.killTweensOf(circles)
    }
  }, [])

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-white p-4">
      {/* Animated background */}
      <div ref={backgroundRef} className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animated-circle absolute rounded-full bg-primary"
            style={{
              width: `${gsap.utils.random(100, 300)}px`,
              height: `${gsap.utils.random(100, 300)}px`,
              left: `${gsap.utils.random(0, 100)}%`,
              top: `${gsap.utils.random(0, 100)}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div 
        ref={contentRef} 
        className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center gap-8 rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-md md:flex-row md:p-12"
      >
        {/* Left side - Brand info */}
        <div className="flex flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
          <div className="mb-6 flex items-center">
            <div className="mr-2 rounded-full bg-primary p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-alert">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-primary">SafetySpot</h1>
          </div>
          
          <h2 className="mb-4 text-3xl font-bold">Welcome to SafetySpot</h2>
          <p className="mb-6 text-gray-600">
            Join our community of citizens making neighborhoods safer. Report hazards, track resolutions, and contribute to public safety.
          </p>
          
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <div className="text-2xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-gray-600">Hazards Reported</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <div className="text-2xl font-bold text-primary">85%</div>
              <div className="text-sm text-gray-600">Resolution Rate</div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <Link href="/" className="text-sm text-primary hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
        
        {/* Right side - Auth form */}
        <div className="w-full md:w-1/2">
          <AuthForm />
        </div>
        
        <div className="mt-6 block md:hidden">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
