import React from 'react';

export function Logo() {
  return (
    <div className="fixed top-4 left-4 z-50 pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <img 
          src="/monogram.png" 
          alt="Apistemology" 
          className="h-8 w-8 object-contain"
        />
        <span className="text-white font-semibold text-lg -ml-4 font-inter">Apistemology</span>
      </div>
    </div>
  );
} 