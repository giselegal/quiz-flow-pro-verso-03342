import React from 'react';
import { allBlockDefinitions, BlockDefinition } from '../../../config/blockDefinitions';
import DynamicBlockRenderer from '../../../components/DynamicBlockRenderer';
import { FunnelBlockRenderer } from '../FunnelBlockRenderer';
import { 
  Type, 
  Heading1, 
  Image, 
  RectangleHorizontal, 
  HelpCircle,
  Award,
  Play,
  Grid3x3,
  Crown,
  Palette,
  Clock,
  CircleDollarSign,
  MousePointer,
  TrendingUp,
  Package,
  BarChart3,
  Quote,
  Star,
  Minus,
  ArrowRightLeft,
  Rows3,
  Keyboard,
  Flag
} from 'lucide-react';

/**
 * Mapeamento de ícones para os tipos de bloco
 */
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'Type': Type,
  'Heading1': Heading1,
  'Image': Image,
  'RectangleHorizontal': RectangleHorizontal,
  'HelpCircle': HelpCircle,
  'Award': Award,
  'Play': Play,
  'Grid3x3': Grid3x3,
  'Crown': Crown,
  'Palette': Palette,
  'Clock': Clock,
  'CircleDollarSign': CircleDollarSign,
  'MousePointer': MousePointer,
  'TrendingUp': TrendingUp,
  'Package': Package,
  'BarChart3': BarChart3,
  'Quote': Quote,
  'Star': Star,
  'Minus': Minus,
  'ArrowRightLeft': ArrowRightLeft,
  'Rows3': Rows3,
  'Keyboard': Keyboard,
  '🏁': Flag
};

/**
 * Interface para componente de bloco no sidebar
 */
export interface BlockComponent {
  type: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  isPopular?: boolean;
  isPro?: boolean;
  preview?: string;
}

/**
 * Converte BlockDefinition para BlockComponent
 */
function blockDefinitionToComponent(definition: BlockDefinition): BlockComponent {
  const IconComponent = typeof definition.icon === 'string' 
    ? ICON_MAP[definition.icon] || Type
    : definition.icon || Type;

  return {
    type: definition.type,
    label: definition.name,
    description: definition.description,
    icon: IconComponent,
    category: definition.category || 'Outros',
    isPopular: false,
    isPro: false
  };
}

/**
 * Lista de todos os blocos disponíveis
 */
export const AVAILABLE_BLOCKS: BlockComponent[] = allBlockDefinitions.map(blockDefinitionToComponent);

/**
 * Categorias de blocos
 */
export const BLOCK_CATEGORIES = Array.from(
  new Set(allBlockDefinitions.map(def => def.category || 'Outros'))
).sort();

/**
 * Busca blocos por categoria
 */
export function getBlocksByCategory(category: string): BlockComponent[] {
  return AVAILABLE_BLOCKS.filter(block => block.category === category);
}

/**
 * Busca blocos populares
 */
export function getPopularBlocks(): BlockComponent[] {
  return AVAILABLE_BLOCKS.filter(block => block.isPopular);
}

/**
 * Busca blocos por termo
 */
export function searchBlocks(searchTerm: string): BlockComponent[] {
  const term = searchTerm.toLowerCase();
  return AVAILABLE_BLOCKS.filter(block =>
    block.label.toLowerCase().includes(term) ||
    block.description.toLowerCase().includes(term) ||
    block.category.toLowerCase().includes(term)
  );
}

/**
 * Verifica se um tipo é um bloco de funil
 */
function isFunnelBlock(type: string): boolean {
  return type.startsWith('funnel-') || [
    'name-collect-step',
    'question-multiple-step',
    'result-details-step',
    'offer-page-step',
    'result-card',
    'countdown-timer',
    'offer-card'
  ].includes(type);
}

/**
 * Interface para props do renderer
 */
interface ModularBlockRendererProps {
  block: {
    id: string;
    type: string;
    content?: any;
    properties?: any;
  };
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: any) => void;
  onSelect?: () => void;
  className?: string;
}

/**
 * Renderer modular que integra DynamicBlockRenderer e FunnelBlockRenderer
 */
export const ModularBlockRenderer: React.FC<ModularBlockRendererProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className
}) => {
  // Usar FunnelBlockRenderer para blocos de funil
  if (isFunnelBlock(block.type)) {
    return (
      <FunnelBlockRenderer
        block={{
          id: block.id,
          type: block.type,
          properties: block.properties || block.content || {}
        }}
        isEditable={isEditing}
        onEdit={onSelect}
        onDelete={() => {}}
      />
    );
  }

  // Usar DynamicBlockRenderer para outros blocos
  return (
    <DynamicBlockRenderer
      pageId="editor"
      blockId={block.id}
      fallback={
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          Componente não implementado: {block.type}
        </div>
      }
      className={className}
    />
  );
};

/**
 * Função para criar um bloco padrão baseado no tipo
 */
export function createDefaultBlock(type: string, id?: string): any {
  const definition = allBlockDefinitions.find(def => def.type === type);
  
  if (!definition) {
    return {
      id: id || `block-${Date.now()}`,
      type,
      content: {},
      properties: {}
    };
  }

  return {
    id: id || `block-${Date.now()}`,
    type,
    content: definition.defaultProperties || {},
    properties: definition.defaultProperties || {}
  };
}

export { };
