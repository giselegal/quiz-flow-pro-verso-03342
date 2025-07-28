import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FunnelStepProps } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  onEdit
}) => {
  const {
    title = 'Como podemos te chamar?',
    description = 'Para personalizar sua experiência, gostaríamos de saber seu nome:',
    buttonText = 'Continuar',
    placeholder = 'Digite seu nome aqui',
    imageUrl,
    backgroundColor = 'bg-white'
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
      className={cn(
        "min-h-screen flex items-center justify-center p-6",
        backgroundColor,
        className
      )}
      onClick={isEditable ? onEdit : undefined}
      data-funnel-step-id={id}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4">
          {/* Barra de progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progresso</span>
              <span>{stepNumber} de {totalSteps}</span>
            </div>
            <Progress 
              percent={(stepNumber / totalSteps) * 100} 
              className="w-full"
              showInfo={false}
            />
          </div>

          {/* Imagem (se fornecida) */}
          {imageUrl && (
            <div className="flex justify-center">
              <img 
                src={imageUrl} 
                alt="" 
                className="h-24 w-24 object-contain rounded-lg"
              />
            </div>
          )}

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-gray-600">
              {description}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                type="text"
                placeholder={placeholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
                disabled={isEditable}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#B89B7A] hover:bg-[#A38967]"
              disabled={isEditable}
            >
              {buttonText}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Indicador de edição */}
      {isEditable && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">
          Modo de Edição
        </div>
      )}
    </div>
  );
};

export default NameCollectStep;
