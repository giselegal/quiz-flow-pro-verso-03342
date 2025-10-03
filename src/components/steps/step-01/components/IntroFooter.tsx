/**
 * 📤 RODAPÉ DA INTRODUÇÃO
 * 
 * Componente simples para o rodapé com copyright.
 */

import React from 'react';

interface IntroFooterProps {
    copyrightText?: string;
    year?: number;
    className?: string;
}

const IntroFooter: React.FC<IntroFooterProps> = ({
    copyrightText = 'Gisele Galvão - Todos os direitos reservados',
    year = new Date().getFullYear(),
    className = 'w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mt-auto pt-6 text-center mx-auto'
}) => {
    return (
        <footer className={className}>
            <p className="text-xs text-gray-500">
                © {year} {copyrightText}
            </p>
        </footer>
    );
};

export default IntroFooter;
