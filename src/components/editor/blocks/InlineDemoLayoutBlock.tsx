// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import InlineBaseWrapper from './base/InlineBaseWrapper';
import InlineEditableText from './base/InlineEditableText';
import type { BlockComponentProps } from '@/types/blocks';
import {
  getPersonalizedText,
  trackComponentView,
  trackComponentClick,
  RESPONSIVE_PATTERNS,
  INLINE_ANIMATIONS,
} from '@/utils/inlineComponentUtils';
import {
  Layout,
  Monitor,
  Tablet,
  Smartphone,
  Grid,
  Columns,
  Eye,
  Star,
  Users,
  TrendingUp,
} from 'lucide-react';

/**
 * InlineDemoLayoutBlock - Demonstração completa de componentes lado a lado responsivos
 *
 * 🎯 DEMONSTRA LAYOUT HORIZONTAL INLINE:
 * - Componentes flexbox lado a lado
 * - Responsividade mobile-first
 * - Distribuição automática de espaço
 * - Quebra de linha inteligente
 * - Controle de alinhamento e gap
 */

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
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

const InlineDemoLayoutBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Layout Horizontal Responsivo',
    subtitle = 'Demonstração de componentes lado a lado',
    itemCount = 3,
    gap = 'md',
    alignment = 'center',
    breakpoint = 'md',
    showDevicePreview = true,
    animation = 'fadeIn',
    trackingEnabled = true,
  } = block?.properties || {};

  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    if (trackingEnabled) {
      trackComponentView(block.id, 'inline-demo-layout');
    }
  }, [trackingEnabled, block.id]);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const getResponsiveClasses = () => {
    const gapClasses = {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    };

    return cn(
      'flex flex-wrap',
      gapClasses[gap as keyof typeof gapClasses],
      'flex-col',
      `${breakpoint}:flex-row`
    );
  };

  const demoItems = Array.from({ length: itemCount }, (_, index) => ({
    id: index + 1,
    title: `Item ${index + 1}`,
    content: `Conteúdo do item ${index + 1}`,
    color: ['bg-[#B89B7A]/20', 'bg-green-100', 'bg-[#B89B7A]/20'][index % 3],
  }));

  const deviceClasses = {
    mobile: 'max-w-sm mx-auto',
    tablet: 'max-w-2xl mx-auto',
    desktop: 'max-w-none',
  };

  return (
    <InlineBaseWrapper
      block={block}
      isSelected={isSelected}
      onPropertyChange={onPropertyChange}
      className={cn(
        className,
        INLINE_ANIMATIONS[animation as keyof typeof INLINE_ANIMATIONS],
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      gap="lg"
      justify="start"
      align="stretch"
      direction="col"
      wrap={false}
      minHeight="15rem"
      trackingData={{
        componentName: 'InlineDemoLayoutBlock',
        category: 'demo',
        metadata: { itemCount, gap, breakpoint },
      }}
      editLabel="Editar Demo Layout"
    >
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Layout className="w-5 h-5 text-[#B89B7A]" />
            <InlineEditableText
              value={title}
              onChange={value => handlePropertyChange('title', value)}
              placeholder="Título da demonstração..."
              fontSize="xl"
              fontWeight="bold"
              style={{ color: '#432818' }}
            />
          </div>

          <InlineEditableText
            value={subtitle}
            onChange={value => handlePropertyChange('subtitle', value)}
            placeholder="Subtítulo explicativo..."
            fontSize="sm"
            style={{ color: '#6B4F43' }}
            multiline={true}
            maxLines={2}
          />
        </div>

        {/* Device Preview Controls */}
        {showDevicePreview && (
          <div style={{ backgroundColor: '#FAF9F7' }}>
            <span style={{ color: '#6B4F43' }}>Preview:</span>

            {['mobile', 'tablet', 'desktop'].map(device => (
              <button
                key={device}
                onClick={() => setActiveDevice(device as any)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200',
                  activeDevice === device
                    ? 'bg-[#B89B7A]/100 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                )}
              >
                {device === 'mobile' && <Smartphone className="w-4 h-4" />}
                {device === 'tablet' && <Tablet className="w-4 h-4" />}
                {device === 'desktop' && <Monitor className="w-4 h-4" />}
                <span className="capitalize">{device}</span>
              </button>
            ))}
          </div>
        )}

        {/* Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#B89B7A]/10 rounded-lg">
          <div>
            <label style={{ color: '#6B4F43' }}>Items</label>
            <select
              value={itemCount}
              onChange={e => handlePropertyChange('itemCount', parseInt(e.target.value))}
              style={{ borderColor: '#E5DDD5' }}
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>
                  {n} items
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ color: '#6B4F43' }}>Gap</label>
            <select
              value={gap}
              onChange={e => handlePropertyChange('gap', e.target.value)}
              style={{ borderColor: '#E5DDD5' }}
            >
              <option value="sm">Pequeno</option>
              <option value="md">Médio</option>
              <option value="lg">Grande</option>
            </select>
          </div>

          <div>
            <label style={{ color: '#6B4F43' }}>Breakpoint</label>
            <select
              value={breakpoint}
              onChange={e => handlePropertyChange('breakpoint', e.target.value)}
              style={{ borderColor: '#E5DDD5' }}
            >
              <option value="sm">sm</option>
              <option value="md">md</option>
              <option value="lg">lg</option>
            </select>
          </div>
        </div>

        {/* Demo Preview */}
        <div
          className={cn(
            'border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all duration-300',
            deviceClasses[activeDevice]
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 style={{ color: '#6B4F43' }}>
              Preview {activeDevice} ({itemCount} items)
            </h3>
            <div style={{ color: '#8B7355' }}>
              Gap: {gap} | Breakpoint: {breakpoint}
            </div>
          </div>

          <div className={getResponsiveClasses()}>
            {demoItems.map(item => (
              <div
                key={item.id}
                className={cn(
                  'flex-1 min-w-0 p-4 rounded-lg border border-gray-200 transition-all duration-200',
                  item.color,
                  'hover:shadow-md hover:scale-105'
                )}
                style={{
                  minWidth: activeDevice === 'mobile' ? '100%' : '200px',
                }}
              >
                <div className="space-y-2">
                  <div style={{ color: '#432818' }}>{item.title}</div>
                  <div style={{ color: '#6B4F43' }}>{item.content}</div>
                  <div style={{ color: '#8B7355' }}>
                    <Eye className="w-3 h-3" />
                    <span>Inline Block</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto">
          <div className="mb-2 text-gray-400">// Código CSS equivalente:</div>
          <div>{`.inline-container {`}</div>
          <div className="ml-4">{`display: flex;`}</div>
          <div className="ml-4">{`flex-wrap: wrap;`}</div>
          <div className="ml-4">{`gap: ${gap === 'sm' ? '0.5rem' : gap === 'md' ? '1rem' : '1.5rem'};`}</div>
          <div className="ml-4">{`flex-direction: column;`}</div>
          <div className="ml-4">{`/* ${breakpoint}+ */ flex-direction: row;`}</div>
          <div>{`}`}</div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
              <Grid className="w-4 h-4" />
              Vantagens
            </h4>
            <ul style={{ color: '#6B4F43' }}>
              <li>• Componentes lado a lado</li>
              <li>• Responsividade nativa</li>
              <li>• Distribuição inteligente</li>
              <li>• Fácil configuração</li>
            </ul>
          </div>

          <div className="p-4 bg-[#B89B7A]/10 rounded-lg">
            <h4 className="font-medium text-[#432818] mb-2 flex items-center gap-2">
              <Columns className="w-4 h-4" />
              Casos de Uso
            </h4>
            <ul className="text-sm text-[#A38A69] space-y-1">
              <li>• Cards de produtos</li>
              <li>• Seções de depoimentos</li>
              <li>• Galerias de imagens</li>
              <li>• Dashboards</li>
            </ul>
          </div>
        </div>
      </div>
    </InlineBaseWrapper>
  );
};

export default InlineDemoLayoutBlock;
