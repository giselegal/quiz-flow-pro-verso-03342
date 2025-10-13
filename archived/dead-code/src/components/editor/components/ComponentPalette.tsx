// @ts-nocheck
export default function ComponentPalette() {
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

  const componentTypes = [
    { id: 'heading', label: 'Título', icon: '📝' },
    { id: 'paragraph', label: 'Parágrafo', icon: '📄' },
    { id: 'image', label: 'Imagem', icon: '🖼️' },
    { id: 'button', label: 'Botão', icon: '🔘' },
    { id: 'divider', label: 'Divisor', icon: '➖' },
    { id: 'container', label: 'Container', icon: '📦' },
  ];

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
  };
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Componentes</h3>
      <div className="space-y-2">
        {componentTypes.map(component => (
          <div
            key={component.id}
            draggable
            onDragStart={e => handleDragStart(e, component.id)}
            style={{ backgroundColor: '#FAF9F7' }}
          >
            <div className="flex items-center gap-2">
              <span>{component.icon}</span>
              <span>{component.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ color: '#8B7355' }}>
        💡 Arraste os componentes para o canvas para começar a editar
      </div>
    </div>
  );
}
