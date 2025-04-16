"use client"

import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleRegister = () => {
    router.push("/register")
  }

  return <LoginForm onRegister={handleRegister} />
}
