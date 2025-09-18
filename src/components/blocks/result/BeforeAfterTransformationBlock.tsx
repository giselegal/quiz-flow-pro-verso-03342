// @ts-nocheck
import BeforeAfterTransformation from '@/components/result/BeforeAfterTransformation';

/**
 * BLOCO EDITÁVEL: Transformação Antes e Depois
 *
 * Props Editáveis:
 * - title: string (título da seção)
 * - beforeTitle: string (título do "antes")
 * - afterTitle: string (título do "depois")
 * - beforeImage: string (imagem do antes)
 * - afterImage: string (imagem do depois)
 * - description: string (descrição da transformação)
 * - showCTA: boolean (mostrar call-to-action)
 * - ctaText: string (texto do botão)
 *
 * Exemplo de Uso:
 * <BeforeAfterTransformationBlock
 *   title="Sua Transformação"
 *   beforeTitle="Antes"
 *   afterTitle="Depois"
 *   description="Veja como você pode se transformar"
 * />
 */

export interface BeforeAfterTransformationBlockProps {
  blockId?: string;
  title?: string;
  beforeTitle?: string;
  afterTitle?: string;
  beforeImage?: string;
  afterImage?: string;
  description?: string;
  showCTA?: boolean;
  ctaText?: string;
  backgroundColor?: string;
  className?: string;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const BeforeAfterTransformationBlock: React.FC<BeforeAfterTransformationBlockProps> = ({
  blockId = 'before-after-transformation',
  title = 'Sua Transformação Começa Agora',
  beforeTitle = 'Antes',
  afterTitle = 'Depois',
  beforeImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop',
  afterImage = 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop',
  description = 'Descubra como pequenas mudanças podem criar uma transformação incrível no seu estilo.',
  showCTA = true,
  ctaText = 'Quero me transformar',
  backgroundColor = '#ffffff',
  className = '',
}) => {
  return (
    <div
      className={`before-after-transformation-block ${className}`}
      data-block-id={blockId}
      style={{ backgroundColor }}
    >
      <BeforeAfterTransformation />
    </div>
  );
};

export default BeforeAfterTransformationBlock;
