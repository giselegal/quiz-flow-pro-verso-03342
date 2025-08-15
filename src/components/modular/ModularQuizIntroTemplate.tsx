'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import HeaderLogoComponent from './HeaderLogoComponent';
import TitleSectionComponent from './TitleSectionComponent';
import OptimizedImageComponent from './OptimizedImageComponent';
import DescriptionTextComponent from './DescriptionTextComponent';
import NameFormComponent from './NameFormComponent';
import FooterComponent from './FooterComponent';
import SkipLinkComponent from './SkipLinkComponent';

interface ModularQuizIntroTemplateProps {
  onStart?: (nome: string) => void;
  className?: string;
  isEditable?: boolean;
  onPropertyChange?: (componentId: string, key: string, value: any) => void;
  // Configurações personalizáveis para cada componente
  config?: {
    skipLink?: {
      target?: string;
      text?: string;
    };
    header?: {
      logoWidth?: number;
      logoHeight?: number;
      showGoldenBar?: boolean;
      goldenBarWidth?: string;
      alt?: string;
    };
    title?: {
      title?: string;
      highlightedWordsBefore?: string[];
      highlightedWordsAfter?: string[];
      titleColor?: string;
      highlightColor?: string;
      fontSize?: 'sm' | 'md' | 'lg' | 'xl';
    };
    image?: {
      imageUrl?: string;
      alt?: string;
      width?: number;
      height?: number;
      aspectRatio?: string;
      borderRadius?: string;
      showShadow?: boolean;
    };
    description?: {
      description?: string;
      highlightedPhrases?: Array<{
        text: string;
        color?: string;
        fontWeight?: string;
      }>;
      textColor?: string;
      fontSize?: 'sm' | 'base' | 'lg';
    };
    form?: {
      label?: string;
      placeholder?: string;
      buttonText?: string;
      buttonTextDisabled?: string;
      errorMessage?: string;
      primaryColor?: string;
      primaryDarkColor?: string;
    };
    footer?: {
      companyName?: string;
      year?: number;
      copyrightText?: string;
      textColor?: string;
    };
  };
}

/**
 * ModularQuizIntroTemplate - Template completo baseado no QuizIntro original
 * 
 * Características:
 * - Composição de componentes modulares independentes
 * - Cada componente editável individualmente
 * - Conectado com hooks e Supabase existentes
 * - Reproduz fielmente o layout do template original
 * - Totalmente configurável via props
 */
const ModularQuizIntroTemplate: React.FC<ModularQuizIntroTemplateProps> = ({
  onStart,
  className = "",
  isEditable = false,
  onPropertyChange,
  config = {},
}) => {

  const handlePropertyChange = (componentId: string, key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(componentId, key, value);
    }
  };

  return (
    <main
      className={cn(
        "flex flex-col items-center justify-start min-h-screen",
        "bg-gradient-to-b from-white to-gray-50 py-8",
        isEditable && "border-4 border-dashed border-blue-300",
        className
      )}
      data-section="intro"
      data-template="modular-quiz-intro"
    >
      {/* Skip Link para acessibilidade */}
      <SkipLinkComponent
        target={config.skipLink?.target}
        text={config.skipLink?.text}
        isEditable={isEditable}
        onPropertyChange={(key, value) => handlePropertyChange('skipLink', key, value)}
      />
      
      {/* Header com Logo */}
      <HeaderLogoComponent
        logoWidth={config.header?.logoWidth}
        logoHeight={config.header?.logoHeight}
        showGoldenBar={config.header?.showGoldenBar}
        goldenBarWidth={config.header?.goldenBarWidth}
        alt={config.header?.alt}
        isEditable={isEditable}
        onPropertyChange={(key, value) => handlePropertyChange('header', key, value)}
      />

      {/* Título Principal */}
      <TitleSectionComponent
        title={config.title?.title}
        highlightedWordsBefore={config.title?.highlightedWordsBefore}
        highlightedWordsAfter={config.title?.highlightedWordsAfter}
        titleColor={config.title?.titleColor}
        highlightColor={config.title?.highlightColor}
        fontSize={config.title?.fontSize}
        isEditable={isEditable}
        onPropertyChange={(key, value) => handlePropertyChange('title', key, value)}
      />

      {/* Seção Principal */}
      <section className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-6 md:space-y-8 mx-auto">
        {/* Imagem Principal Otimizada */}
        <OptimizedImageComponent
          imageUrl={config.image?.imageUrl}
          alt={config.image?.alt}
          width={config.image?.width}
          height={config.image?.height}
          aspectRatio={config.image?.aspectRatio}
          borderRadius={config.image?.borderRadius}
          showShadow={config.image?.showShadow}
          isEditable={isEditable}
          onPropertyChange={(key, value) => handlePropertyChange('image', key, value)}
        />

        {/* Texto Descritivo */}
        <DescriptionTextComponent
          description={config.description?.description}
          highlightedPhrases={config.description?.highlightedPhrases}
          textColor={config.description?.textColor}
          fontSize={config.description?.fontSize}
          isEditable={isEditable}
          onPropertyChange={(key, value) => handlePropertyChange('description', key, value)}
        />

        {/* Formulário de Nome */}
        <NameFormComponent
          label={config.form?.label}
          placeholder={config.form?.placeholder}
          buttonText={config.form?.buttonText}
          buttonTextDisabled={config.form?.buttonTextDisabled}
          errorMessage={config.form?.errorMessage}
          primaryColor={config.form?.primaryColor}
          primaryDarkColor={config.form?.primaryDarkColor}
          isEditable={isEditable}
          onStart={onStart}
          onPropertyChange={(key, value) => handlePropertyChange('form', key, value)}
        />
      </section>
      
      {/* Rodapé */}
      <FooterComponent
        companyName={config.footer?.companyName}
        year={config.footer?.year}
        copyrightText={config.footer?.copyrightText}
        textColor={config.footer?.textColor}
        isEditable={isEditable}
        onPropertyChange={(key, value) => handlePropertyChange('footer', key, value)}
      />

      {/* Indicador de Modo Edição */}
      {isEditable && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
          🛠️ Modo Edição Ativo
        </div>
      )}
    </main>
  );
};

export default ModularQuizIntroTemplate;