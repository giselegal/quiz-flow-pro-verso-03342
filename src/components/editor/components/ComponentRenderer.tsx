import React from "react";

interface ComponentRendererProps {
  component: any;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (updates: any) => void;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected = false,
  onSelect,
  onUpdate,
}) => {
  return (
    <div className={`component-renderer ${isSelected ? "selected" : ""}`} onClick={onSelect}>
      <div className="p-4 border rounded">
        <p>Componente: {component?.type || "Desconhecido"}</p>
        {/* Implementar renderização real aqui */}
      </div>
    </div>
  );
};

export default ComponentRenderer;
