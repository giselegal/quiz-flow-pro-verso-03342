import React from 'react';
import { StyleResult } from '@/components/result/StyleResult';

/**
 * BLOCO EDITÁVEL: Card de Resultado de Estilo Predominante
 * 
 * Props Editáveis:
 * - primaryStyle: StyleResult (objeto com dados do estilo)
 * - showPercentage: boolean (mostrar porcentagem)
 * - cardStyle: 'default' | 'elegant' | 'modern'
 * - backgroundColor: string
 * - borderColor: string
 * - textColor: string
 * 
 * Exemplo de Uso:
 * <PrimaryStyleCardBlock 
 *   primaryStyle={{
 *     id: 'natural',
 *     name: 'Natural',
 *     description: 'Conforto e praticidade',
 *     percentage: 92,
 *     imageUrl: 'https://...',
 *     characteristics: ['Confortável', 'Prático']
 *   }}
 *   showPercentage={true}
 *   cardStyle="elegant"
 * />
 */

export interface StyleResultData {
  id: string;
  name: string;
  description: string;
  percentage: number;
  imageUrl: string;
  characteristics: string[];
}

export interface PrimaryStyleCardBlockProps {
  blockId?: string;
  primaryStyle?: StyleResultData;
  showPercentage?: boolean;
  cardStyle?: 'default' | 'elegant' | 'modern';
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  className?: string;
}

const PrimaryStyleCardBlock: React.FC<PrimaryStyleCardBlockProps> = ({
  blockId = 'primary-style-card',
  primaryStyle = {
    id: 'natural',
    name: 'Natural',
    description: 'Conforto e praticidade em primeiro lugar',
    percentage: 92,
    imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    characteristics: ['Confortável', 'Prático', 'Versátil']
  },
  showPercentage = true,
  cardStyle = 'elegant',
  backgroundColor = '#ffffff',
  borderColor = '#B89B7A',
  textColor = '#432818',
  className = '',
}) => {
  return (
    <div className={`primary-style-card-block ${className}`} data-block-id={blockId}>
      <StyleResult 
        primaryStyle={primaryStyle}
        showPercentage={showPercentage}
        style={{
          backgroundColor,
          borderColor,
          color: textColor
        }}
      />
    </div>
  );
};

export default PrimaryStyleCardBlock;
