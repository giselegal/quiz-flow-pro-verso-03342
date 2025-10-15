/**
 * 🔧 SYSTEM DIAGNOSTICS - FASE 8: MONITORAMENTO E DEBUG
 * 
 * Ferramenta completa de diagnóstico do sistema
 * Logs estruturados, health checks, debug info
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUnifiedEditorState } from '@/hooks/useUnifiedEditorState';
import { useEditorPerformance } from '@/hooks/useUnifiedEditorState';
import { supabase } from '@/integrations/supabase/customClient';

interface SystemStatus {
  editor: 'healthy' | 'warning' | 'error';
  database: 'healthy' | 'warning' | 'error';
  performance: 'healthy' | 'warning' | 'error';
  security: 'healthy' | 'warning' | 'error';
}

interface DiagnosticData {
  timestamp: string;
  userAgent: string;
  url: string;
  performance: {
    memory: number;
    renderTime: number;
    cacheSize: number;
  };
  editor: {
    currentFunnel: string | null;
    currentStep: number;
    blocksCount: number;
    isDirty: boolean;
  };
  errors: string[];
}

export const SystemDiagnostics: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    editor: 'healthy',
    database: 'healthy',
    performance: 'healthy',
    security: 'healthy'
  });
  
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const editorState = useUnifiedEditorState();
  const performance = useEditorPerformance();

  // Collect diagnostic data
  const collectDiagnostics = async () => {
    const data: DiagnosticData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      performance: {
        memory: performance.memoryUsage,
        renderTime: 0, // Would need to be measured
        cacheSize: performance.cacheSize
      },
      editor: {
        currentFunnel: editorState.currentFunnel?.id || null,
        currentStep: editorState.currentStep,
        blocksCount: Object.values(editorState.stepBlocks).flat().length,
        isDirty: performance.isDirty
      },
      errors: []
    };

    setDiagnosticData(data);
    
    // Log diagnostic data
    console.log('🔧 System Diagnostics:', data);
    addLog(`Diagnostics collected at ${new Date().toLocaleTimeString()}`);
  };

  // Check system health
  const checkSystemHealth = async () => {
    const newStatus: SystemStatus = {
      editor: 'healthy',
      database: 'healthy',
      performance: 'healthy',
      security: 'healthy'
    };

    try {
      // Check database connection
      const { error: dbError } = await supabase.from('funnels').select('id').limit(1);
      if (dbError) {
        newStatus.database = 'error';
        addLog(`Database error: ${dbError.message}`);
      }

      // Check performance
      if (performance.memoryUsage > 100) {
        newStatus.performance = 'warning';
        addLog(`High memory usage: ${performance.memoryUsage}MB`);
      }

      // Check editor state
      if (editorState.isLoading || editorState.isSaving) {
        newStatus.editor = 'warning';
        addLog('Editor is busy');
      }

      setSystemStatus(newStatus);
    } catch (error) {
      console.error('Health check failed:', error);
      addLog(`Health check failed: ${error}`);
    }
  };

  // Add log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  // Export diagnostic data
  const exportDiagnostics = () => {
    const exportData = {
      systemStatus,
      diagnosticData,
      logs: logs.slice(0, 100),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-diagnostics-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    addLog('Diagnostics exported');
  };

  // Auto-collect diagnostics
  useEffect(() => {
    const interval = setInterval(() => {
      if (isVisible) {
        collectDiagnostics();
        checkSystemHealth();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getStatusColor = (status: SystemStatus[keyof SystemStatus]) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: SystemStatus[keyof SystemStatus]) => {
    switch (status) {
      case 'healthy': return 'Healthy';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  if (!isVisible) {
    return (
      <Button
        className="fixed bottom-4 left-4 z-50 opacity-20 hover:opacity-100"
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
      >
        🔧 Debug
      </Button>
    );
  }

  return (
    <div className="fixed inset-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">System Diagnostics</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={collectDiagnostics}>
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={exportDiagnostics}>
              Export
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsVisible(false)}>
              ✕
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(systemStatus).map(([key, status]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                    <span className="capitalize">{key}</span>
                    <Badge variant="outline" className="ml-auto">
                      {getStatusText(status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Memory</div>
                  <div className="font-mono">{performance.memoryUsage}MB</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Cache Size</div>
                  <div className="font-mono">{performance.cacheSize}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Dirty State</div>
                  <div className="font-mono">{performance.isDirty ? 'Yes' : 'No'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Saving</div>
                  <div className="font-mono">{performance.isSaving ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editor State */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Editor State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-mono">
                <div>Funnel: {editorState.currentFunnel?.id || 'None'}</div>
                <div>Step: {editorState.currentStep}</div>
                <div>Blocks: {Object.values(editorState.stepBlocks).flat().length}</div>
                <div>Preview: {editorState.isPreviewMode ? 'Yes' : 'No'}</div>
                <div>View: {editorState.viewMode}</div>
              </div>
            </CardContent>
          </Card>

          {/* Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Logs</CardTitle>
              <CardDescription>Last 20 entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-64 overflow-auto">
                {logs.slice(0, 20).map((log, index) => (
                  <div key={index} className="text-xs font-mono text-muted-foreground">
                    {log}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-sm text-muted-foreground">No logs available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemDiagnostics;