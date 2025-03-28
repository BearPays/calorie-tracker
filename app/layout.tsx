import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NutriTrack - Calorie Tracking App",
  description: "Track your meals and calories with AI assistance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Providers>{children}</Providers>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'