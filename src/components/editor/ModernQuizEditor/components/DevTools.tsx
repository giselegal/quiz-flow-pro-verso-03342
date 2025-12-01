/**
 * 🛠️ DEV TOOLS - PHASE 4
 * 
 * Development-only tools panel including:
 * - Accessibility auditor
 * - Performance metrics
 * - Debug options
 */

import React, { useState, memo } from 'react';
import { Shield, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Only render in development - check at module level
const isDev = process.env.NODE_ENV === 'development';

// Lazy load AccessibilityAuditor for code splitting
const AccessibilityAuditor = React.lazy(() => 
  import('@/components/a11y/AccessibilityAuditor').then(m => ({ 
    default: m.AccessibilityAuditor || m.default 
  }))
);

export const DevTools = memo(function DevTools() {
  const [showA11y, setShowA11y] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Only render in development - after hooks
  if (!isDev) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'p-2 rounded-lg shadow-lg transition-colors',
            isExpanded 
              ? 'bg-gray-800 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          )}
          title="Developer Tools"
        >
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          <span className="sr-only">Toggle Dev Tools</span>
        </button>

        {/* Expanded Tools */}
        {isExpanded && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2">
            {/* A11y Audit Button */}
            <button
              onClick={() => setShowA11y(true)}
              className={cn(
                'p-2 rounded-lg shadow-lg transition-colors flex items-center gap-2',
                'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              )}
              title="Accessibility Audit"
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm">A11y</span>
            </button>
          </div>
        )}
      </div>

      {/* Accessibility Auditor Modal */}
      {showA11y && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl max-h-[85vh] w-full mx-4 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-purple-50">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold text-gray-900">Accessibility Auditor</h2>
              </div>
              <button
                onClick={() => setShowA11y(false)}
                className="p-1.5 hover:bg-purple-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center p-12">
                    <div className="animate-spin text-4xl">⏳</div>
                    <span className="ml-3 text-gray-600">Carregando auditor...</span>
                  </div>
                }
              >
                <AccessibilityAuditor />
              </React.Suspense>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center">
              WCAG 2.1 AA Compliance Checker • Development Only
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default DevTools;
