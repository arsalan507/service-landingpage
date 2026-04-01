'use client';

import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-300 bg-gray-50/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="col-span-2 md:col-span-1"
          >
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 p-1">
                <Image
                  src="/2XGLOGO.jpeg"
                  alt="2XG Logo"
                  width={32}
                  height={32}
                  className="w-full h-full rounded-md object-contain"
                />
              </div>
              <span className="font-display font-bold text-gray-900">2XG Service</span>
            </Link>
            <p className="text-gray-700 text-sm mb-4">
              India's smartest bike service management platform. Trusted by 500+ workshops in 40+ cities.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Twitter, href: 'https://twitter.com' },
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Youtube, href: 'https://youtube.com' },
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:text-gray-900 hover:border-gray-300 transition-colors border border-gray-300"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-widest mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'How it Works', href: '#how-it-works' },
                { label: 'Reviews', href: '#testimonials' },
                { label: 'FAQ', href: '#faq' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-gray-900 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-widest mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Contact Us', href: 'mailto:hello@2xg.in' },
                { label: 'Help Center', href: 'mailto:hello@2xg.in' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-gray-900 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-widest mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms', href: '/' },
                { label: 'Refund Policy', href: '/' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-gray-900 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 pt-8 sm:pt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-700 text-xs sm:text-sm text-center sm:text-left">
            © {currentYear} 2XG Growth. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs sm:text-sm">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
