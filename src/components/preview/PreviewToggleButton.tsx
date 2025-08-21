import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePreview } from '@/context/PreviewContext';
import { Play, Square } from 'lucide-react';
import React from 'react';

interface PreviewToggleButtonProps {
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

export const PreviewToggleButton: React.FC<PreviewToggleButtonProps> = ({
  variant = 'full',
  className = '',
}) => {
  const { isPreviewing, togglePreview, currentStep, totalSteps } = usePreview();

  // Variante apenas ícone
  if (variant === 'icon') {
    return (
      <Button
        onClick={togglePreview}
        variant={isPreviewing ? 'default' : 'outline'}
        size="sm"
        className={`${className} ${isPreviewing ? 'bg-green-600 hover:bg-green-700' : ''}`}
      >
        {isPreviewing ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    );
  }

  // Variante apenas texto
  if (variant === 'text') {
    return (
      <Button
        onClick={togglePreview}
        variant={isPreviewing ? 'default' : 'outline'}
        className={`${className} ${isPreviewing ? 'bg-green-600 hover:bg-green-700' : ''}`}
      >
        {isPreviewing ? 'Parar Preview' : 'Iniciar Preview'}
      </Button>
    );
  }

  // Variante completa (padrão)
  return (
    <Card className={`p-2 shadow-lg bg-white/95 backdrop-blur-sm ${className}`}>
      <div className="flex flex-col space-y-2">
        <Button
          onClick={togglePreview}
          variant={isPreviewing ? 'default' : 'outline'}
          className={`flex items-center space-x-2 ${
            isPreviewing ? 'bg-green-600 hover:bg-green-700' : ''
          }`}
        >
          {isPreviewing ? (
            <>
              <Square className="h-4 w-4" />
              <span>Parar Preview</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Iniciar Preview</span>
            </>
          )}
        </Button>

        {isPreviewing && (
          <div className="text-xs text-center text-stone-600">
            Etapa {currentStep} de {totalSteps}
          </div>
        )}
      </div>
    </Card>
  );
};
