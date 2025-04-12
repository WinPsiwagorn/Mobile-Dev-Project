"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

const publicPaths = ["/login", "/register", "/forgot-password"]

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      // If not authenticated and trying to access a protected route
      if (!user && !publicPaths.includes(pathname)) {
        router.push("/login")
      }

      // If authenticated and trying to access auth pages
      if (user && publicPaths.includes(pathname)) {
        router.push("/")
      }
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // For public routes or authenticated users on protected routes
  return <>{children}</>
}
