import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-display' })

export const metadata: Metadata = {
  title: '2XG Service — India\'s #1 Bike Service Management App | Two Wheeler Workshop Software',
  description: 'Trusted by 500+ workshops across India. Track bike service in real-time, send WhatsApp updates, photo proof & digital bills. No more overcharging or hidden repairs. Free forever plan — start in 2 minutes.',
  keywords: 'bike service app India, two wheeler service management, bike repair tracking, workshop management software India, bike mechanic app, two wheeler repair app, bike service near me, garage management system, WhatsApp bike service updates, digital bike service receipt',
  generator: '2XG Service',
  themeColor: '#ffffff',
  openGraph: {
    type: 'website',
    title: '2XG Service — India\'s #1 Bike Service Management App',
    description: 'No more overcharging. No more hidden repairs. Real-time tracking, WhatsApp alerts, photo proof & digital billing. Trusted by 500+ workshops across India. Start free today.',
    images: [
      {
        url: 'https://service.2xg.in/2XGLOGO.jpeg',
      },
    ],
    locale: 'en_IN',
    siteName: '2XG Service',
  },
  twitter: {
    card: 'summary_large_image',
    title: '2XG Service — India\'s #1 Bike Service App',
    description: 'No more overcharging. Real-time tracking, WhatsApp alerts & photo proof for every bike service. Free forever plan.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const originalWarn = console.warn;
              console.warn = function(...args) {
                if (args[0]?.includes?.('container has a non-static position')) {
                  return;
                }
                originalWarn.apply(console, args);
              };
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
