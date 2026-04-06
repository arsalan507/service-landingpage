import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for 2XG Service — the rules and guidelines for using our bike workshop management platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 mb-8 inline-block">&larr; Back to home</Link>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: April 6, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p>By accessing or using 2XG Service (&quot;the Platform&quot;), operated by 2XG Growth, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. Service Description</h2>
            <p>2XG Service is a bike workshop management platform that provides:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Job card creation and tracking.</li>
              <li>GST-compliant billing and digital receipts.</li>
              <li>WhatsApp notifications to customers.</li>
              <li>Photo documentation of services.</li>
              <li>Live service tracking for customers.</li>
              <li>Google review collection.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Account Registration</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You must provide accurate and complete information during registration.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>One phone number can be associated with one account only.</li>
              <li>You must be at least 18 years old to create an account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Plans & Pricing</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Starter (Free):</strong> Up to 20 jobs/month, 1 mechanic, basic features.</li>
              <li><strong>Pro (&#8377;499/month):</strong> Unlimited jobs, WhatsApp alerts, Google review collection, and more. First month at &#8377;249.</li>
              <li><strong>Enterprise:</strong> Custom pricing for multi-location chains.</li>
            </ul>
            <p>Prices are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise. We reserve the right to change pricing with 30 days&apos; notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Payments & Refunds</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Payments are processed securely through Razorpay.</li>
              <li>Pro plan subscriptions are billed monthly.</li>
              <li>Refund requests must be made within 7 days of payment.</li>
              <li>Refunds are processed to the original payment method within 5-7 business days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the Platform for any unlawful purpose.</li>
              <li>Upload malicious content, viruses, or harmful code.</li>
              <li>Attempt to gain unauthorized access to other accounts or systems.</li>
              <li>Resell or redistribute the Platform without permission.</li>
              <li>Use automated tools to scrape or extract data from the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Data Ownership</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You retain ownership of all data you upload to the Platform (job cards, photos, customer records).</li>
              <li>We may use anonymized, aggregated data to improve our services.</li>
              <li>Upon account deletion, your data will be permanently removed within 30 days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">8. Service Availability</h2>
            <p>We strive for 99.9% uptime but do not guarantee uninterrupted service. We are not liable for losses caused by downtime, whether scheduled or unscheduled.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, 2XG Growth shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">10. Termination</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You may close your account at any time by contacting support.</li>
              <li>We may suspend or terminate accounts that violate these terms.</li>
              <li>Upon termination, your right to use the Platform ceases immediately.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">11. Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">12. Contact</h2>
            <p>For questions about these terms:</p>
            <p>Email: <a href="mailto:2xg.hello@gmail.com" className="text-primary-600 hover:underline">2xg.hello@gmail.com</a></p>
            <p>WhatsApp: <a href="https://wa.me/919916516507" className="text-primary-600 hover:underline">+91 99165 16507</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
