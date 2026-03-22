import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AppProviders } from "@/components/providers/app-providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Deepdify Studio",
  description: "AI驱动的跨境电商工作台",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
