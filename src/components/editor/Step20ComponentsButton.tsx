import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEditor } from '@/components/editor/EditorProvider';
import { BlockType } from '@/types/editor';
import { Trophy, User, Palette, Target, Star, Heart, Award } from 'lucide-react';

interface Step20Component {
  type: BlockType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const step20Components: Step20Component[] = [
  {
    type: 'step20-result-header',
    title: 'Header Comemorativo',
    description: 'Cabeçalho com parabéns e ícones',
    icon: <Trophy className="w-5 h-5" />,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    type: 'step20-user-greeting',
    title: 'Saudação Pessoal',
    description: 'Saudação com nome do usuário',
    icon: <User className="w-5 h-5" />,
    color: 'from-blue-500 to-purple-500'
  },
  {
    type: 'step20-style-reveal',
    title: 'Revelação do Estilo',
    description: 'Mostra o estilo descoberto',
    icon: <Palette className="w-5 h-5" />,
    color: 'from-pink-500 to-rose-500'
  },
  {
    type: 'step20-compatibility',
    title: 'Indicador Compatibilidade',
    description: 'Percentual animado de compatibilidade',
    icon: <Target className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    type: 'step20-secondary-styles',
    title: 'Estilos Secundários',
    description: 'Grid com estilos complementares',
    icon: <Star className="w-5 h-5" />,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    type: 'step20-personalized-offer',
    title: 'Oferta Personalizada',
    description: 'CTA baseado no resultado',
    icon: <Heart className="w-5 h-5" />,
    color: 'from-red-500 to-pink-500'
  }
];

export const Step20ComponentsButton: React.FC = () => {
  const { state, actions } = useEditor();

  // Detectar se estamos na etapa 20
  const isStep20 = state.currentStep === 20 ||
                   window.location.pathname.includes('step20') ||
                   window.location.pathname.includes('step-20');

  // Só mostrar na etapa 20
  if (!isStep20) {
    return null;
  }

  const handleAddComponent = async (type: BlockType) => {
    try {
      const stepKey = `step-${state.currentStep}`;
      const newBlock = {
        id: `${type}-${Date.now()}`,
        type,
        order: 0,
        content: {},
        properties: {},
      };
      await actions.addBlock(stepKey, newBlock);
    } catch (error) {
      console.error('Erro ao adicionar componente Step 20:', error);
    }
  };

  const handleAddCompleteTemplate = async () => {
    try {
      const stepKey = `step-${state.currentStep}`;
      const templateBlock = {
        id: `step20-complete-template-${Date.now()}`,
        type: 'step20-complete-template' as BlockType,
        order: 0,
        content: {},
        properties: {},
      };
      await actions.addBlock(stepKey, templateBlock);
    } catch (error) {
      console.error('Erro ao adicionar template completo Step 20:', error);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          Componentes Step 20
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Botão para template completo */}
        <Button
          onClick={handleAddCompleteTemplate}
          className="w-full justify-start gap-2 h-auto p-3 bg-gradient-to-r from-primary to-primary/80"
        >
          <Award className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Template Completo</div>
            <div className="text-xs opacity-90">Todos os componentes de uma vez</div>
          </div>
        </Button>

        {/* Separador */}
        <div className="text-xs text-muted-foreground text-center py-1">
          Ou adicione componentes individuais:
        </div>

        {/* Componentes individuais */}
        <div className="grid grid-cols-2 gap-2">
          {step20Components.map((component) => (
            <Button
              key={component.type}
              onClick={() => handleAddComponent(component.type)}
              variant="outline"
              className="h-auto p-2 flex flex-col items-center gap-1 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${component.color} opacity-10`} />
              <div className="relative z-10 flex flex-col items-center gap-1">
                {component.icon}
                <div className="text-xs font-medium text-center leading-tight">
                  {component.title}
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Nota informativa */}
        <div className="text-xs text-muted-foreground text-center bg-muted/50 rounded p-2">
          💡 Estes componentes se conectam automaticamente aos dados do quiz
        </div>
      </CardContent>
    </Card>
  );
};