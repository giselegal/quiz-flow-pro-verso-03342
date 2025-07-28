import React, { useEffect, useState } from "react";
import { StyleResult } from "../types/quiz";
import { useAuth } from "../context/AuthContext";
import { ContentContainer } from "./shared/ContentContainer";
import { GridLayout } from "./shared/GridLayout";
import ResultHeader from "./quiz-result/ResultHeader";
import PrimaryStyleCard from "./quiz-result/PrimaryStyleCard";
import SecondaryStylesSection from "./quiz-result/SecondaryStylesSection";
import OfferCard from "./quiz-result/OfferCard";
import BeforeAfterTransformation from "./result/BeforeAfterTransformation";
import { CheckCircle } from "lucide-react";
import { sharedStyles } from "@/styles/sharedStyles";
import { ResultPageConfig } from "@/types/resultPageConfig";
import { cn } from "@/lib/utils";
import GuaranteeSection from "./result/GuaranteeSection";

interface QuizResultProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  config?: ResultPageConfig;
  previewMode?: boolean;
  onReset?: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({
  primaryStyle,
  secondaryStyles,
  config: externalConfig,
  previewMode = false,
  onReset,
}) => {
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>("Visitante");

  useEffect(() => {
    if (user && user.userName) {
      setUserName(user.userName);
    } else {
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
      }
    }
  }, [user]);

  const [config, setConfig] = useState<ResultPageConfig | null>(null);

  useEffect(() => {
    try {
      if (externalConfig) {
        setConfig(externalConfig);
      } else {
        const configKey = `quiz_result_config_${primaryStyle.category}`;
        const savedConfig = localStorage.getItem(configKey);

        if (savedConfig) {
          setConfig(JSON.parse(savedConfig));
          console.log("Loaded config from localStorage:", configKey);
        } else {
          console.log("No saved config found for:", primaryStyle.category);
          setConfig(null);
        }
      }
    } catch (error) {
      console.error("Error loading custom settings:", error);
      setConfig(null);
    }
  }, [primaryStyle.category, externalConfig]);

  if (!primaryStyle || !secondaryStyles) {
    console.error("Missing required props:", { primaryStyle, secondaryStyles });
    return <div>Erro ao carregar os resultados. Por favor, refaça o quiz.</div>;
  }

  // Build custom title with user name
  const customTitle = `Olá, ${userName}, seu Estilo Predominante é:`;

  return (
    <div
      className={cn(
        "min-h-screen",
        previewMode ? "max-h-screen overflow-auto" : ""
      )}
      style={{
        backgroundColor:
          config?.globalStyles?.backgroundColor ||
          sharedStyles.colors.background,
        color:
          config?.globalStyles?.textColor || sharedStyles.colors.textPrimary,
      }}
    >
      <ContentContainer size="md">
        <ResultHeader userName={userName} customTitle={customTitle} />

        <div className="space-y-8">
          <PrimaryStyleCard primaryStyle={primaryStyle} />
          <SecondaryStylesSection secondaryStyles={secondaryStyles} />
          <OfferCard
            primaryStyle={primaryStyle}
            config={config?.offer?.hero?.content || {}}
          />
          {/* Bloco de transformação Antes e Depois */}
          <BeforeAfterTransformation />

          {/* Importar componente GuaranteeSection em vez de usar o simples */}
          <div className="mt-12 mb-8">
            <GuaranteeSection />
          </div>
        </div>
      </ContentContainer>
    </div>
  );
};

export default QuizResult;
