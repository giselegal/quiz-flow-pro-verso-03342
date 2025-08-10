import React from "react";

export type EditorTab = "quiz" | "result" | "sales";

interface UnifiedVisualEditorProps {
  onSave?: (data: any) => void;
  initialData?: any;
  primaryStyle?: any;
  initialActiveTab?: EditorTab;
}

export const UnifiedVisualEditor: React.FC<UnifiedVisualEditorProps> = ({
  onSave,
  initialData,
  primaryStyle,
  initialActiveTab = "quiz",
}) => {
  return (
    <div className="unified-visual-editor">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Unified Visual Editor</h2>
        <p className="text-muted-foreground">Editor visual unificado em desenvolvimento...</p>
        <p style={{ color: '#8B7355' }}>
          Active Tab: {initialActiveTab} | Primary Style: {primaryStyle?.category || "None"}
        </p>
      </div>
    </div>
  );
};

export default UnifiedVisualEditor;
