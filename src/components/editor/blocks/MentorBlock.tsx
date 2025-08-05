import React from "react";
import { cn } from "@/lib/utils";
import { Award, Users, BookOpen } from "lucide-react";

interface MentorBlockProps {
  title?: string;
  showCredentials?: boolean;
  showImage?: boolean;
  className?: string;
}

const MentorBlock: React.FC<MentorBlockProps> = ({
  title = "Conheça Gisele Galvão",
  showCredentials = true,
  showImage = true,
  className,
}) => {
  // Dados reais sobre a mentora
  const credentials = [
    {
      icon: <Award className="w-5 h-5" />,
      text: "Consultora de Imagem certificada",
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Mais de 2.500 mulheres transformadas",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      text: "15+ anos de experiência em estilo",
    },
  ];

  return (
    <div className={cn("py-8", className)}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-md border border-[#B89B7A]/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {showImage && (
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src="https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.jpg"
                    alt="Gisele Galvão - Consultora de Imagem"
                    className="w-64 h-64 object-cover rounded-full shadow-lg"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#aa6b5d] mb-4">{title}</h2>
                <p className="text-[#432818] leading-relaxed">
                  Especialista em consultoria de imagem e estilo pessoal, Gisele Galvão dedica sua
                  carreira a ajudar mulheres a descobrirem e expressarem sua autenticidade através
                  do vestir.
                </p>
              </div>

              {showCredentials && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#aa6b5d]">
                    Por que confiar na Gisele?
                  </h3>
                  <div className="space-y-3">
                    {credentials.map((credential, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center text-white">
                          {credential.icon}
                        </div>
                        <span className="text-[#432818] font-medium">{credential.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#f9f4ef] p-4 rounded-lg border border-[#B89B7A]/10">
                <p className="text-sm text-[#432818] italic">
                  "Minha missão é mostrar para cada mulher que ela já possui tudo o que precisa para
                  ser elegante. Só precisamos despertar essa essência única que existe dentro de
                  você."
                </p>
                <p className="text-right text-[#aa6b5d] font-medium mt-2">- Gisele Galvão</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorBlock;
