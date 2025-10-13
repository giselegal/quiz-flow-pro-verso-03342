// @ts-nocheck
import MotivationSection from '@/components/result/MotivationSection';

/**
 * BLOCO EDITÁVEL: Seção de Motivação
 *
 * Props Editáveis:
 * - title: string (título da seção)
 * - subtitle: string (subtítulo)
 * - content: string (texto principal)
 * - showButton: boolean (mostrar botão CTA)
 * - buttonText: string (texto do botão)
 * - buttonColor: string (cor do botão)
 * - backgroundColor: string
 * - textAlign: 'left' | 'center' | 'right'
 *
 * Exemplo de Uso:
 * <MotivationSectionBlock
 *   title="Sua transformação começa agora"
 *   subtitle="Descubra seu potencial"
 *   content="Com o CaktoQuiz, você terá todas as ferramentas..."
 *   showButton={true}
 *   buttonText="Começar agora"
 * />
 */

export interface MotivationSectionBlockProps {
  blockId?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonColor?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
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

const MotivationSectionBlock: React.FC<MotivationSectionBlockProps> = ({
  blockId = 'motivation-section',
  title = 'Sua transformação começa agora',
  subtitle = 'Descubra seu potencial único',
  content = 'Com as estratégias certas, você pode transformar completamente seu estilo e autoestima.',
  showButton = true,
  buttonText = 'Quero me transformar',
  buttonColor = '#B89B7A',
  backgroundColor = '#ffffff',
  textAlign = 'center',
  className = '',
}) => {
  return (
    <div
      className={`motivation-section-block ${className}`}
      data-block-id={blockId}
      style={{
        backgroundColor,
        textAlign,
      }}
    >
      <MotivationSection />
    </div>
  );
};

export default MotivationSectionBlock;
