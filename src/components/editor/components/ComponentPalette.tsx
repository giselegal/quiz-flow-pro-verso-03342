export default function ComponentPalette() {
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
            onDragStart={(e) => handleDragStart(e, component.id)}
            className="cursor-move rounded border bg-white p-3 text-sm hover:bg-gray-50 hover:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span>{component.icon}</span>
              <span>{component.label}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 text-xs text-gray-500">
        💡 Arraste os componentes para o canvas para começar a editar
      </div>
    </div>
  );
}
