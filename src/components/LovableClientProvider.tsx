import React, { useEffect, useState } from 'react';

interface LovableProviderProps {
  children: React.ReactNode;
}

export function LovableClientProvider({ children }: LovableProviderProps) {
  const [isEditorMode, setIsEditorMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isEditor =
        window.location.pathname.includes('/admin') ||
        window.location.pathname === '/' ||
        window.location.pathname.startsWith('/dashboard') ||
        window.location.pathname.startsWith('/resultado/') ||
        window.location.search.includes('lovable=true');

      setIsEditorMode(isEditor);

      if (isEditor) {
        (window as any).LOVABLE_CONFIG = {
          projectId: 'quiz-sell-genius',
          apiBaseUrl: 'https://api.lovable.dev',
        };

        return () => {
          delete (window as any).LOVABLE_CONFIG;
        };
      }
    }
  }, []);

  return (
    <div
      className={isEditorMode ? 'lovable-editable-page' : ''}
      data-lovable-root={isEditorMode ? 'true' : undefined}
    >
      {children}
    </div>
  );
}
