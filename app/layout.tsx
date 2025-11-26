import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from "@vercel/analytics/next"


const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-sans',
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'SaaSReaper',
  description: 'Track your SaaS subscriptions and get reminded before they auto-renew. Because screw surprise charges.',
  icons: {
    icon: [
      {
        url: '/icon.svg?v=2',
        type: 'image/svg+xml',
      },
      {
        url: '/icon-light-32x32.png?v=2',
        media: '(prefers-color-scheme: light)',
        sizes: '32x32',
      },
      {
        url: '/icon-dark-32x32.png?v=2',
        media: '(prefers-color-scheme: dark)',
        sizes: '32x32',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png?v=2',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: '/icon.svg?v=2',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
