
import React from 'react';

export interface HeaderProps {
  logo?: string;
  logoAlt?: string;
  userName?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  logo = '/lovable-uploads/43226d91-37d3-4ba7-bad2-e0618ba1f0a0.png',
  logoAlt = 'Gisele Zaros Logo',
  userName = '',
  className = ''
}) => {
  return (
    <div className={`text-center py-6 ${className}`}>
      <img 
        src={logo} 
        alt={logoAlt} 
        className="mx-auto w-36 mb-4" 
      />
      {userName && (
        <h2 className="text-2xl font-bold text-[#432818]">
          Olá, {userName}!
        </h2>
      )}
    </div>
  );
};

export default Header;
