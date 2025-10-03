import React from 'react';

/**
 * 🎨 WRAPPER COM DESIGN DO /QUIZ-ESTILO
 * 
 * Layout base que replica o visual do quiz de produção
 * para usar no editor WYSIWYG
 */

interface QuizEstiloWrapperProps {
    children: React.ReactNode;
    showProgress?: boolean;
    progress?: number;
    showHeader?: boolean;
    className?: string;
}

export default function QuizEstiloWrapper({
    children,
    showProgress = false,
    progress = 0,
    showHeader = true,
    className = ""
}: QuizEstiloWrapperProps) {
    return (
        <div className={`min-h-screen bg-gradient-to-b from-white to-gray-50 ${className}`}>
            {/* Header com Logo */}
            {showHeader && (
                <header className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 py-8 mx-auto space-y-8">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="relative">
                            <img
                                src="https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png"
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
                            <div
                                className="h-[3px] bg-[#B89B7A] rounded-full mt-1.5 mx-auto"
                                style={{
                                    width: '300px',
                                    maxWidth: '90%',
                                }}
                            />
                        </div>
                    </div>
                </header>
            )}

            {/* Barra de Progresso */}
            {showProgress && (
                <div className="mb-6 max-w-6xl mx-auto px-4 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                            className="bg-[#deac6d] h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-center mb-4 text-gray-600">Progresso: {progress}%</p>
                </div>
            )}

            {/* Conteúdo Principal */}
            <main className="w-full max-w-6xl mx-auto px-4">
                {children}
            </main>

            {/* Rodapé */}
            <footer className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mt-auto pt-6 text-center mx-auto">
                <p className="text-xs text-gray-500">
                    © {new Date().getFullYear()} Gisele Galvão - Todos os direitos reservados
                </p>
            </footer>
        </div>
    );
}