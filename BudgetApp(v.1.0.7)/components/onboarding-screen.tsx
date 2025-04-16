"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface OnboardingScreenProps {
  onComplete: () => void
  onLogin: () => void
}

export function OnboardingScreen({ onComplete, onLogin }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to BudgetPro",
      description: "Your personal finance management solution",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Track Your Expenses",
      description: "Manage multiple accounts and track all your expenses in one place",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Never Miss a Bill",
      description: "Get reminders for upcoming bills and manage payments easily",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Visualize Your Finances",
      description: "See where your money goes with detailed charts and reports",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6 pb-8 px-8 flex flex-col items-center">
            <img
              src={steps[currentStep].image || "/placeholder.svg"}
              alt={steps[currentStep].title}
              className="w-48 h-48 mb-6 object-contain"
            />
            <h1 className="text-2xl font-bold text-center mb-2">{steps[currentStep].title}</h1>
            <p className="text-center text-muted-foreground mb-8">{steps[currentStep].description}</p>

            <div className="flex justify-center gap-1 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep ? "w-8 bg-primary" : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>

            <div className="w-full flex flex-col gap-3">
              <Button onClick={handleNext} className="w-full">
                {currentStep < steps.length - 1 ? "Continue" : "Get Started"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>

              {currentStep === steps.length - 1 && (
                <Button variant="outline" onClick={onLogin} className="w-full">
                  I already have an account
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
