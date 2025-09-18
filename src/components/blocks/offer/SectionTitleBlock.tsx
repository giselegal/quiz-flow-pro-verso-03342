// @ts-nocheck
import { Award } from 'lucide-react';

/**
 * BLOCO EDITÁVEL: Título de Seção
 *
 * Props Editáveis:
 * - title: string (título principal)
 * - subtitle: string (subtítulo)
 * - showBadge: boolean (mostrar badge)
 * - badgeText: string (texto do badge)
 * - badgeIcon: string (ícone do badge)
 * - alignment: 'left' | 'center' | 'right'
 * - titleColor: string
 * - subtitleColor: string
 * - badgeColor: string
 *
 * Exemplo de Uso:
 * <SectionTitleBlock
 *   title="Por que escolher o CaktoQuiz?"
 *   subtitle="A solução completa para seu estilo"
 *   showBadge={true}
 *   badgeText="Comprovado por especialistas"
 * />
 */

export interface SectionTitleBlockProps {
  blockId?: string;
  title?: string;
  subtitle?: string;
  showBadge?: boolean;
  badgeText?: string;
  alignment?: 'left' | 'center' | 'right';
  titleColor?: string;
  subtitleColor?: string;
  badgeColor?: string;
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

const SectionTitleBlock: React.FC<SectionTitleBlockProps> = ({
  blockId = 'section-title',
  title = 'Por que escolher o CaktoQuiz?',
  subtitle = 'A solução mais completa para descobrir seu estilo pessoal',
  showBadge = true,
  badgeText = '3000+ mulheres transformadas',
  alignment = 'center',
  titleColor = '#432818',
  subtitleColor = '#6B5B73',
  badgeColor = '#B89B7A',
  className = '',
}) => {
  return (
    <div className={`section-title-block py-12 px-6 ${className}`} data-block-id={blockId}>
      <div className="max-w-4xl mx-auto" style={{ textAlign: alignment }}>
        {showBadge && badgeText && (
          <div className="mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
              style={{
                backgroundColor: `${badgeColor}20`,
                borderColor: `${badgeColor}40`,
                color: badgeColor,
              }}
            >
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold">{badgeText}</span>
            </div>
          </div>
        )}

        <h2
          className="text-3xl md:text-4xl font-bold mb-6"
          style={{
            fontFamily: 'Playfair Display, serif',
            color: titleColor,
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: subtitleColor }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionTitleBlock;
