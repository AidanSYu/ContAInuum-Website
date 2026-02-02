import React from 'react';

export const VignetteOverlay: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, transparent 45%, rgba(7, 10, 14, 0.5) 100%)',
      }}
      aria-hidden="true"
    />
  );
};
