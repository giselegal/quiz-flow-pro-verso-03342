/**
 * 🎯 INTRO STEP 01 - HEADER
 * 
 * Componente separado do cabeçalho para a etapa 1
 * Inclui: Logo, botão voltar (opcional), barra de progresso (opcional)
 */

import React from 'react';

export interface IntroStep01HeaderProps {
    logoUrl?: string;
    logoAlt?: string;
    logoWidth?: number;
    logoHeight?: number;
    showBackButton?: boolean;
    onBack?: () => void;
    showProgressBar?: boolean;
    progressValue?: number;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

export const IntroStep01_Header: React.FC<IntroStep01HeaderProps> = ({
    logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt = 'Logo Gisele Galvão',
    logoWidth = 96,
    logoHeight = 96,
    showBackButton = false,
    onBack,
    showProgressBar = false,
    progressValue = 0,
    isEditable = false,
    onEdit
}) => {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Botão Voltar (condicional) */}
                    {showBackButton && (
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Voltar"
                        >
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    )}

                    {/* Logo */}
                    <div
                        className={`flex items-center ${showBackButton ? '' : 'mx-auto'}`}
                        data-editable={isEditable ? 'logoUrl' : undefined}
                        onClick={() => isEditable && onEdit?.('logoUrl', logoUrl)}
                    >
                        <img
                            src={logoUrl}
                            alt={logoAlt}
                            width={logoWidth}
                            height={logoHeight}
                            className="object-contain"
                            style={{
                                width: `${logoWidth}px`,
                                height: `${logoHeight}px`,
                                cursor: isEditable ? 'pointer' : 'default'
                            }}
                        />
                    </div>

                    {/* Espaçador para centralizar logo quando não há botão */}
                    {showBackButton && <div className="w-9" />}
                </div>

                {/* Barra de Progresso (condicional) */}
                {showProgressBar && (
                    <div className="mt-3">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#B89B7A] to-[#D4AF7A] transition-all duration-500 ease-out"
                                style={{ width: `${progressValue}%` }}
                                role="progressbar"
                                aria-valuenow={progressValue}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-1">
                            {progressValue}% completo
                        </p>
                    </div>
                )}
            </div>
        </header>
    );
};

export default IntroStep01_Header;
