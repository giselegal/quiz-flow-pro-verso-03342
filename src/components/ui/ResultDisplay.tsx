import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { SpecialTipsCard } from "@/components/ui/SpecialTipsCard";

interface ResultDisplayProps {
  username: string;
  styleName: string;
  percentage: number;
  image: string;
  guideImage: string;
  description: string;
  tips: string[];
  category?: string;
  onCtaClick?: () => void;
  ctaText?: string;
  ctaUrl?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  username,
  styleName,
  percentage,
  image,
  guideImage,
  description,
  tips,
  category,
  onCtaClick,
  ctaText = "Quero Aprimorar Meu Estilo",
  ctaUrl = "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912"
}) => {
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaUrl) {
      window.open(ctaUrl, '_blank');
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 p-6 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <Card className="w-full shadow-lg rounded-2xl bg-gradient-to-br from-white to-stone-50">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <CardTitle className="text-2xl font-bold text-center text-[#432818]">
              🎉 Resultado do Seu Quiz de Estilo Pessoal
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome do participante */}
          <p className="text-lg text-center text-[#6B4F43]">
            Olá, <span className="font-semibold text-[#432818]">{username}</span>! ✨
          </p>

          {/* Estilo Predominante */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#432818] mb-2">
              Estilo Predominante: {styleName}
            </h2>
            {category && (
              <p className="text-[#6B4F43] text-sm mb-4">{category}</p>
            )}
          </div>

          {/* Porcentagem com barra */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[#6B4F43]">
                Compatibilidade:
              </span>
              <span className="text-lg font-bold text-[#B89B7A]">
                {percentage}%
              </span>
            </div>
            <Progress 
              value={percentage} 
              className="h-3 rounded-full bg-[#F3E8E6]" 
              style={{
                '--progress-color': '#B89B7A',
              } as React.CSSProperties}
            />
          </div>

          {/* Imagens lado a lado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="text-center">
              <h3 className="text-sm font-medium text-[#6B4F43] mb-3">Seu Estilo</h3>
              <img
                src={image}
                alt={`Estilo ${styleName}`}
                className="w-full h-auto rounded-xl shadow-lg object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-[#6B4F43] mb-3">Guia de Aplicação</h3>
              <img
                src={guideImage}
                alt={`Guia do Estilo ${styleName}`}
                className="w-full h-auto rounded-xl shadow-lg object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="text-center mt-6">
            <p className="text-[#432818] text-lg leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dicas Especiais */}
      {tips && tips.length > 0 && (
        <SpecialTipsCard
          styleName={styleName}
          tips={tips}
          accentColor="text-[#B89B7A]"
          title="💎 Dicas Especiais para Você"
          className="w-full border-[#B89B7A]/20"
        />
      )}

      {/* CTA */}
      <div className="text-center w-full">
        <div className="bg-gradient-to-br from-[#B89B7A]/10 to-[#aa6b5d]/10 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-[#432818] mb-4">
            Pronto para Transformar Sua Imagem?
          </h3>
          <p className="text-[#6B4F43] mb-6 max-w-md mx-auto">
            Agora que você conhece seu estilo {styleName}, descubra como aplicá-lo no seu dia a dia.
          </p>
          
          <button
            onClick={handleCtaClick}
            className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:from-[#A08966] hover:to-[#9A5A4D] transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {ctaText} →
          </button>
        </div>
      </div>
    </div>
  );
};