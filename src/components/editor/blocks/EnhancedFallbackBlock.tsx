// @ts-nocheck
import { cn } from '@/lib/utils';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import type { BlockComponentProps } from '../../../types/blocks';

// Componente de fallback mais rico para componentes não implementados
export // Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const EnhancedFallbackBlock: React.FC<BlockComponentProps & { blockType: string }> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  blockType,
  className = '',
}) => {
  const getComponentInfo = (type: string) => {
    const componentMap: Record<
      string,
      { name: string; description: string; category: string; icon: string }
    > = {
      'section-divider': {
        name: 'Divisor de Seção',
        description: 'Linha divisória entre seções com estilo customizável',
        category: 'Layout',
        icon: '➖',
      },
      'flex-container-horizontal': {
        name: 'Container Flex Horizontal',
        description: 'Container flexbox para organizar elementos horizontalmente',
        category: 'Layout',
        icon: '↔️',
      },
      'flex-container-vertical': {
        name: 'Container Flex Vertical',
        description: 'Container flexbox para organizar elementos verticalmente',
        category: 'Layout',
        icon: '↕️',
      },
      'feature-highlight': {
        name: 'Destaque de Recurso',
        description: 'Card destacado para apresentar recursos importantes',
        category: 'Conteúdo',
        icon: '⭐',
      },
      'testimonial-card': {
        name: 'Card de Depoimento',
        description: 'Card individual para exibir depoimentos de clientes',
        category: 'Social Proof',
        icon: '💬',
      },
      'stats-counter': {
        name: 'Contador de Estatísticas',
        description: 'Números animados para exibir estatísticas importantes',
        category: 'Métricas',
        icon: '📊',
      },
      'progress-bar-modern': {
        name: 'Barra de Progresso Moderna',
        description: 'Barra de progresso com animações e estilo moderno',
        category: 'UI',
        icon: '📈',
      },
      'quiz-question-modern': {
        name: 'Questão Quiz Moderna',
        description: 'Componente de questão com design moderno e interativo',
        category: 'Quiz',
        icon: '❓',
      },
      'quiz-question-configurable': {
        name: 'Questão Quiz Configurável',
        description: 'Questão totalmente configurável com múltiplas opções',
        category: 'Quiz',
        icon: '⚙️',
      },
      'image-text-card': {
        name: 'Card Imagem + Texto',
        description: 'Card combinando imagem e texto de forma elegante',
        category: 'Conteúdo',
        icon: '🖼️',
      },
    };

    return (
      componentMap[type] || {
        name: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: 'Componente personalizado em desenvolvimento',
        category: 'Personalizado',
        icon: '🔧',
      }
    );
  };

  const info = getComponentInfo(blockType);

  return (
    <div
      className={cn(
        'border-2 border-dashed border-[#B89B7A]/40 bg-[#B89B7A]/10 rounded-lg p-6 text-center transition-all duration-200',
        'hover:border-orange-400 hover:bg-[#B89B7A]/20',
        isSelected && 'border-orange-500 bg-[#B89B7A]/20 ring-2 ring-orange-200',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Ícone e título */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-4xl">{info.icon}</div>
          <h3 className="text-lg font-semibold text-orange-900">{info.name}</h3>
          <Badge variant="outline" className="bg-[#B89B7A]/20 text-orange-800 border-[#B89B7A]/40">
            {info.category}
          </Badge>
        </div>

        {/* Descrição */}
        <p className="text-[#A38A69] text-sm max-w-md mx-auto">{info.description}</p>

        {/* Status de desenvolvimento */}
        <div className="bg-white rounded-md p-3 border border-orange-200">
          <div className="text-xs text-[#B89B7A] font-medium mb-1">🚧 Em Desenvolvimento</div>
          <div className="text-xs text-orange-500">
            Tipo: <code className="bg-[#B89B7A]/20 px-1 rounded">{blockType}</code>
          </div>
        </div>

        {/* Informações para o desenvolvedor */}
        <details className="text-left bg-white rounded-md border border-orange-200">
          <summary className="p-2 text-xs font-medium text-[#A38A69] cursor-pointer hover:bg-[#B89B7A]/10">
            🔍 Informações do Bloco
          </summary>
          <div className="p-3 border-t border-orange-200 text-xs text-[#B89B7A] space-y-1">
            <div>
              <strong>ID:</strong> {block.id}
            </div>
            <div>
              <strong>Tipo:</strong> {blockType}
            </div>
            <div>
              <strong>Propriedades:</strong>
            </div>
            <pre className="bg-[#B89B7A]/10 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(block.properties || {}, null, 2)}
            </pre>
          </div>
        </details>

        {/* Botão de configuração */}
        <Button
          variant="outline"
          size="sm"
          className="border-[#B89B7A]/40 text-[#A38A69] hover:bg-[#B89B7A]/20"
          onClick={e => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          📝 Configurar Propriedades
        </Button>
      </div>
    </div>
  );
};

export default EnhancedFallbackBlock;
