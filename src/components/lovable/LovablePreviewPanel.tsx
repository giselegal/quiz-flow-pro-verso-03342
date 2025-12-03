import React from 'react';

interface LovablePreviewPanelProps {
  children: React.ReactNode;
}

/**
 * 🚫 COMPONENTE DESATIVADO - Lovable integration removed
 * 
 * Este componente foi desativado como parte da remoção da integração
 * com a plataforma Lovable. Agora funciona apenas como um wrapper passthrough.
 * 
 * @deprecated Lovable integration has been disabled
 */
export const LovablePreviewPanel: React.FC<LovablePreviewPanelProps> = ({ children }) => {
  return <>{children}</>;
};

export default LovablePreviewPanel;
