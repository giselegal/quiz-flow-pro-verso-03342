interface PropertiesPanelProps {
  selectedComponent?: any;
  selectedBlock?: any;
  onUpdate?: (updates: any) => void;
  onDelete?: () => void;
  onClose?: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  selectedBlock,
  onDelete,
  onClose,
}) => {
  const target = selectedBlock || selectedComponent;

  return (
    <div className="properties-panel">
      <h3>Propriedades</h3>
      {target ? (
        <div>
          <p>Editando: {target.type}</p>
          {/* Implementar controles de propriedades */}
          {onClose && <button onClick={onClose}>Fechar</button>}
          {onDelete && <button onClick={onDelete}>Excluir</button>}
        </div>
      ) : (
        <p>Selecione um componente para editar</p>
      )}
    </div>
  );
};

export default PropertiesPanel;
