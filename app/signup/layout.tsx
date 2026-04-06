import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up — Create Your Bike Workshop on 2XG Service',
  description: 'Register your bike workshop on 2XG Service in 2 minutes. Free forever plan available. Get job cards, GST billing, WhatsApp alerts & live tracking for your garage.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
