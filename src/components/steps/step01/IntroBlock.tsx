// src/components/steps/step01/IntroBlock.tsx
// Componente principal da etapa 1 - Introdução baseada no JSON

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QUIZ_CONFIGURATION } from "@/config/quizConfiguration";
import { BlockComponentProps } from "@/types/blocks";
import React, { useEffect, useState } from "react";

export const IntroBlock: React.FC<BlockComponentProps> = ({
  block,
  isEditing = false,
  onPropertyChange,
  className = "",
}) => {
  const [userName, setUserName] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Extrair propriedades do bloco
  const properties = block?.properties || {};
  const id = block?.id || "intro-block";

  // Configuração padrão baseada no JSON
  const introStep =
    QUIZ_CONFIGURATION.steps.find(step => step.type === "intro") || QUIZ_CONFIGURATION.steps[0];

  // Extrair propriedades com valores padrão do JSON
  const {
    title = introStep.title,
    descriptionTop = introStep.descriptionTop,
    descriptionBottom = introStep.descriptionBottom,
    imageIntro = introStep.imageIntro,
    inputLabel = introStep.inputLabel,
    inputPlaceholder = introStep.inputPlaceholder,
    buttonText = introStep.buttonText,
    privacyText = introStep.privacyText,
    footerText = introStep.footerText,
    required = introStep.required,
    scale = 100,
    alignment = "center",
    backgroundColor = "transparent",
    backgroundOpacity = 100,
  } = properties;

  // Validação baseada nas regras do JSON
  useEffect(() => {
    if (required && introStep.validation) {
      const minLength = introStep.validation.minLength || 2;
      setIsValid(userName.length >= minLength);
    } else {
      setIsValid(true);
    }
  }, [userName, required, introStep.validation]);

  // Aplicar estilos baseados nas propriedades
  const containerStyle: React.CSSProperties = {
    transform: `scale(${scale / 100})`,
    transformOrigin:
      alignment === "left" ? "left center" : alignment === "right" ? "right center" : "center",
    textAlign: alignment,
    backgroundColor: backgroundColor === "transparent" ? "transparent" : backgroundColor,
    opacity: backgroundOpacity / 100,
    padding: "32px",
    minHeight: "600px",
  };

  const handleInputChange = (value: string) => {
    setUserName(value);

    if (onPropertyChange) {
      onPropertyChange("userInput", value);
    }
  };

  const handleContinue = () => {
    if (isValid) {
      console.log("✅ Usuário válido:", userName);
      // Aqui seria implementada a lógica de navegação
      if (onPropertyChange) {
        onPropertyChange("userInput", userName);
        onPropertyChange("completed", true);
      }
    }
  };

  return (
    <div
      id={id}
      className={`intro-block ${className} ${isEditing ? "editing-mode" : ""}`}
      style={containerStyle}
    >
      <div className="intro-content max-w-2xl mx-auto space-y-6">
        {/* Título */}
        <div className="text-center mb-6">
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: QUIZ_CONFIGURATION.design.secondaryColor }}
          >
            {title}
          </h1>

          {/* Descrição superior */}
          {descriptionTop && (
            <p className="text-lg mb-6" style={{ color: "#6B4F43" }}>
              {descriptionTop}
            </p>
          )}
        </div>

        {/* Imagem de introdução */}
        {imageIntro && (
          <div className="text-center mb-6">
            <img
              src={imageIntro}
              alt="Introdução do Quiz"
              className="mx-auto rounded-lg shadow-lg max-h-80 object-cover"
              style={{
                borderRadius: QUIZ_CONFIGURATION.design.card.borderRadius,
                boxShadow: QUIZ_CONFIGURATION.design.card.shadow,
              }}
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Descrição inferior */}
        {descriptionBottom && (
          <div className="text-center mb-8">
            <p className="text-base" style={{ color: "#6B4F43" }}>
              {descriptionBottom}
            </p>
          </div>
        )}

        {/* Card de entrada */}
        <Card
          className="p-6 border-2"
          style={{
            borderColor: QUIZ_CONFIGURATION.design.primaryColor + "30",
            backgroundColor: QUIZ_CONFIGURATION.design.card.background,
            borderRadius: QUIZ_CONFIGURATION.design.card.borderRadius,
            boxShadow: QUIZ_CONFIGURATION.design.card.shadow,
          }}
        >
          <div className="space-y-4">
            {/* Input de nome */}
            <div>
              {inputLabel && (
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: QUIZ_CONFIGURATION.design.secondaryColor }}
                >
                  {inputLabel}
                </label>
              )}
              <Input
                value={userName}
                onChange={e => handleInputChange(e.target.value)}
                placeholder={inputPlaceholder}
                className={`text-base p-3 ${!isValid && userName.length > 0 ? "border-red-400" : ""}`}
                style={{
                  borderColor: isValid ? QUIZ_CONFIGURATION.design.primaryColor + "50" : "#ef4444",
                  fontSize: "16px", // Evita zoom no iOS
                }}
                required={required}
              />

              {/* Mensagem de erro */}
              {!isValid && userName.length > 0 && introStep.validation && (
                <div className="mt-2">
                  <Badge variant="destructive" className="text-xs">
                    {introStep.validation.errorMessage}
                  </Badge>
                </div>
              )}
            </div>

            {/* Botão de continuar */}
            <div className="pt-2">
              <Button
                onClick={handleContinue}
                disabled={!isValid || !userName}
                className="w-full p-3 text-base font-medium transition-all duration-200"
                style={{
                  background:
                    isValid && userName ? QUIZ_CONFIGURATION.design.button.background : "#d1d5db",
                  color: QUIZ_CONFIGURATION.design.button.textColor,
                  borderRadius: QUIZ_CONFIGURATION.design.button.borderRadius,
                  boxShadow: isValid && userName ? QUIZ_CONFIGURATION.design.button.shadow : "none",
                }}
              >
                {buttonText || `Continuar ${userName ? `como ${userName}` : ""}`}
              </Button>
            </div>

            {/* Texto de privacidade */}
            {privacyText && (
              <div className="text-center pt-2">
                <p className="text-xs opacity-70" style={{ color: "#6B4F43" }}>
                  {privacyText}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Footer */}
        {footerText && (
          <div className="text-center pt-6">
            <p className="text-xs opacity-60" style={{ color: "#6B4F43" }}>
              {footerText}
            </p>
          </div>
        )}
      </div>

      {/* Modo de edição */}
      {isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-5 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Badge
              variant="outline"
              style={{ borderColor: QUIZ_CONFIGURATION.design.primaryColor }}
            >
              Bloco de Introdução - Etapa 1
            </Badge>
            <div className="text-xs mt-2" style={{ color: "#6B4F43" }}>
              {title} • {userName ? `Usuário: ${userName}` : "Nome não preenchido"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
