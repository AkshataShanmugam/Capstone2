import React from 'react';

const AnimatedGradientBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#881FFF] via-[#36312f] to-[#7e4bff] bg-[length:200%_200%] animate-gradient">
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedGradientBackground;
