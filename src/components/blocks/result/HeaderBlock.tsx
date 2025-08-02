
import React from 'react';
import Header from '@/components/result/Header';

/**
 * BLOCO EDITÁVEL: Header da Página de Resultado
 * 
 * Props Editáveis:
 * - logo: string (URL do logo)
 * - logoAlt: string (Texto alternativo do logo)
 * - logoHeight: string (Altura do logo, ex: "60px")
 * - showUserName: boolean (Mostrar nome do usuário)
 * - userName: string (Nome do usuário)
 * - backgroundColor: string (Cor de fundo)
 * - sticky: boolean (Header fixo no topo)
 * 
 * Exemplo de Uso:
 * <HeaderBlock 
 *   logo="https://example.com/logo.png"
 *   logoAlt="Logo da Empresa"
 *   logoHeight="60px"
 *   showUserName={true}
 *   userName="Maria"
 *   backgroundColor="#ffffff"
 *   sticky={true}
 * />
 */

export interface HeaderBlockProps {
  blockId?: string;
  logo?: string;
  logoAlt?: string;
  logoHeight?: number;
  showUserName?: boolean;
  userName?: string;
  backgroundColor?: string;
  sticky?: boolean;
  className?: string;
}

const HeaderBlock: React.FC<HeaderBlockProps> = ({
  blockId = 'header-block',
  logo = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
  logoAlt = 'Logo Gisele Galvão',
  logoHeight = 60,
  showUserName = true,
  userName = '',
  backgroundColor = '#ffffff',
  sticky = true,
  className = '',
}) => {
  return (
    <Header 
      logo={logo}
      logoAlt={logoAlt}
      logoHeight={logoHeight}
      userName={userName}
      className={className}
    />
  );
};

export default HeaderBlock;
