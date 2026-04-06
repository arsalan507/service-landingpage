'use client';

import { Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        {/* Mobile: compact layout | Desktop: grid */}
        <div className="sm:hidden space-y-5 mb-5">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-white/10 p-0.5">
                <Image src="/2XGLOGO.jpeg" alt="2XG Logo" width={28} height={28} loading="lazy" className="w-full h-full rounded object-contain" />
              </div>
              <span className="font-display font-bold text-white text-sm">2XG Service</span>
            </Link>
            <div className="flex gap-2">
              {[Instagram, Twitter, Linkedin, Youtube].map((Icon, idx) => (
                <Link key={idx} href="#" className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-gray-500 hover:text-white border border-white/10">
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links in 3 columns */}
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <h3 className="font-semibold text-white uppercase tracking-wider mb-2">Product</h3>
              {['Features', 'Pricing', 'How it Works', 'Reviews', 'FAQ'].map((l) => (
                <Link key={l} href={`#${l.toLowerCase().replace(/\s/g, '-')}`} className="block text-gray-500 hover:text-white py-0.5">{l}</Link>
              ))}
            </div>
            <div>
              <h3 className="font-semibold text-white uppercase tracking-wider mb-2">Support</h3>
              <Link href="mailto:2xg.hello@gmail.com" className="block text-gray-500 hover:text-white py-0.5">Contact Us</Link>
              <Link href="mailto:2xg.hello@gmail.com" className="block text-gray-500 hover:text-white py-0.5">Help Center</Link>
            </div>
            <div>
              <h3 className="font-semibold text-white uppercase tracking-wider mb-2">Legal</h3>
              <Link href="/privacy" className="block text-gray-500 hover:text-white py-0.5">Privacy</Link>
              <Link href="/terms" className="block text-gray-500 hover:text-white py-0.5">Terms</Link>
              <Link href="/terms" className="block text-gray-500 hover:text-white py-0.5">Refunds</Link>
            </div>
          </div>
        </div>

        {/* Desktop: full grid */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-12">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 p-0.5">
                <Image src="/2XGLOGO.jpeg" alt="2XG Logo" width={32} height={32} loading="lazy" className="w-full h-full rounded-md object-contain" />
              </div>
              <span className="font-display font-bold text-white">2XG Service</span>
            </Link>
            <p className="text-gray-400 text-sm mb-3">India&apos;s smartest bike service management platform. Trusted by 500+ workshops in 40+ cities.</p>
            <div className="flex gap-2">
              {[Instagram, Twitter, Linkedin, Youtube].map((Icon, idx) => (
                <Link key={idx} href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10">
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-3">Product</h3>
            <ul className="space-y-2">
              {[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'How it Works', href: '#how-it-works' }, { label: 'Reviews', href: '#testimonials' }, { label: 'FAQ', href: '#faq' }].map((link) => (
                <li key={link.label}><Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link href="mailto:2xg.hello@gmail.com" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
              <li><Link href="mailto:2xg.hello@gmail.com" className="text-gray-400 hover:text-white text-sm transition-colors">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-4 sm:pt-6 flex items-center justify-between text-gray-500 text-[11px] sm:text-sm">
          <p>© {currentYear} 2XG Growth</p>
          <p>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
