/**
 * 🎯 REAL EXPERIENCE TOGGLE - Controle para habilitar experiência real
 * 
 * Toggle para alternar entre preview mockado e experiência real
 * Usado no ModernUnifiedEditor para ativar QuizOrchestrator
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, User, CheckCircle, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RealExperienceToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  currentStep?: number;
  totalSteps?: number;
  userName?: string;
  className?: string;
}

export const RealExperienceToggle: React.FC<RealExperienceToggleProps> = ({
  isEnabled,
  onToggle,
  currentStep = 1,
  totalSteps = 21,
  userName,
  className = ''
}) => {
  return (
    <div className={cn(
      'bg-gradient-to-r border rounded-lg p-4',
      isEnabled 
        ? 'from-green-50 to-emerald-50 border-green-200' 
        : 'from-blue-50 to-indigo-50 border-blue-200',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            isEnabled ? 'bg-green-100' : 'bg-blue-100'
          )}>
            {isEnabled ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Target className="w-5 h-5 text-blue-600" />
            )}
          </div>
          
          <div>
            <h3 className={cn(
              'font-semibold',
              isEnabled ? 'text-green-800' : 'text-blue-800'
            )}>
              {isEnabled ? '🚀 Experiência Real Ativada' : '🎯 Experiência Real Disponível'}
            </h3>
            <p className={cn(
              'text-sm mt-1',
              isEnabled ? 'text-green-700' : 'text-blue-700'
            )}>
              {isEnabled 
                ? 'QuizOrchestrator • Validação funcional • Auto-advance • Resultados reais'
                : 'Ative para testar a experiência completa do usuário final'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isEnabled && (
            <>
              {userName && (
                <Badge variant="outline" className="text-green-700 border-green-300">
                  <User className="w-3 h-3 mr-1" />
                  {userName}
                </Badge>
              )}
              
              <Badge variant="outline" className="text-green-700 border-green-300">
                Step {currentStep}/{totalSteps}
              </Badge>
              
              <Badge variant="default" className="bg-green-600">
                <Brain className="w-3 h-3 mr-1" />
                IA Ativa
              </Badge>
            </>
          )}
          
          <Button
            variant={isEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => onToggle(!isEnabled)}
            className={cn(
              isEnabled && 'bg-green-600 hover:bg-green-700 border-green-600'
            )}
          >
            <Target className="w-4 h-4 mr-2" />
            {isEnabled ? 'Desativar' : 'Ativar'}
          </Button>
        </div>
      </div>
      
      {/* Informações técnicas quando ativado */}
      {isEnabled && (
        <div className="mt-4 pt-4 border-t border-green-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="text-green-800 font-medium">Componentes Ativos:</div>
              <div className="space-y-1 text-green-700">
                <div>✅ QuizOrchestrator</div>
                <div>✅ QuizDataPipeline</div>
                <div>✅ SmartNavigation</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-green-800 font-medium">Funcionalidades:</div>
              <div className="space-y-1 text-green-700">
                <div>✅ Validação funcional</div>
                <div>✅ Auto-advance inteligente</div>
                <div>✅ Cálculo de resultado real</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealExperienceToggle;