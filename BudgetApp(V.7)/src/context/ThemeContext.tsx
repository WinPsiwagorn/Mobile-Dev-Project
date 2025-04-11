"use client"

import React, { createContext, useContext } from 'react';

type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  danger: string;
  warning: string;
  gold: string;
  gradient: string[];
  card: {
    background: string;
    border: string;
    glow: string;
  };
  glass: {
    background: string;
    border: string;
    highlight: string;
  };
};

const colors: ThemeColors = {
  // Core colors
  background: '#0A0A0C',
  surface: '#141417',
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  
  // Brand colors
  primary: '#FFB23F',
  secondary: '#FF8F3F',
  accent: '#FFD700',
  
  // Status colors
  success: '#00C48C',
  danger: '#FF4B4B',
  warning: '#FFB23F',
  gold: '#FFD700',
  
  // Gradients
  gradient: ['#FFB23F', '#FF8F3F'],
  
  // Card styling
  card: {
    background: 'rgba(20, 20, 23, 0.9)',
    border: 'rgba(255, 178, 63, 0.1)',
    glow: 'rgba(255, 178, 63, 0.15)'
  },
  
  // Glass effect
  glass: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    highlight: 'rgba(255, 255, 255, 0.05)'
  }
};

type ThemeContextType = {
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
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
    fontWeight: 'bold',
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
    }
  }
};

