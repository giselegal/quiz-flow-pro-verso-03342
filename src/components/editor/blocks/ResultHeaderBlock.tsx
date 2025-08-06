import React from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface ResultHeaderBlockProps {
  title?: string;
  subtitle?: string;
  logoUrl?: string;
  showLogo?: boolean;
  className?: string;
}

const ResultHeaderBlock: React.FC<ResultHeaderBlockProps> = ({
  title = "Parabéns!",
  subtitle = "Seu Estilo Pessoal foi Revelado",
  logoUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
  showLogo = true,
  className,
}) => {
  const { user } = useAuth();
  const userName = (user as any)?.userName || localStorage.getItem("userName") || "";

  return (
    <div
      className={cn("text-center py-8 bg-gradient-to-b from-[#faf8f5] to-transparent", className)}
    >
      <div className="max-w-4xl mx-auto px-4">
        {showLogo && (
          <div className="mb-6">
            <img
              src={logoUrl}
              alt="Gisele Galvão - Consultoria de Imagem"
              className="h-16 md:h-20 mx-auto object-contain"
              loading="eager"
            />
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-[#aa6b5d] mb-2">
          {title} {userName && <span className="text-[#B89B7A]">{userName}!</span>}
        </h1>

        <p className="text-lg text-[#432818] mb-4">{subtitle}</p>

        <div className="w-24 h-1 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] mx-auto rounded-full"></div>
      </div>
    </div>
  );
};

export default ResultHeaderBlock;
