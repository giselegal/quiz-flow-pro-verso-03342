/**
 * 🚫 TIPOS DESATIVADOS - Lovable integration removed
 * 
 * Este arquivo de tipos foi mantido apenas para compatibilidade,
 * mas a integração com Lovable foi removida do projeto.
 * 
 * @deprecated Lovable integration has been disabled
 */

// Tipos vazios mantidos para compatibilidade
declare module '@lovable/react' {
  import React from 'react';
  export const LovableProvider: (props: { children: React.ReactNode }) => JSX.Element;
  export const EditorScript: () => JSX.Element;
  export const Editable: (props: { id: string; children: React.ReactNode }) => JSX.Element;
}

declare module '@lovable/editor' {
  // Empty module
}
