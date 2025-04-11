import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/app/components/auth/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trade With Us',
  description: 'Global Trade Exchange Marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          <main className="max-w-[600px] mx-auto bg-white min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}