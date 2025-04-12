import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { FirestoreProvider } from "@/context/firestore-context"
import { AuthGuard } from "@/components/auth-guard"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <FirestoreProvider>
              <AuthGuard>{children}</AuthGuard>
            </FirestoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
