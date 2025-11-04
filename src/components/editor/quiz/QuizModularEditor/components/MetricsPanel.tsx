/**
 * 📊 METRICS PANEL - FASE 3.3
 * 
 * Painel de métricas de performance do editor (dev mode)
 * Exibe dados em tempo real do editorMetrics
 */

import React, { useEffect, useState } from 'react';
import { editorMetrics } from '@/utils/editorMetrics';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';

// ✅ FIX: Usar ícone SVG simples ao invés de BarChart do lucide-react
const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

export const MetricsPanel: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const refreshMetrics = () => {
    setReport(editorMetrics.getReport());
  };

  useEffect(() => {
    if (isOpen) {
      refreshMetrics();
      const interval = setInterval(refreshMetrics, 3000); // Atualizar a cada 3s
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!import.meta.env.DEV) {
    return null; // Apenas dev mode
  }

  if (!isOpen) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <BarChartIcon />
        <span className="ml-2">Métricas</span>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border rounded-lg shadow-xl w-96 max-h-96 overflow-auto">
      <div className="sticky top-0 bg-card border-b p-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <BarChartIcon />
          Editor Performance
        </h3>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={refreshMetrics}>
            <RefreshCw className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const data = editorMetrics.export();
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `editor-metrics-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
            ×
          </Button>
        </div>
      </div>

      {report && (
        <div className="p-3 space-y-3 text-xs">
          <div className="text-muted-foreground">{report.period}</div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-muted rounded">
              <div className="text-muted-foreground">Total Loads</div>
              <div className="text-lg font-bold">{report.summary.totalLoads}</div>
            </div>
            <div className="p-2 bg-muted rounded">
              <div className="text-muted-foreground">Avg Load Time</div>
              <div className="text-lg font-bold">{report.summary.avgLoadTimeMs.toFixed(0)}ms</div>
            </div>
            <div className="p-2 bg-muted rounded">
              <div className="text-muted-foreground">Cache Hit Rate</div>
              <div className="text-lg font-bold text-green-600">{report.summary.cacheHitRate}</div>
            </div>
            <div className="p-2 bg-muted rounded">
              <div className="text-muted-foreground">Errors</div>
              <div className={`text-lg font-bold ${report.summary.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {report.summary.errors}
              </div>
            </div>
          </div>

          {/* Slowest Loads */}
          {report.slowestLoads.length > 0 && (
            <div>
              <div className="font-semibold mb-1">Slowest Loads</div>
              <div className="space-y-1">
                {report.slowestLoads.map((load: any, idx: number) => (
                  <div key={idx} className="p-2 bg-muted rounded flex justify-between">
                    <span className="font-mono">{load.stepId}</span>
                    <span className="text-orange-600 font-bold">{load.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Errors */}
          {report.recentErrors.length > 0 && (
            <div>
              <div className="font-semibold mb-1 text-red-600">Recent Errors</div>
              <div className="space-y-1">
                {report.recentErrors.map((err: any, idx: number) => (
                  <div key={idx} className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                    <div className="font-mono text-red-800">{err.message}</div>
                    <div className="text-muted-foreground">{err.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cache Stats */}
          <div className="p-2 bg-muted rounded">
            <div className="font-semibold mb-1">Cache Stats</div>
            <div className="flex justify-between">
              <span>Hits: <span className="text-green-600 font-bold">{report.summary.cacheHits}</span></span>
              <span>Misses: <span className="text-orange-600 font-bold">{report.summary.cacheMisses}</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsPanel;
