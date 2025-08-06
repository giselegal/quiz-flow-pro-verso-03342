import React from "react";
import { blockDefinitions } from "@/config/blockDefinitions";

interface ComponentsPanelProps {
  onAddComponent: (type: string) => void;
}

export const ComponentsPanel: React.FC<ComponentsPanelProps> = ({ onAddComponent }) => {
  return (
    <div className="bg-white border-r border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Componentes</h3>
      <div className="space-y-2">
        {blockDefinitions.map(block => {
          const IconComponent = block.icon;
          return (
            <button
              key={block.type}
              onClick={() => onAddComponent(block.type)}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <IconComponent size={20} />
              <div>
                <div className="font-medium text-sm text-gray-900">{block.name}</div>
                <div className="text-xs text-gray-500">{block.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
