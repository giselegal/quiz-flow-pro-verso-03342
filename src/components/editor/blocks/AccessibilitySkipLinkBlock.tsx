import React from 'react';

interface AccessibilitySkipLinkProps {
    target?: string;
    text?: string;
    className?: string;
}

/**
 * Componente de link de pular para conteúdo principal
 * Melhora a acessibilidade permitindo que usuários de teclado pulem navegação
 */
const AccessibilitySkipLinkBlock: React.FC<AccessibilitySkipLinkProps> = ({
    target = '#main',
    text = 'Pular para o conteúdo principal',
    className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white px-4 py-2 rounded shadow-lg border-2 border-primary',
}) => {
    return (
        <a
            href={target}
            className={className}
            onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Focar no elemento para continuar navegação por teclado
                    (element as HTMLElement).focus();
                }
            }}
        >
            {text}
        </a>
    );
};

export default AccessibilitySkipLinkBlock;
