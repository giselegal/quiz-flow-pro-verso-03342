import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Shield, ShoppingCart, Lock, ArrowDown } from "lucide-react";

interface AdvancedCTABlockProps {
  mainText?: string;
  buttonText?: string;
  showGuarantee?: boolean;
  showSecurityBadge?: boolean;
  className?: string;
}

const AdvancedCTABlock: React.FC<AdvancedCTABlockProps> = ({
  mainText = "Descubra Como Aplicar Seu Estilo na Prática",
  buttonText = "Quero meu Guia de Estilo Agora",
  showGuarantee = true,
  showSecurityBadge = true,
  className,
}) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleCTAClick = () => {
    window.location.href = "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912";
  };

  return (
    <div className={cn("text-center my-10", className)}>
      <div className="bg-[#f9f4ef] p-6 rounded-lg border border-[#B89B7A]/10 mb-6">
        <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">{mainText}</h3>
        <div className="flex justify-center">
          <ArrowDown className="w-8 h-8 text-[#B89B7A] animate-bounce" />
        </div>
      </div>

      <button
        onClick={handleCTAClick}
        className="text-white py-4 px-6 rounded-md transition-all duration-300 transform hover:scale-105"
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        style={{
          background: "linear-gradient(to right, #4CAF50, #45a049)",
          boxShadow: "0 4px 14px rgba(76, 175, 80, 0.4)",
        }}
      >
        <span className="flex items-center justify-center gap-2">
          <ShoppingCart
            className={`w-5 h-5 transition-transform duration-300 ${isButtonHovered ? "scale-110" : ""}`}
          />
          {buttonText}
        </span>
      </button>

      {showSecurityBadge && (
        <div className="mt-2 inline-block bg-[#aa6b5d]/10 px-3 py-1 rounded-full">
          <p className="text-sm text-[#aa6b5d] font-medium flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Oferta exclusiva nesta página</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvancedCTABlock;
