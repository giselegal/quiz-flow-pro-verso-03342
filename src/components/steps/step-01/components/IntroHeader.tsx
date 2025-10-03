/**
 * 🏠 HEADER DA INTRODUÇÃO - COMPONENTE MODULAR
 * 
 * Componente independente responsável por renderizar o cabeçalho
 * da etapa de introdução com logo e título personalizáveis.
 */

import React from 'react';

interface IntroHeaderProps {
    title?: string;
    logo?: string;
    showGoldenBar?: boolean;
    isEditable?: boolean;
    onEdit?: (field: string, value: string) => void;
}

const IntroHeader: React.FC<IntroHeaderProps> = ({
    title = 'Chega de um guarda-roupa lotado e da sensação de que nada combina com você.',
    logo = 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png',
    showGoldenBar = true,
    isEditable = false,
    onEdit = () => { }
}) => {
    // Processar título com HTML quando necessário
    const isHtmlTitle = title.includes('<span') || title.includes('<strong');

    // Fallback para título padrão se vazio
    const safeTitle = title || 'Chega de um guarda-roupa lotado e da sensação de que nada combina com você.';

    return (
        <header className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-8 mx-auto">
            {/* Logo */}
            <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                    <img
                        src={logo}
                        alt="Logo Gisele Galvão"
                        className="h-auto mx-auto"
                        width={120}
                        height={50}
                        style={{
                            objectFit: 'contain',
                            maxWidth: '120px',
                            aspectRatio: '120 / 50',
                        }}
                    />

                    {/* Barra dourada */}
                    {showGoldenBar && (
                        <div
                            className="h-[3px] bg-[#B89B7A] rounded-full mt-1.5 mx-auto"
                            style={{
                                width: '300px',
                                maxWidth: '90%',
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Título principal */}
            <h1
                className="text-2xl font-bold text-center leading-tight px-2 sm:text-3xl md:text-4xl text-[#432818]"
                style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 400,
                }}
            >
                {isHtmlTitle ? (
                    <span dangerouslySetInnerHTML={{ __html: safeTitle }} />
                ) : (
                    // Versão padrão com spans coloridos
                    <>
                        <span style={{ color: '#B89B7A', fontWeight: 700 }}>Chega</span> de um guarda-roupa lotado e da sensação de que{' '}
                        <span style={{ color: '#B89B7A', fontWeight: 700 }}>nada combina com você</span>.
                    </>
                )}
            </h1>
        </header>
    );
};

export default IntroHeader;
