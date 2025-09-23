import React from 'react';

interface TechBackgroundProps {
  variant?: 'hero' | 'section' | 'minimal';
  className?: string;
  children?: React.ReactNode;
}

const TechBackground: React.FC<TechBackgroundProps> = ({ 
  variant = 'hero', 
  className = '',
  children 
}) => {
  const getBackgroundClasses = () => {
    switch (variant) {
      case 'hero':
        return 'gradient-tech';
      case 'section':
        return 'bg-gradient-to-r from-brand-mediumBlue/95 via-brand-darkBlue/90 to-brand-darkBlue/85';
      case 'minimal':
        return 'gradient-subtle';
      default:
        return 'gradient-tech';
    }
  };

  return (
    <div className={`relative overflow-hidden ${getBackgroundClasses()} ${className}`}>
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 191, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 191, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Circle */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-brand-brightBlue/20 to-brand-brightPink/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Medium Circle */}
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-gradient-to-br from-brand-brightPink/15 to-brand-lightBlue/15 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '6s' }} />
        
        {/* Small Circles */}
        <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-gradient-to-br from-brand-brightBlue/25 to-transparent rounded-full blur-xl animate-ping" style={{ animationDuration: '4s' }} />
        
        {/* Hexagon */}
        <div className="absolute top-1/4 left-1/3 w-24 h-24 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
            <polygon 
              points="50,5 90,25 90,75 50,95 10,75 10,25" 
              fill="url(#hexGradient)" 
              stroke="rgba(0, 191, 255, 0.3)" 
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00BFFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FF00FF" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Particle Effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand-brightBlue rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>


    </div>
  );
};

export default TechBackground;