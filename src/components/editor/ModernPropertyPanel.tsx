import React from "react";

interface ModernPropertyPanelProps {
  selectedComponent?: any;
  selectedBlock?: any;
  onUpdate?: (updates: any) => void;
}

export const ModernPropertyPanel: React.FC<ModernPropertyPanelProps> = ({
  selectedComponent,
  selectedBlock,
  onUpdate,
}) => {
  const target = selectedBlock || selectedComponent;

  return (
    <div className="modern-property-panel">
      <h3>Propriedades</h3>
      {target ? (
        <div>
          <p>Componente selecionado: {target.type}</p>
          {/* Implementar propriedades aqui */}
        </div>
      ) : (
        <p>Selecione um componente para editar suas propriedades</p>
      )}
    </div>
  );
};

export default ModernPropertyPanel;
