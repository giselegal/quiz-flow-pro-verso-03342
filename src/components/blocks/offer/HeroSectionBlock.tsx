// @ts-nocheck
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { ShoppingCart, Star, Users } from 'lucide-react';

/**
 * BLOCO EDITÁVEL: Hero da Página de Oferta
 *
 * Props Editáveis:
 * - title: string (título principal)
 * - subtitle: string (subtítulo)
 * - description: string (descrição)
 * - heroImage: string (imagem principal)
 * - buttonText: string (texto do botão principal)
 * - buttonUrl: string (URL do botão)
 * - showSocialProof: boolean (mostrar prova social)
 * - socialProofText: string (texto da prova social)
 * - backgroundColor: string
 * - textColor: string
 *
 * Exemplo de Uso:
 * <HeroSectionBlock
 *   title="Descubra Seu Estilo Pessoal"
 *   subtitle="Transforme seu guarda-roupa"
 *   buttonText="Começar agora"
 *   showSocialProof={true}
 * />
 */

export interface HeroSectionBlockProps {
  blockId?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
  buttonText?: string;
  buttonUrl?: string;
  showSocialProof?: boolean;
  socialProofText?: string;
  backgroundColor?: string;
  textColor?: string;
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

const HeroSectionBlock: React.FC<HeroSectionBlockProps> = ({
  blockId = 'hero-section',
  title = 'Descubra Seu Estilo Pessoal e Transforme Seu Guarda-Roupa',
  subtitle = 'Quiz personalizado com análise completa',
  description = 'Descubra qual é o seu estilo predominante e receba dicas personalizadas para montar looks incríveis.',
  heroImage = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop',
  buttonText = 'Fazer o Quiz Agora',
  buttonUrl = '#',
  showSocialProof = true,
  socialProofText = '3000+ mulheres já descobriram seu estilo',
  backgroundColor = '#F9F7F4',
  textColor = '#432818',
  className = '',
}) => {
  const handleButtonClick = () => {
    if (buttonUrl && buttonUrl !== '#') {
      window.open(buttonUrl, '_blank');
    }
  };

  return (
    <div
      className={`hero-section-block py-16 px-6 ${className}`}
      data-block-id={blockId}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <div className="text-center md:text-left">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: textColor,
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <h2 className="text-xl md:text-2xl text-[#6B5B73] mb-6 font-medium">{subtitle}</h2>
            )}

            {description && <p style={{ color: '#6B4F43' }}>{description}</p>}

            <Button
              onClick={handleButtonClick}
              size="lg"
              className="bg-[#B89B7A] hover:bg-[#a68a6d] text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {buttonText}
            </Button>

            {showSocialProof && socialProofText && (
              <div style={{ color: '#6B4F43' }}>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
                <Users className="w-4 h-4 ml-2" />
                <span>{socialProofText}</span>
              </div>
            )}
          </div>

          {/* Imagem */}
          <div className="relative">
            <OptimizedImage
              src={heroImage}
              alt="Mulher elegante descobrindo seu estilo"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />

            {/* Badge flutuante */}
            <div className="absolute -top-4 -right-4 bg-[#B89B7A] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              ✨ Resultado instantâneo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionBlock;
