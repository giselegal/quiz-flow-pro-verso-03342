/**
 * 🎯 BLOCO ATÔMICO: CTA do Resultado
 * Usado no step 20 para call-to-action
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';
import { Button } from '@/components/ui/button';

export default function ResultCTABlock({
  properties,
  content,
  onPropertyChange,
}: UnifiedBlockComponentProps) {
  const text = content?.text || properties?.text || 'Descobrir Minha Consultoria Personalizada';
  const variant = properties?.variant || 'default';
  const size = properties?.size || 'lg';
  const marginTop = properties?.marginTop || '8';
  const action = properties?.action || 'navigate';
  const targetUrl = properties?.targetUrl || '/consultoria';

  const handleClick = () => {
    if (action === 'navigate' && targetUrl) {
      window.location.href = targetUrl;
    } else if (action === 'custom' && onPropertyChange) {
      onPropertyChange('clicked', true);
    }
  };

  return (
    <div className={`flex justify-center mt-${marginTop}`}>
      <Button
        variant={variant as any}
        size={size as any}
        onClick={handleClick}
        className="transition-all duration-200"
      >
        {text}
      </Button>
    </div>
  );
}
