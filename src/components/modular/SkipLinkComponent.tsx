'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkComponentProps {
  target?: string;
  text?: string;
  className?: string;
  isEditable?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * SkipLinkComponent - Componente modular para acessibilidade
 * 
 * Características:
 * - Skip link para navegação por teclado
 * - Invisível até receber foco
 * - Configuração flexível de destino
 * - Totalmente editável
 */
const SkipLinkComponent: React.FC<SkipLinkComponentProps> = ({
  target = "#quiz-form",
  text = "Pular para o formulário",
  className = "",
  isEditable = false,
  onPropertyChange: _onPropertyChange,
}) => {

  return (
    <>
      {/* Skip link para acessibilidade */}
      <a 
        href={target} 
        className={cn(
          "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50",
          "bg-white text-[#432818] px-4 py-2 rounded-md shadow-md",
          "focus:outline-none focus:ring-2 focus:ring-[#B89B7A]",
          className
        )}
        data-component="skip-link"
      >
        {text}
      </a>

      {/* Painel de edição (se editável) */}
      {isEditable && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Skip Link (Acessibilidade):</strong><br />
          <strong>Destino:</strong> {target}<br />
          <strong>Texto:</strong> {text}<br />
          <em>Invisível até receber foco por teclado</em>
        </div>
      )}
    </>
  );
};

export default SkipLinkComponent;