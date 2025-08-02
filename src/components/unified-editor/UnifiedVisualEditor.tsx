
import React from 'react';

interface UnifiedVisualEditorProps {
  onSave?: (data: any) => void;
  initialData?: any;
}

export const UnifiedVisualEditor: React.FC<UnifiedVisualEditorProps> = ({ 
  onSave, 
  initialData 
}) => {
  return (
    <div className="unified-visual-editor">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Unified Visual Editor</h2>
        <p className="text-muted-foreground">Editor visual unificado em desenvolvimento...</p>
      </div>
    </div>
  );
};

export default UnifiedVisualEditor;
