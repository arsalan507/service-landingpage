'use client';

export function AuroraBackground() {
  return (
    <>
      {/* Static subtle color blobs — no animation, no blur filter */}
      <div
        className="fixed -top-1/4 -left-1/4 w-96 h-96 rounded-full opacity-[0.04] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #93c5fd 0%, transparent 70%)',
          zIndex: -1,
        }}
      />
      <div
        className="fixed top-1/3 -right-1/4 w-80 h-80 rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)',
          zIndex: -1,
        }}
      />
      <div
        className="fixed -bottom-1/4 left-1/4 w-72 h-72 rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #6ee7b7 0%, transparent 70%)',
          zIndex: -1,
        }}
      />
    </>
  );
}
