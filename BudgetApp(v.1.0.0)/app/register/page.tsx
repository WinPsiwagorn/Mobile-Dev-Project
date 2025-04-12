"use client"

import { RegisterForm } from "@/components/register-form"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/login")
  }

  return <RegisterForm onLogin={handleLogin} />
}
