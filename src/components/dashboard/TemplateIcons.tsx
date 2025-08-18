// Template Visual Icons - Componentes visuais para os templates do dashboard
import React from 'react';

// Ícone para Página de Oferta
export const OfferPageIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <div className={`${className} relative`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="offerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B89B7A" />
          <stop offset="100%" stopColor="#432818" />
        </linearGradient>
      </defs>
      {/* Documento base */}
      <path
        d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
        fill="url(#offerGradient)"
        opacity="0.8"
      />
      {/* Linhas de conteúdo */}
      <path d="M8 7h8M8 10h6M8 13h8M8 16h4" stroke="white" strokeWidth="1" strokeLinecap="round" />
      {/* Estrela de destaque */}
      <path d="M16 15l1.5 3 3-1.5-3-1.5z" fill="white" opacity="0.9" />
    </svg>
  </div>
);

// Ícone para Quiz de Marketing
export const MarketingQuizIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <div className={`${className} relative`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="marketingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B89B7A" />
          <stop offset="100%" stopColor="#A08766" />
        </linearGradient>
      </defs>
      {/* Cabeça do usuário */}
      <circle cx="12" cy="8" r="4" fill="url(#marketingGradient)" />
      {/* Corpo */}
      <path
        d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
        stroke="url(#marketingGradient)"
        strokeWidth="2"
        fill="none"
      />
      {/* Lâmpada de ideias */}
      <circle cx="18" cy="6" r="3" fill="white" opacity="0.9" />
      <path d="M17 7h2" stroke="#B89B7A" strokeWidth="1" />
    </svg>
  </div>
);

// Ícone para Produto Digital
export const DigitalProductIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <div className={`${className} relative`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="digitalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B89B7A" />
          <stop offset="100%" stopColor="#A08766" />
        </linearGradient>
      </defs>
      {/* Monitor/Tela */}
      <rect x="4" y="4" width="16" height="12" rx="2" fill="url(#digitalGradient)" />
      <rect x="6" y="6" width="12" height="8" rx="1" fill="white" opacity="0.9" />
      {/* Coração digital */}
      <path
        d="M12 14l-2-2a2 2 0 1 1 2.83-2.83l0.17 0.17 0.17-0.17A2 2 0 1 1 14 11l-2 2z"
        fill="#B89B7A"
      />
      {/* Base do monitor */}
      <path d="M8 18h8M10 16v2M14 16v2" stroke="url(#digitalGradient)" strokeWidth="2" />
    </svg>
  </div>
);

// Ícone para E-commerce
export const EcommerceIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <div className={`${className} relative`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="ecommerceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B89B7A" opacity="0.8" />
          <stop offset="100%" stopColor="#A08766" />
        </linearGradient>
      </defs>
      {/* Carrinho de compras */}
      <path
        d="M3 3h2l1.68 8.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L22 5H6"
        stroke="url(#ecommerceGradient)"
        strokeWidth="2"
        fill="none"
      />
      {/* Rodas do carrinho */}
      <circle cx="9" cy="20" r="1" fill="url(#ecommerceGradient)" />
      <circle cx="20" cy="20" r="1" fill="url(#ecommerceGradient)" />
      {/* Estrela de qualidade */}
      <path d="M15 7l1 2h2l-1.5 1.5L17 13l-2-1-2 1 0.5-2.5L12 9h2z" fill="white" opacity="0.9" />
    </svg>
  </div>
);

// Background Pattern Component
export const BackgroundPattern: React.FC<{ variant?: 'primary' | 'secondary' | 'accent' }> = ({
  variant = 'primary',
}) => {
  const patterns = {
    primary: {
      circle1: 'from-[#B89B7A]/15 to-[#432818]/10',
      circle2: 'from-[#B89B7A]/8 to-transparent',
    },
    secondary: {
      circle1: 'from-[#B89B7A]/12 to-[#A08766]/8',
      circle2: 'from-[#432818]/5 to-transparent',
    },
    accent: {
      circle1: 'from-[#B89B7A]/10 to-[#432818]/15',
      circle2: 'from-[#A08766]/6 to-transparent',
    },
  };

  const pattern = patterns[variant];

  return (
    <>
      <div
        className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${pattern.circle1} rounded-full -translate-y-4 translate-x-4 blur-sm`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${pattern.circle2} rounded-full translate-y-4 -translate-x-4`}
      ></div>
      {/* Linha decorativa sutil */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B89B7A]/10 to-transparent"></div>
    </>
  );
};

export default {
  OfferPageIcon,
  MarketingQuizIcon,
  DigitalProductIcon,
  EcommerceIcon,
  BackgroundPattern,
};
