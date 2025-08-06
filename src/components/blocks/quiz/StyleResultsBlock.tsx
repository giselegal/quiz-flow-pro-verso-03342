import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { styleConfig } from "@/data/styleConfig";
import type { BlockComponentProps } from "@/types/blocks";
import React, { useState } from "react";
import StyleGuideModal from "./StyleGuideModal";

interface StyleResultsProperties {
  styleType?: string;
  styleDescription?: string;
  styleImage?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showPersonality?: boolean;
  personalityTraits?: string;
  showStyleTips?: boolean;
  styleTips?: string;
  showColorPalette?: boolean;
  colorPalette?: string;
  resultLayout?: "simple" | "detailed" | "compact" | "extended";
  showScore?: boolean;
  enableSharing?: boolean;
}

const StyleResultsBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const { user } = useAuth();
  const userName = user?.name || user?.email || "Usuário";
  const [showGuideModal, setShowGuideModal] = useState(false);

  const {
    styleType = "clássico",
    styleDescription = "Seu estilo reflete elegância e sofisticação.",
    styleImage = "",
    primaryColor = "#432818",
    secondaryColor = "#8B7355",
    showPersonality = true,
    personalityTraits = "Elegante, Refinado, Atemporal",
    showStyleTips = true,
    styleTips = "Invista em peças clássicas e de qualidade.",
    showColorPalette = true,
    colorPalette = "#432818,#8B7355,#DCC7AA,#F5F1E8",
    resultLayout = "detailed",
    showScore = false,
    enableSharing = true,
  } = (properties || {}) as StyleResultsProperties;

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  // Mock data para demonstração
  const categoryScores = {
    [styleType]: 85,
    moderno: 65,
    romântico: 45,
    dramático: 30,
  };

  // Obter estilos ordenados por pontuação
  const sortedStyles = Object.entries(categoryScores)
    .sort(([, scoreA], [, scoreB]) => (scoreB as number) - (scoreA as number))
    .filter(([style]) => style in styleConfig);

  // Estilo principal (maior pontuação)
  const mainStyle = sortedStyles[0]?.[0] as keyof typeof styleConfig | undefined;

  // Dados do resultado
  const result = {
    title: styleType.charAt(0).toUpperCase() + styleType.slice(1),
    imageUrl: styleImage,
    description: styleDescription,
  };

  const showGuideImage = true;
  const guideImageUrl = "/api/placeholder/400/300";
  const showAllStyles = true;

  const onReset = () => {
    // Função para reiniciar o quiz
  };

  const onShare = () => {
    // Função para compartilhar resultado
  };

  return (
    <div
      className={`max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      }`}
      onClick={onClick}
    >
      <div className="text-center mb-8">
        <h2
          className="text-3xl font-bold text-[#432818] mb-2"
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={e => handlePropertyUpdate("styleType", e.target.textContent || "")}
        >
          {result.title}
        </h2>
        <p className="text-lg text-gray-500 mb-6">
          Parabéns, {userName}! Seu estilo predominante é:
        </p>

        {result.imageUrl && (
          <div className="mb-6">
            <img
              src={result.imageUrl}
              alt={result.title}
              className="w-full max-w-md mx-auto rounded-lg object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg prose-stone mx-auto mb-8">
          <p className="text-gray-700">{result.description}</p>
        </div>

        {showGuideImage && guideImageUrl && (
          <div className="mb-8 p-4 bg-stone-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-[#432818]">
              Guia de Estilo Personalizado
            </h3>
            <div className="relative">
              <img
                src={guideImageUrl}
                alt={`Guia ${result.title}`}
                className="w-full rounded-lg object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                <Button
                  onClick={() => setShowGuideModal(true)}
                  className="bg-white text-[#432818] hover:bg-[#B89B7A] hover:text-white"
                >
                  Ver Guia Completo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {sortedStyles.length > 0 && (
        <div className="mb-8 p-4 bg-stone-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 text-[#432818]">Sua Composição de Estilos</h3>

          <div className="space-y-3">
            {sortedStyles.slice(0, showAllStyles ? undefined : 3).map(([style, score]) => (
              <div key={style} className="flex justify-between items-center">
                <span className="font-medium">{style}</span>
                <div className="flex items-center gap-3">
                  <div className="bg-stone-200 w-48 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-[#B89B7A] h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          ((score as number) / Math.max(...Object.values(categoryScores))) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{score} pts</span>
                </div>
              </div>
            ))}
          </div>

          {!showAllStyles && sortedStyles.length > 3 && (
            <p className="text-sm text-center mt-3 text-[#B89B7A]">
              Mostrando os 3 estilos predominantes
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        {onReset && (
          <Button
            onClick={onReset}
            variant="outline"
            className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A]/10"
          >
            Refazer Quiz
          </Button>
        )}

        {onShare && (
          <Button onClick={onShare} className="bg-[#B89B7A] hover:bg-[#A08766] text-white">
            Compartilhar Resultado
          </Button>
        )}
      </div>

      {showGuideModal && mainStyle && (
        <StyleGuideModal style={mainStyle} onClose={() => setShowGuideModal(false)} />
      )}
    </div>
  );
};

export default StyleResultsBlock;
