
import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  logo?: string;
  logoAlt?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = 'Resultado do Quiz',
  subtitle,
  logo,
  logoAlt = 'Logo'
}) => {
  return (
    <header className="text-center mb-8">
      {logo && (
        <img 
          src={logo}
          alt={logoAlt}
          className="mx-auto w-36 mb-6"
        />
      )}
      <h1 className="text-4xl font-playfair text-[#432818] mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-[#8F7A6A] max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </header>
  );
};

export { Header };
export default Header;
