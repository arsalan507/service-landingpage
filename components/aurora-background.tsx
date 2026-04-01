'use client';

import { motion } from 'framer-motion';

export function AuroraBackground() {
  return (
    <>
      {/* Blue blob - top left */}
      <motion.div
        className="fixed -top-1/4 -left-1/4 w-96 h-96 rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, #93c5fd 0%, transparent 70%)',
          filter: 'blur(100px)',
          zIndex: -1,
        }}
        animate={{
          y: [0, 100, 0],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Purple blob - center right */}
      <motion.div
        className="fixed top-1/3 -right-1/4 w-80 h-80 rounded-full opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)',
          filter: 'blur(120px)',
          zIndex: -1,
        }}
        animate={{
          y: [0, -80, 0],
          x: [0, -60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Emerald blob - bottom left */}
      <motion.div
        className="fixed -bottom-1/4 left-1/4 w-72 h-72 rounded-full opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, #6ee7b7 0%, transparent 70%)',
          filter: 'blur(120px)',
          zIndex: -1,
        }}
        animate={{
          y: [0, 60, 0],
          x: [0, -40, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle grid */}
      <div className="fixed inset-0 dot-grid opacity-[0.015] pointer-events-none z-0" />
    </>
  );
}
