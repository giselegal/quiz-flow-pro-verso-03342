/**
 * 🏠 INTRO STEP 01 - MAIN COMPONENT
 * 
 * Componente principal que integra todos os sub-componentes da etapa 1
 * Versão modular e editável para o editor /editor?template=quiz-estilo
 */

import React from 'react';
import IntroStep01_Header from './IntroStep01_Header';
import IntroStep01_Title from './IntroStep01_Title';
import IntroStep01_Image from './IntroStep01_Image';
import IntroStep01_Description from './IntroStep01_Description';
import IntroStep01_Form from './IntroStep01_Form';

export interface IntroStep01MainProps {
    // Dados do step
    data?: {
        // Header
        logoUrl?: string;
        logoAlt?: string;
        logoWidth?: number;
        logoHeight?: number;
        showBackButton?: boolean;
        showProgressBar?: boolean;
        progressValue?: number;

        // Title
        title?: string;
        titleColor?: string;
        titleAccentColor?: string;
        titleFontSize?: string;
        titleFontFamily?: string;
        titleAlign?: 'left' | 'center' | 'right';

        // Image
        imageUrl?: string;
        imageAlt?: string;
        imageMaxWidth?: number;
        imageMaxHeight?: number;
        imageAspectRatio?: string;
        imageObjectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
        showImageShadow?: boolean;
        imageBorderRadius?: string;

        // Description
        description?: string;
        descriptionHtml?: string;
        descriptionColor?: string;
        descriptionAccentColor?: string;
        descriptionFontSize?: string;
        descriptionAlign?: 'left' | 'center' | 'right';
        descriptionMaxWidth?: string;

        // Form
        formQuestion?: string;
        inputPlaceholder?: string;
        inputLabel?: string;
        buttonText?: string;
        required?: boolean;
        buttonColor?: string;
        buttonTextColor?: string;
        inputBorderColor?: string;

        // Background
        backgroundColor?: string;
    };

    // Callbacks
    onNameSubmit?: (name: string) => void;
    onBack?: () => void;

    // Editor mode
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

export const IntroStep01_Main: React.FC<IntroStep01MainProps> = ({
    data = {},
    onNameSubmit,
    onBack,
    isEditable = false,
    onEdit
}) => {
    // Extrair dados com fallbacks
    const {
        // Header
        logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt = 'Logo Gisele Galvão',
        logoWidth = 96,
        logoHeight = 96,
        showBackButton = false,
        showProgressBar = false,
        progressValue = 0,

        // Title
        title = '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você</span>.',
        titleColor = '#432818',
        titleAccentColor = '#B89B7A',
        titleFontSize = 'text-2xl sm:text-3xl md:text-4xl',
        titleFontFamily = '"Playfair Display", serif',
        titleAlign = 'center',

        // Image
        imageUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.png',
        imageAlt = 'Descubra seu estilo predominante',
        imageMaxWidth = 300,
        imageMaxHeight = 204,
        imageAspectRatio = '1.47',
        imageObjectFit = 'contain',
        showImageShadow = true,
        imageBorderRadius = 'rounded-lg',

        // Description
        description,
        descriptionHtml,
        descriptionColor = '#6B7280',
        descriptionAccentColor = '#B89B7A',
        descriptionFontSize = 'text-sm sm:text-base',
        descriptionAlign = 'center',
        descriptionMaxWidth = 'max-w-lg',

        // Form
        formQuestion = 'Como posso te chamar?',
        inputPlaceholder = 'Digite seu primeiro nome aqui...',
        inputLabel = 'NOME',
        buttonText = 'Quero Descobrir meu Estilo Agora!',
        required = true,
        buttonColor = '#B89B7A',
        buttonTextColor = '#FFFFFF',
        inputBorderColor = '#B89B7A',

        // Background
        backgroundColor = '#FAF9F7'
    } = data;

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor }}
        >
            {/* Header */}
            <IntroStep01_Header
                logoUrl={logoUrl}
                logoAlt={logoAlt}
                logoWidth={logoWidth}
                logoHeight={logoHeight}
                showBackButton={showBackButton}
                onBack={onBack}
                showProgressBar={showProgressBar}
                progressValue={progressValue}
                isEditable={isEditable}
                onEdit={onEdit}
            />

            {/* Main Content */}
            <main className="flex flex-col items-center justify-start py-8 space-y-8">
                {/* Title */}
                <IntroStep01_Title
                    title={title}
                    textColor={titleColor}
                    accentColor={titleAccentColor}
                    fontSize={titleFontSize}
                    fontFamily={titleFontFamily}
                    textAlign={titleAlign as any}
                    isEditable={isEditable}
                    onEdit={onEdit}
                />

                {/* Image */}
                <IntroStep01_Image
                    imageUrl={imageUrl}
                    imageAlt={imageAlt}
                    maxWidth={imageMaxWidth}
                    maxHeight={imageMaxHeight}
                    aspectRatio={imageAspectRatio}
                    objectFit={imageObjectFit as any}
                    showShadow={showImageShadow}
                    borderRadius={imageBorderRadius}
                    isEditable={isEditable}
                    onEdit={onEdit}
                />

                {/* Description */}
                <IntroStep01_Description
                    description={description}
                    descriptionHtml={descriptionHtml}
                    textColor={descriptionColor}
                    accentColor={descriptionAccentColor}
                    fontSize={descriptionFontSize}
                    textAlign={descriptionAlign as any}
                    maxWidth={descriptionMaxWidth}
                    isEditable={isEditable}
                    onEdit={onEdit}
                />

                {/* Form */}
                <IntroStep01_Form
                    formQuestion={formQuestion}
                    inputPlaceholder={inputPlaceholder}
                    inputLabel={inputLabel}
                    buttonText={buttonText}
                    required={required}
                    buttonColor={buttonColor}
                    buttonTextColor={buttonTextColor}
                    inputBorderColor={inputBorderColor}
                    onSubmit={onNameSubmit}
                    isEditable={isEditable}
                    onEdit={onEdit}
                />
            </main>

            {/* Footer (opcional) */}
            <footer className="py-6 text-center">
                <p className="text-xs text-gray-400">
                    © {new Date().getFullYear()} Gisele Galvão • Todos os direitos reservados
                </p>
            </footer>
        </div>
    );
};

export default IntroStep01_Main;
