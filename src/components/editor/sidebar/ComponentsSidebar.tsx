// @ts-nocheck
import { Button } from '@/components/ui/button';

interface ComponentsSidebarProps {
  onComponentSelect: (type: string) => void;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
export const getMarginClass = (value, type) => {
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

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ onComponentSelect }) => {
  const components = [
    { type: 'text-inline', label: 'Texto' },
    { type: 'heading', label: 'Cabeçalho' },
    { type: 'image-display-inline', label: 'Imagem' },
    { type: 'button-inline', label: 'Botão' },
    { type: 'lead-form', label: 'Formulário Lead' },
    { type: 'quiz-intro-header', label: 'Cabeçalho Quiz' },
    { type: 'form-input', label: 'Campo de Entrada' },
  ];

  return (
    <div className="h-full p-4" style={{ backgroundColor: '#FAF9F7' }}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Componentes</h3>
      <div className="space-y-2">
        {components.map(component => (
          <Button
            key={component.type}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onComponentSelect(component.type)}
          >
            {component.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ComponentsSidebar;
