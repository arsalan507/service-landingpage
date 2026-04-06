import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for 2XG Service — how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 mb-8 inline-block">&larr; Back to home</Link>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: April 6, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
            <p>When you sign up for 2XG Service, we collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account information:</strong> Shop name, owner name, email address, phone number, and city.</li>
              <li><strong>Service data:</strong> Job cards, customer records, billing data, and photos uploaded through the platform.</li>
              <li><strong>Usage data:</strong> Pages visited, features used, and device/browser information via Vercel Analytics.</li>
              <li><strong>Payment information:</strong> Processed securely through Razorpay. We do not store card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and maintain the 2XG Service platform.</li>
              <li>To send transactional updates via WhatsApp and email (job status, OTP verification).</li>
              <li>To improve our product and user experience.</li>
              <li>To process payments and generate GST-compliant invoices.</li>
              <li>To communicate important service updates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Data Storage & Security</h2>
            <p>Your data is stored securely on Supabase (hosted on AWS infrastructure). We use encryption in transit (HTTPS/TLS) and at rest. Access to production data is restricted to authorized team members only.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Supabase:</strong> Database and authentication.</li>
              <li><strong>Razorpay:</strong> Payment processing.</li>
              <li><strong>MSG91:</strong> OTP verification and SMS.</li>
              <li><strong>Vercel:</strong> Hosting and analytics.</li>
              <li><strong>WhatsApp Business API:</strong> Customer notifications.</li>
            </ul>
            <p>Each service has its own privacy policy and data handling practices.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Data Sharing</h2>
            <p>We do not sell, rent, or trade your personal information to third parties. We may share data only when:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Required by law or government authority.</li>
              <li>Necessary to process payments (via Razorpay).</li>
              <li>Needed to send notifications you have opted into (via MSG91/WhatsApp).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Your Rights</h2>
            <p>You may request to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate information.</li>
              <li>Delete your account and associated data.</li>
            </ul>
            <p>Contact us at <a href="mailto:2xg.hello@gmail.com" className="text-primary-600 hover:underline">2xg.hello@gmail.com</a> for any data requests.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Cookies</h2>
            <p>We use essential cookies for authentication and session management. We use Vercel Analytics which collects anonymized usage data without cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">8. Changes to This Policy</h2>
            <p>We may update this policy from time to time. Changes will be posted on this page with an updated date. Continued use of 2XG Service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">9. Contact</h2>
            <p>For privacy-related inquiries:</p>
            <p>Email: <a href="mailto:2xg.hello@gmail.com" className="text-primary-600 hover:underline">2xg.hello@gmail.com</a></p>
            <p>WhatsApp: <a href="https://wa.me/919916516507" className="text-primary-600 hover:underline">+91 99165 16507</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
