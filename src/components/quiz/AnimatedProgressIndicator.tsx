import React from 'react';

const AnimatedProgressIndicator: React.FC = () => (
  <div className="flex items-center justify-center gap-1 mt-2">
    <div className="w-8 h-1.5 rounded-full bg-[#B89B7A] transition-all duration-300" />
    <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: '#E5DDD5' }}></div>
    <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: '#E5DDD5' }}></div>
    <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: '#E5DDD5' }}></div>
  </div>
);

export default AnimatedProgressIndicator;
