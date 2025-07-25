import React from 'react';

export function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className="relative w-full flex items-center gap-3 h-[36px] px-8 rounded-b-[22px]"
        style={{
          background: 'rgba(255,255,255,0.22)',
          backdropFilter: 'blur(19px)',
          WebkitBackdropFilter: 'blur(19px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1), inset 0 0 52px 26px rgba(255,255,255,0.26)'
        }}
      >
        {/* No notch inside the navbar */}
      </div>
    </div>
  );
}