/**
 * 🎯 EDITOR WRAPPER - Unificação com Error Boundary
 * 
 * Wrapper que integra o editor com sistema de recuperação de erros
 * e provider unificado para resolver conflitos de contexto.
 */

import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { EditorProvider } from './EditorProvider';
import { EditorLayout } from './EditorLayout';

export interface EditorWrapperProps {
  className?: string;
  funnelId?: string;
  quizId?: string;
  enableSupabase?: boolean;
  debugMode?: boolean;
}

/**
 * 🏗️ Editor Principal Consolidado
 * 
 * Integra todos os sistemas necessários:
 * - Error Boundary para recuperação
 * - Provider unificado 
 * - Layout responsivo
 * - Sistema de debugging
 */
export const EditorWrapper: React.FC<EditorWrapperProps> = ({
  className = '',
  funnelId = 'quiz-style-21-steps',
  quizId,
  enableSupabase = true,
  debugMode = false
}) => {
  return (
    <ErrorBoundary
      onError={(error: Error, errorInfo: any) => {
        if (debugMode) {
          console.error('🚨 Editor Error Captured:', { error, errorInfo });
        }
      }}
    >
      <EditorProvider
        funnelId={funnelId}
        quizId={quizId}
        enableSupabase={enableSupabase}
      >
        <div className={`editor-wrapper ${className}`}>
          <EditorLayout />
          
          {/* Debug Info */}
          {debugMode && (
            <div className="fixed bottom-4 left-4 z-50 bg-background/90 border rounded p-2 text-xs text-muted-foreground">
              <div>🔧 Debug Mode</div>
              <div>Funnel: {funnelId}</div>
              <div>Supabase: {enableSupabase ? '✅' : '❌'}</div>
            </div>
          )}
        </div>
      </EditorProvider>
    </ErrorBoundary>
  );
};

export default EditorWrapper;