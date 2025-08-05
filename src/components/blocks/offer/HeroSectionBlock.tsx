import React from "react";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { ShoppingCart, Star, Users } from "lucide-react";

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

const HeroSectionBlock: React.FC<HeroSectionBlockProps> = ({
  blockId = "hero-section",
  title = "Descubra Seu Estilo Pessoal e Transforme Seu Guarda-Roupa",
  subtitle = "Quiz personalizado com análise completa",
  description = "Descubra qual é o seu estilo predominante e receba dicas personalizadas para montar looks incríveis.",
  heroImage = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop",
  buttonText = "Fazer o Quiz Agora",
  buttonUrl = "#",
  showSocialProof = true,
  socialProofText = "3000+ mulheres já descobriram seu estilo",
  backgroundColor = "#F9F7F4",
  textColor = "#432818",
  className = "",
}) => {
  const handleButtonClick = () => {
    if (buttonUrl && buttonUrl !== "#") {
      window.open(buttonUrl, "_blank");
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
                fontFamily: "Playfair Display, serif",
                color: textColor,
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <h2 className="text-xl md:text-2xl text-[#6B5B73] mb-6 font-medium">{subtitle}</h2>
            )}

            {description && (
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">{description}</p>
            )}

            <Button
              onClick={handleButtonClick}
              size="lg"
              className="bg-[#B89B7A] hover:bg-[#a68a6d] text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {buttonText}
            </Button>

            {showSocialProof && socialProofText && (
              <div className="mt-8 flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
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
