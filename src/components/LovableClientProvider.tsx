import React, { useEffect, useState } from 'react';

interface LovableProviderProps {
  children: React.ReactNode;
}

export function LovableClientProvider({ children }: LovableProviderProps) {
  const [isEditorMode, setIsEditorMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const isEditor =
          window.location.pathname.includes('/admin') ||
          window.location.pathname === '/' ||
          window.location.pathname.startsWith('/dashboard') ||
          window.location.pathname.startsWith('/editor') ||
          window.location.pathname.startsWith('/resultado/') ||
          window.location.search.includes('lovable=true');

        setIsEditorMode(isEditor);

        if (isEditor) {
          (window as any).LOVABLE_CONFIG = {
            projectId: '65efd17d-5178-405d-9721-909c97470c6d',
            apiBaseUrl: 'https://api.lovable.dev',
          };

          return () => {
            try {
              delete (window as any).LOVABLE_CONFIG;
            } catch (error) {
              console.warn('Error cleaning up Lovable config:', error);
            }
          };
        }
      } catch (error) {
        console.warn('Error setting up Lovable config:', error);
        setIsEditorMode(false);
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
