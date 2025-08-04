import React from "react";
import { EnhancedEditorLayout } from "../enhanced-editor/EnhancedEditorLayout";

interface EnhancedEditorProps {
  funnelId?: string;
}

const EnhancedEditor: React.FC<EnhancedEditorProps> = ({ funnelId }) => {
  return <EnhancedEditorLayout />;
};

export default EnhancedEditor;
