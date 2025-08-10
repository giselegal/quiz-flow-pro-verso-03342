import React from "react";

interface PropertyPanelProps {
  selectedComponent?: any;
  onUpdate?: (updates: any) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onUpdate,
}) => {
  return (
    <div className="property-panel">
      <h3>Painel de Propriedades</h3>
      {selectedComponent ? (
        <div>
          <p>Editando: {selectedComponent.type}</p>
          {/* Propriedades do componente */}
        </div>
      ) : (
        <p>Nenhum componente selecionado</p>
      )}
    </div>
  );
};

export default PropertyPanel;
