import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-display' })

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: '2XG Service — Bike Workshop Management Software India | Two Wheeler Garage App',
    template: '%s | 2XG Service',
  },
  description: 'Best garage management software for Indian bike workshops. Job card management, GST billing, WhatsApp updates, photo proof, live tracking & digital receipts. Trusted by 500+ two wheeler service centers across 40+ cities. Free forever plan — start in 2 minutes. Replace your register book today.',
  keywords: [
    // Core product keywords
    'garage management software',
    'workshop management software',
    'bike service management app',
    'two wheeler workshop software',
    'automobile garage software India',
    // Feature keywords
    'job card management software',
    'GST billing software garage',
    'bike service tracking app',
    'WhatsApp bike service updates',
    'digital bike service receipt',
    'photo proof bike service',
    'mechanic job card app',
    // User intent keywords - workshop owners
    'bike workshop app India',
    'two wheeler service center software',
    'bike repair shop software',
    'garage management system India',
    'motorcycle workshop management',
    'bike mechanic app India',
    'auto garage CRM India',
    // User intent keywords - customers
    'bike service near me',
    'two wheeler service near me',
    'bike repair tracking',
    'bike service status check',
    'bike service app',
    // Brand-specific service keywords
    'Hero bike service management',
    'Honda Activa service tracking',
    'Bajaj Pulsar workshop software',
    'Royal Enfield service center app',
    'TVS bike service management',
    'Yamaha service tracking app',
    // Location keywords
    'bike service app Bangalore',
    'two wheeler workshop software Mumbai',
    'garage management Delhi',
    'workshop software Hyderabad',
    'bike service app Chennai',
    'garage app Pune',
    'workshop management Ahmedabad',
    'bike workshop software Jaipur',
    // Long-tail keywords
    'free bike workshop management app',
    'best garage software for small workshops India',
    'bike service customer WhatsApp notification',
    'workshop billing and inventory software',
    'mechanic workload management app',
    'bike service photo proof app',
    'two wheeler repair order management',
    'paperless garage management India',
    'multi-branch workshop software',
    'bike service Google review collection',
  ].join(', '),
  generator: '2XG Service',
  applicationName: '2XG Service',
  referrer: 'origin-when-cross-origin',
  authors: [{ name: '2XG Growth', url: 'https://2xg.in' }],
  creator: '2XG Growth',
  publisher: '2XG Growth',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://getservice.2xg.in'),
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
      'hi-IN': '/',
    },
  },
  openGraph: {
    type: 'website',
    title: '2XG Service — Best Bike Workshop Management Software India',
    description: 'No more overcharging complaints. No more "kab tak ready hoga?" calls. Job card management, GST billing, WhatsApp alerts, photo proof & digital billing. 500+ workshops across India trust 2XG. Free forever plan — start in 2 minutes.',
    images: [
      {
        url: '/2XGLOGO.jpeg',
        width: 512,
        height: 512,
        alt: '2XG Service — Bike Workshop Management App India',
      },
    ],
    locale: 'en_IN',
    siteName: '2XG Service',
    url: 'https://getservice.2xg.in',
  },
  twitter: {
    card: 'summary_large_image',
    title: '2XG Service — Best Bike Workshop Management App India',
    description: 'Job cards, GST billing, WhatsApp updates, photo proof & live tracking for bike workshops. Free forever. 500+ workshops trust 2XG.',
    images: ['/2XGLOGO.jpeg'],
    creator: '@2xgservice',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
  category: 'technology',
}

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: '2XG Service',
      url: 'https://getservice.2xg.in',
      description: 'Best garage management software for Indian bike workshops',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://getservice.2xg.in/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: '2XG Service',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, Android, iOS',
      description: 'Bike workshop management software with job card management, GST billing, WhatsApp updates, photo proof, live service tracking and digital receipts for Indian two-wheeler service centers.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
        description: 'Free forever plan with up to 20 jobs/month. Pro plan starts at ₹499/month.',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '500',
        bestRating: '5',
      },
      featureList: 'Job Card Management, GST Billing, WhatsApp Alerts, Photo Proof, Live Tracking, Digital Receipts, Google Review Collection, Multi-location Support, Mechanic Assignment, Inventory Management',
    },
    {
      '@type': 'Organization',
      name: '2XG Growth',
      url: 'https://2xg.in',
      logo: 'https://getservice.2xg.in/2XGLOGO.jpeg',
      sameAs: [
        'https://instagram.com/2xgservice',
        'https://twitter.com/2xgservice',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@2xg.in',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'IN',
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does 2XG Service work for my bike workshop?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Customers scan a QR code at your counter, your team creates the job in the dashboard with photos, assigns it by workload, and customers receive real-time updates on WhatsApp. Finally, they pay and rate the service — all in one platform.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do my customers need to download an app?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No! 2XG Service is a web app. Customers simply scan the QR code and access everything through their browser. Works on any phone — even budget Android phones.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the free plan really free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Our Starter plan is free forever with up to 20 jobs per month, 2 mechanics, basic tracking, and digital receipts. Pro plan starts at ₹499/month with first month at ₹249.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the best garage management software for bike workshops in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '2XG Service is the best garage management software for Indian bike workshops. It includes job card management, GST billing, WhatsApp alerts, photo proof, live tracking, Google review collection, and digital receipts. Trusted by 500+ workshops across 40+ cities in India.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does bike workshop management software cost in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '2XG Service offers a free forever plan for small workshops. The Pro plan costs ₹499/month (first month ₹249) and includes unlimited jobs, WhatsApp alerts, and Google review collection. Enterprise plans with custom pricing are available for multi-location chains.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
