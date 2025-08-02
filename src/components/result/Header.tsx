
import React from 'react';
import { Card } from '@/components/ui/card';
import Logo from '../ui/logo';
import { StyleResult } from '@/types/quiz';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  logo?: string;
  logoAlt?: string;
  title?: string;
  primaryStyle?: StyleResult;
  logoHeight?: number;
  userName?: string;
  isScrolled?: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logo = "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
  logoAlt = "Logo Gisele Galvão",
  title = "Olá",
  primaryStyle,
  logoHeight = 80,
  userName,
  isScrolled,
  className = ''
}) => {
  // Get userName from context if not provided as prop
  const { user } = useAuth();
  const displayName = userName || (user?.userName) || user?.name || 'Visitante';
  
  return (
    <Card className={`bg-white shadow-sm p-6 mb-6 ${className}`}>
      <div className="flex flex-col items-center gap-5">
        <div className="flex justify-center w-full">
          <Logo 
            src={logo} 
            alt={logoAlt} 
            className="h-auto mx-auto" 
            style={{
              height: `${logoHeight}px`,
              maxWidth: '100%'
            }} 
          />
        </div>
        
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-playfair text-[#432818]">
            {title} <span className="font-medium">{displayName}</span>, seu Estilo Predominante é:
          </h1>
          
          {primaryStyle && (
            <h2 className="font-bold text-[#B89B7A] mt-2 text-2xl">
              {primaryStyle.category}
            </h2>
          )}
        </div>
      </div>
    </Card>
  );
};
