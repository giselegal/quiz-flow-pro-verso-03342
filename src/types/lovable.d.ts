declare module '@lovable/react' {
  import React from 'react';

  interface LovableProviderProps {
    children: React.ReactNode;
  }
  export const LovableProvider: (props: LovableProviderProps) => JSX.Element;

  // Assuming EditorScript takes no props
  export const EditorScript: () => JSX.Element;

  interface EditableProps {
    id: string;
    children: React.ReactNode;
  }
  export const Editable: (props: EditableProps) => JSX.Element;
}

declare module '@lovable/editor' {
  // Caso precise de APIs específicas do editor
}

// Estende o objeto Window para incluir propriedades do Lovable
interface LovableConfig {
  projectId: string;
  apiBaseUrl: string;
  authToken?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    LOVABLE_CONFIG?: LovableConfig;
  }
}
