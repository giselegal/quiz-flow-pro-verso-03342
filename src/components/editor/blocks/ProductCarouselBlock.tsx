import React from "react";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

interface ProductCarouselBlockProps {
  title?: string;
  showDescription?: boolean;
  className?: string;
}

const ProductCarouselBlock: React.FC<ProductCarouselBlockProps> = ({
  title = "Vista-se de Você — na Prática",
  showDescription = true,
  className,
}) => {
  const handleCTAClick = () => {
    window.location.href =
      "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912";
  };

  return (
    <div className={cn("text-center mt-10", className)}>
      <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-4">
        {title}
      </h2>
      <div className="elegant-divider"></div>
      {showDescription && (
        <p className="text-[#432818] mb-6 max-w-xl mx-auto">
          Agora que você conhece seu estilo, é hora de aplicá-lo com clareza e
          intenção. O Guia da Gisele Galvão foi criado para mulheres como você —
          que querem se vestir com autenticidade e transformar sua imagem em
          ferramenta de poder.
        </p>
      )}

      <button
        onClick={handleCTAClick}
        className="text-white py-5 px-8 rounded-md shadow-md transition-all duration-300 transform hover:scale-105"
        style={{
          background: "linear-gradient(to right, #4CAF50, #45a049)",
          boxShadow: "0 4px 14px rgba(76, 175, 80, 0.4)",
          fontSize: "1rem",
        }}
      >
        <span className="flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          <span>Garantir Meu Guia + Bônus Especiais</span>
        </span>
      </button>
    </div>
  );
};

export default ProductCarouselBlock;
