import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FunnelStepProps } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * NameCollectStep - Etapa 2: Coleta de nome do usuário
 *
 * Esta etapa coleta o nome do usuário para personalizar a experiência
 */
export const NameCollectStep: React.FC<FunnelStepProps> = ({
  id,
  className = '',
  isEditable = false,
  onNext,
  stepNumber,
  totalSteps,
  data = {},
  onEdit,
}) => {
  const {
    title = 'Como podemos te chamar?',
    description = 'Para personalizar sua experiência, gostaríamos de saber seu nome:',
    buttonText = 'Continuar',
    placeholder = 'Digite seu nome aqui',
    imageUrl,
    backgroundColor = 'bg-white',
  } = data;

  // No modo de visualização, usamos estado real
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Função para validar e avançar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditable) {
      if (!name.trim()) {
        setError('Por favor, digite seu nome');
        return;
      }

      // Limpar erro se existir
      setError('');

      // Avançar para próxima etapa
      if (onNext) {
        onNext();
      }
    }
  };

  return (
    <div
      className={cn('relative rounded-xl shadow-md p-8', backgroundColor, className)}
      onClick={isEditable ? onEdit : undefined}
      data-funnel-step-id={id}
    >
      <div className="max-w-md mx-auto">
        {/* Numeração da etapa */}
        <div style={{ color: '#8B7355' }}>
          Etapa {stepNumber} de {totalSteps}
        </div>

        {/* Imagem (se fornecida) */}
        {imageUrl && (
          <div className="mb-6 flex justify-center">
            <img src={imageUrl} alt="" className="h-24 w-24 object-contain" />
          </div>
        )}

        <h2 style={{ color: '#432818' }}>{title}</h2>

        <p style={{ color: '#6B4F43' }}>{description}</p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="sr-only">
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={placeholder}
                value={name}
                onChange={e => setName(e.target.value)}
                className={cn('w-full', error && 'border-red-500')}
                disabled={isEditable}
              />
              {error && <p style={{ color: '#432818' }}>{error}</p>}
            </div>

            <Button type="submit" size="lg" className="w-full">
              {buttonText}
            </Button>
          </div>
        </form>
      </div>

      {/* Indicador de edição */}
      {isEditable && (
        <div className="absolute top-2 right-2 bg-[#B89B7A]/100 text-white text-xs px-2 py-1 rounded">
          Editar
        </div>
      )}
    </div>
  );
};

export default NameCollectStep;
