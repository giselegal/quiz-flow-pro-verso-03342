
import { blockDefinitions } from '@/config/blockDefinitions';

interface ComponentsPanelProps {
  onAddComponent: (type: string) => void;
}

export // Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value: any, type: any): string => {
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

const ComponentsPanel: React.FC<ComponentsPanelProps> = ({ onAddComponent }) => {
  return (
    <div style={{ borderColor: '#E5DDD5' }}>
      <h3 style={{ color: '#432818' }}>Componentes</h3>
      <div className="space-y-2">
        {blockDefinitions.map(block => {
          const IconComponent = block.icon;
          return (
            <button
              key={block.type}
              onClick={() => onAddComponent(block.type)}
              style={{ borderColor: '#E5DDD5' }}
            >
              <IconComponent size={20} />
              <div>
                <div style={{ color: '#432818' }}>{block.name}</div>
                <div style={{ color: '#8B7355' }}>{block.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
