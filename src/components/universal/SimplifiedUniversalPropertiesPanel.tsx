// Este é um componente simplificado para resolver problemas de compilação

const UniversalPropertiesPanel = ({ selectedBlock, onUpdate, onDelete, onClose }: any) => {
  return (
    <div>
      <h2>Propriedades do Componente</h2>
      {selectedBlock && (
        <div>
          <p>ID: {selectedBlock.id}</p>
          <p>Tipo: {selectedBlock.type}</p>
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
