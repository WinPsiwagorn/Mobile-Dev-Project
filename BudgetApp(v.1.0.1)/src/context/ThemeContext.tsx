"use client"

import type React from "react"
import { createContext, useContext } from "react"

type ThemeColors = {
  background: string
  surface: string
  text: string
  textSecondary: string
  primary: string
  secondary: string
  accent: string
  success: string
  danger: string
  warning: string
  gold: string
  goldLight: string
  border: string
  gradient: string[]
  card: {
    background: string
    border: string
    glow: string
  }
  glass: {
    background: string
    border: string
    highlight: string
  }
  accountTypes: {
    general: {
      primary: string
      gradient: string[]
    }
    savings: {
      primary: string
      gradient: string[]
    }
  }
}

const colors: ThemeColors = {
  // Core colors
  background: "#0A0A0C",
  surface: "#141417",
  text: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.8)",

  // Brand colors
  primary: "#FF9F1C",
  secondary: "#FF6B35",
  accent: "#FFD700",

  // Status colors
  success: "#4CAF50",
  danger: "#F44336",
  warning: "#FFC107",
  gold: "#FFD700",
  goldLight: "#FFE566",

  // Gradients
  gradient: ["#FF9F1C", "#FF6B35"],

  // Card styling
  card: {
    background: "rgba(20, 20, 23, 0.95)",
    border: "rgba(255, 159, 28, 0.2)",
    glow: "rgba(255, 159, 28, 0.25)",
  },

  // Glass effect
  glass: {
    background: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.15)",
    highlight: "rgba(255, 255, 255, 0.08)",
  },

  // Additional colors for account types
  accountTypes: {
    general: {
      primary: "#FF9F1C",
      gradient: ["#FF9F1C", "#FF6B35"]
    },
    savings: {
      primary: "#4CAF50",
      gradient: ["#4CAF50", "#2E7D32"]
    }
  }
}

type ThemeContextType = {
  colors: ThemeColors
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{ colors }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Shared styles that can be used across components
export const globalStyles = {
  // Card styles
  card: {
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: 20,
    shadowColor: colors.card.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
  },

  // Glass effect
  glass: {
    backgroundColor: colors.glass.background,
    borderWidth: 1,
    borderColor: colors.glass.border,
    borderRadius: 20,
    shadowColor: colors.glass.highlight,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  // Text styles
  heading: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
  },

  subheading: {
    color: colors.textSecondary,
    fontSize: 16,
  },

  // Button styles
  button: {
    primary: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    glass: {
      backgroundColor: colors.glass.background,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.glass.border,
    },
  },
}
