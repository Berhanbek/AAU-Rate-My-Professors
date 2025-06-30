import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AAU Rate My Professors',
  description: 'Rate and review your professors at Addis Ababa University',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
