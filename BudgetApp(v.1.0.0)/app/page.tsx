"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Wallet, CreditCard, Receipt, PieChart, User } from "lucide-react"
import { DashboardView } from "@/components/dashboard-view"
import { AccountsView } from "@/components/accounts-view"
import { BillsView } from "@/components/bills-view"
import { TransactionsView } from "@/components/transactions-view"
import { ReportsView } from "@/components/reports-view"
import { ProfileView } from "@/components/profile-view"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, loading } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  // Check if the user has seen onboarding before
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
    if (hasSeenOnboarding) {
      setShowOnboarding(false)
    }
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true")
    setShowOnboarding(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} onLogin={() => setShowLogin(true)} />
  }

  if (!user) {
    return showLogin ? (
      <LoginForm onRegister={() => setShowLogin(false)} />
    ) : (
      <RegisterForm onLogin={() => setShowLogin(true)} />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsContent value="dashboard">
            <DashboardView />
          </TabsContent>
          <TabsContent value="accounts">
            <AccountsView />
          </TabsContent>
          <TabsContent value="bills">
            <BillsView />
          </TabsContent>
          <TabsContent value="transactions">
            <TransactionsView />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsView />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileView />
          </TabsContent>

          <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
            <TabsList className="w-full h-16 grid grid-cols-6">
              <TabsTrigger
                value="dashboard"
                className="flex flex-col items-center justify-center data-[state=active]:text-primary"
              >
                <Wallet className="h-5 w-5" />
                <span className="text-xs mt-1">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="accounts"
                className="flex flex-col items-center justify-center data-[state=active]:text-primary"
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs mt-1">Accounts</span>
              </TabsTrigger>
              <TabsTrigger
                value="bills"
                className="flex flex-col items-center justify-center data-[state=active]:text-primary"
              >
                <Receipt className="h-5 w-5" />
                <span className="text-xs mt-1">Bills</span>
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="flex flex-col items-center justify-center data-[state=active]:text-primary"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="text-xs mt-1">Add</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex flex-col items-center justify-center data-[state=active]:text-primary"
              >
                <PieChart className="h-5 w-5" />
                <span className="text-xs mt-1">Reports</span>
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="flex flex-col items-center justify-center data-[state=active]:text-primary"
              >
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">Profile</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
