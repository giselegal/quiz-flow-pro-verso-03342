import React from "react";
import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

interface SocialProofBlockProps {
  title?: string;
  showTitle?: boolean;
  className?: string;
}

const SocialProofBlock: React.FC<SocialProofBlockProps> = ({
  title = "Depoimentos Reais de Quem Transformou o Guarda-Roupa",
  showTitle = true,
  className,
}) => {
  // Dados reais dos depoimentos do funil
  const testimonials = [
    {
      name: "Ana Paula, 34 anos",
      text: "Nunca imaginei que descobrir meu estilo seria tão transformador. Agora me visto com confiança e recebo elogios todos os dias!",
      style: "Elegante",
      image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744921750/depoimento1.webp",
    },
    {
      name: "Carla Santos, 28 anos",
      text: "O guia me ensinou a montar looks incríveis com peças que já tinha no armário. Economizei muito e ainda melhoro minha imagem!",
      style: "Contemporâneo",
      image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744921750/depoimento2.webp",
    },
    {
      name: "Fernanda Lima, 42 anos",
      text: "Finalmente entendi qual estilo combina comigo. Minha autoestima subiu muito e me sinto mais eu mesma a cada dia.",
      style: "Natural",
      image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744921750/depoimento3.webp",
    },
  ];
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  const renderTestimonial = (testimonial: any, index: number) => (
    <div
      key={index}
      className="bg-gradient-to-br from-[#fff7f3] to-[#f9f4ef] p-6 rounded-xl border border-[#B89B7A]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-4">
          <Quote className="w-6 h-6 text-[#B89B7A] mr-2" />
          <div className="flex">{renderStars()}</div>
        </div>

        <p className="text-[#432818] mb-4 flex-grow italic leading-relaxed">"{testimonial.text}"</p>

        <div className="flex items-center justify-between pt-4 border-t border-[#B89B7A]/10">
          <div>
            <p className="font-semibold text-[#aa6b5d]">{testimonial.name}</p>
            <p className="text-sm text-[#B89B7A] font-medium">Estilo: {testimonial.style}</p>
          </div>
          <div className="w-12 h-12 bg-[#B89B7A]/10 rounded-full flex items-center justify-center">
            <span className="text-[#B89B7A] font-bold text-lg">{testimonial.name.charAt(0)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("py-12 bg-gradient-to-br from-[#faf8f5] to-[#f9f4ef]", className)}>
      <div className="max-w-7xl mx-auto px-6">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#aa6b5d] mb-4">{title}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] mx-auto rounded-full"></div>
            <p className="text-[#432818] mt-4 max-w-2xl mx-auto">
              Veja como outras mulheres transformaram seu estilo e autoestima
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-8 justify-center">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex-1 min-w-[300px] max-w-lg">
              {renderTestimonial(testimonial, index)}
            </div>
          ))}
        </div>

        {/* Elemento de confiança adicional */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-md border border-[#B89B7A]/20">
            <div className="flex mr-3">{renderStars()}</div>
            <span className="text-[#432818] font-medium">
              Mais de 2.500 mulheres já transformaram seu estilo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofBlock;
