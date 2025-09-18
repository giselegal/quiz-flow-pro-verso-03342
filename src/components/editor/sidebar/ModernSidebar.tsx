/**
 * 🎯 MODERN SIDEBAR - BARRA LATERAL COM DRAG & DROP
 *
 * Sidebar moderna com componentes arrastavéis para o editor
 */

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  CheckCircle2,
  FileText,
  Image,
  List,
  MousePointer2,
  PieChart,
  Radio,
  Shuffle,
  Star,
  TextCursorInput,
  Type,
} from 'lucide-react';
import React from 'react';
import { DraggableComponentItem } from '../dnd/DraggableComponentItem';

// ========================================
// COMPONENTES DISPONÍVEIS
// ========================================
const componentCategories = [
  {
    id: 'quiz',
    label: 'Componentes Quiz',
    components: [
      {
        type: 'quiz-question',
        icon: <TextCursorInput size={20} />,
        label: 'Pergunta Quiz',
        description: 'Pergunta com múltiplas opções de resposta',
      },
      {
        type: 'quiz-options',
        icon: <Radio size={20} />,
        label: 'Opções de Resposta',
        description: 'Lista de alternativas para quiz',
      },
      {
        type: 'quiz-result',
        icon: <CheckCircle2 size={20} />,
        label: 'Resultado Quiz',
        description: 'Exibição de resultados e pontuação',
      },
      {
        type: 'quiz-progress',
        icon: <BarChart3 size={20} />,
        label: 'Progresso',
        description: 'Barra de progresso do quiz',
      },
    ],
  },
  {
    id: 'content',
    label: 'Conteúdo',
    components: [
      {
        type: 'text-block',
        icon: <Type size={20} />,
        label: 'Bloco de Texto',
        description: 'Parágrafo ou texto formatado',
      },
      {
        type: 'heading',
        icon: <FileText size={20} />,
        label: 'Título',
        description: 'Cabeçalho ou título de seção',
      },
      {
        type: 'image',
        icon: <Image size={20} />,
        label: 'Imagem',
        description: 'Imagem com legenda opcional',
      },
      {
        type: 'list',
        icon: <List size={20} />,
        label: 'Lista',
        description: 'Lista com marcadores ou numerada',
      },
    ],
  },
  {
    id: 'interactive',
    label: 'Interativos',
    components: [
      {
        type: 'rating',
        icon: <Star size={20} />,
        label: 'Avaliação',
        description: 'Sistema de estrelas ou nota',
      },
      {
        type: 'poll',
        icon: <PieChart size={20} />,
        label: 'Enquete',
        description: 'Votação ou pesquisa rápida',
      },
      {
        type: 'randomizer',
        icon: <Shuffle size={20} />,
        label: 'Randomizador',
        description: 'Embaralhar opções ou perguntas',
      },
      {
        type: 'click-tracker',
        icon: <MousePointer2 size={20} />,
        label: 'Rastreador',
        description: 'Acompanhar cliques e interações',
      },
    ],
  },
];

// ========================================
// PROPS DA SIDEBAR
// ========================================
interface ModernSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

// ========================================
// COMPONENT
// ========================================
export const ModernSidebar: React.FC<ModernSidebarProps> = ({ className, isCollapsed = false }) => {
  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white border-r border-gray-200',
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-80',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <Type size={18} className="text-white" />
          </div>

          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-gray-900">Componentes</h2>
              <p className="text-xs text-gray-500">Arraste para adicionar</p>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {componentCategories.map((category, categoryIndex) => (
            <div key={category.id}>
              {/* Category Header */}
              {!isCollapsed && (
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{category.label}</h3>
                  {categoryIndex > 0 && <Separator className="mb-3" />}
                </div>
              )}

              {/* Components Grid */}
              <div
                className={cn('space-y-2', isCollapsed && 'flex flex-col items-center space-y-3')}
              >
                {category.components.map(component => (
                  <DraggableComponentItem
                    key={component.type}
                    blockType={component.type}
                    title={component.label}
                    description={isCollapsed ? undefined : component.description}
                    icon={component.icon}
                    category={category.label}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer com dicas */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
              <span className="font-medium">Dica:</span>
            </div>
            <p className="leading-relaxed">
              Arraste os componentes para o canvas para construir seu quiz interativo. Use as alças
              de arrastar para reordenar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernSidebar;
