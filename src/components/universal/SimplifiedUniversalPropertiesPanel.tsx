// Este é um componente simplificado para resolver problemas de compilação
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
const UniversalPropertiesPanel = ({ selectedBlock, onUpdate, onDelete, onClose }: any) => {
  const { scrollRef } = useSyncedScroll({ source: 'properties' });

  const handleScaleChange = (value: number) => {
    if (!selectedBlock || !onUpdate) return;

    const currentProperties = selectedBlock.properties || {};
    const updatedProperties = {
      ...currentProperties,
      scale: value,
    };

    onUpdate(selectedBlock.id, { properties: updatedProperties });
  };

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto">
      <h2>Propriedades do Componente</h2>
      {selectedBlock && (
        <div>
          <p>ID: {selectedBlock.id}</p>
          <p>Tipo: {selectedBlock.type}</p>

          <div>
            <label>
              Tamanho Uniforme: {selectedBlock.properties?.scale || 100}%
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={selectedBlock.properties?.scale || 100}
                onChange={e => handleScaleChange(Number(e.target.value))}
              />
            </label>
          </div>

          <button onClick={() => onUpdate?.(selectedBlock.id, {})}>Atualizar</button>
          <button onClick={() => onDelete?.(selectedBlock.id)}>Excluir</button>
          <button onClick={() => onClose?.()}>Fechar</button>
        </div>
      )}
    </div>
  );
};

// Exportação padrão
export default UniversalPropertiesPanel;
