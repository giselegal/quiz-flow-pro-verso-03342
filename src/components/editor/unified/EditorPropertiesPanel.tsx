import React from 'react';

interface EditorPropertiesPanelProps {
  children?: React.ReactNode;
  title?: string;
}

export const EditorPropertiesPanel: React.FC<EditorPropertiesPanelProps> = ({
  children,
  title = "Properties"
}) => {
  return (
    <div className="editor-properties-panel bg-white border-l border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="properties-content">
        {children}
      </div>
    </div>
  );
};

export default EditorPropertiesPanel;