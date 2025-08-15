'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FooterComponentProps {
  companyName?: string;
  year?: number;
  copyrightText?: string;
  textColor?: string;
  fontSize?: 'xs' | 'sm' | 'base';
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
  isEditable?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * FooterComponent - Componente modular para rodapé
 * 
 * Características:
 * - Copyright automático com ano atual
 * - Configuração flexível de texto
 * - Cores da marca
 * - Totalmente editável
 */
const FooterComponent: React.FC<FooterComponentProps> = ({
  companyName = "Gisele Galvão",
  year = new Date().getFullYear(),
  copyrightText = "Todos os direitos reservados",
  textColor = "#6B7280",
  fontSize = "xs",
  textAlign = "center",
  className = "",
  isEditable = false,
  onPropertyChange: _onPropertyChange,
}) => {

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'xs': return 'text-xs';
      case 'sm': return 'text-sm';
      case 'base': return 'text-base';
      default: return 'text-xs';
    }
  };

  const getTextAlignClass = () => {
    switch (textAlign) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      case 'center': 
      default: return 'text-center';
    }
  };

  const fullCopyrightText = `© ${year} ${companyName} - ${copyrightText}`;

  return (
    <footer 
      className={cn(
        "w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mt-auto pt-6 mx-auto",
        isEditable && "border-2 border-dashed border-gray-300 hover:border-[#B89B7A] transition-colors p-2",
        className
      )}
      data-component="footer"
    >
      <p 
        className={cn(
          getFontSizeClass(),
          getTextAlignClass()
        )}
        style={{ color: textColor }}
      >
        {fullCopyrightText}
      </p>

      {/* Painel de edição (se editável) */}
      {isEditable && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <strong>Rodapé:</strong> Editável via painel<br />
          <strong>Ano:</strong> Automático ({year})
        </div>
      )}
    </footer>
  );
};

export default FooterComponent;