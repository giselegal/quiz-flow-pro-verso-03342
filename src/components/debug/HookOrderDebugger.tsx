import React, { useRef, useEffect } from 'react';

interface HookOrderDebuggerProps {
  componentName: string;
  hookCalls: string[];
  enabled?: boolean;
}

/**
 * 🔍 DEBUGGER PARA ORDEM DE HOOKS
 * 
 * Componente para detectar violações da "Rules of Hooks"
 * Monitora a ordem das chamadas de hooks para identificar problemas
 */
export const HookOrderDebugger: React.FC<HookOrderDebuggerProps> = ({
  componentName,
  hookCalls,
  enabled = process.env.NODE_ENV === 'development'
}) => {
  const renderCount = useRef(0);
  const previousHookCalls = useRef<string[]>([]);
  
  useEffect(() => {
    if (!enabled) return;
    
    renderCount.current += 1;
    
    // Comparar ordem dos hooks com render anterior
    if (renderCount.current > 1) {
      const currentOrder = hookCalls.join('|');
      const previousOrder = previousHookCalls.current.join('|');
      
      if (currentOrder !== previousOrder) {
        console.error('🚨 HOOK ORDER VIOLATION DETECTED!', {
          component: componentName,
          renderCount: renderCount.current,
          previousOrder,
          currentOrder,
          hookCalls,
          previousHookCalls: previousHookCalls.current
        });
        
        // Identificar qual hook mudou
        const changes: string[] = [];
        hookCalls.forEach((hook, index) => {
          if (previousHookCalls.current[index] !== hook) {
            changes.push(`Position ${index}: ${previousHookCalls.current[index]} -> ${hook}`);
          }
        });
        
        if (changes.length > 0) {
          console.error('Hook changes detected:', changes);
        }
      }
    }
    
    previousHookCalls.current = [...hookCalls];
  }, [componentName, hookCalls, enabled]);
  
  // Log render info no desenvolvimento
  useEffect(() => {
    if (enabled) {
      console.log(`🔍 ${componentName} render #${renderCount.current}:`, {
        hookCount: hookCalls.length,
        hooks: hookCalls
      });
    }
  });
  
  return null; // Componente invisível
};

export default HookOrderDebugger;