import React from 'react';

interface QuizFlowLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  theme?: 'light' | 'dark';
}

const QuizFlowLogo: React.FC<QuizFlowLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  theme = 'light'
}) => {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-12 h-12', text: 'text-xl' },
    lg: { icon: 'w-16 h-16', text: 'text-2xl' },
    xl: { icon: 'w-24 h-24', text: 'text-4xl' }
  };

  const LogoIcon = () => (
    <div className={`${sizeClasses[size].icon} relative flex items-center justify-center`}>
      <div className="w-full h-full rounded-full bg-gradient-to-br from-brand-primary via-brand-accent to-brand-secondary shadow-lg flex items-center justify-center">
        <div className="w-4/5 h-4/5 bg-white rounded-full flex items-center justify-center shadow-inner">
          <span className="text-2xl font-bold bg-gradient-to-br from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Q
          </span>
        </div>
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full animate-pulse opacity-75"></div>
    </div>
  );

  const LogoText = () => {
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

    return (
      <div className="flex items-center">
        <span className={`font-bold ${sizeClasses[size].text} ${textColor} tracking-tight`}>
          Quiz<span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">Flow</span>
        </span>
        <span className={`ml-1 text-sm ${textColor} opacity-60 font-medium`}>Pro</span>
      </div>
    );
  };

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  // Full logo (default)
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  );
};

export default QuizFlowLogo;
