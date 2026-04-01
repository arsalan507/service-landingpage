'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'FEATURES', href: '#features' },
    { label: 'HOW IT WORKS', href: '#how-it-works' },
    { label: 'REVIEWS', href: '#testimonials' },
    { label: 'PRICING', href: '#pricing' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'glass-strong' : 'transparent'
      }`}
      initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
      animate={{
        backgroundColor: isScrolled
          ? 'rgba(255, 255, 255, 0.85)'
          : 'rgba(0, 0, 0, 0)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-gray-100/50 p-1">
              <Image
                src="/2XGLOGO.jpeg"
                alt="2XG Logo"
                width={40}
                height={40}
                className="w-full h-full rounded-md object-contain"
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-gray-900 text-base sm:text-lg">
                2XG
              </span>
              <span className="text-primary-600 text-xs sm:text-sm font-semibold">
                Service
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs lg:text-sm tracking-widest uppercase text-gray-800 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="https://service.2xg.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-6 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg hover:shadow-primary-500/50 transition-shadow"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-800 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-300 bg-white/80 backdrop-blur"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm tracking-widest uppercase text-gray-800 hover:text-primary-600 transition-colors rounded hover:bg-gray-100"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="https://service.2xg.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-2 mt-4 text-center rounded-full text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg hover:shadow-primary-500/50 transition-shadow"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
