/**
 * ⚙️ EDITOR CONTROLS MANAGER - EDITOR UNIFICADO
 *
 * Gerenciador centralizado de controles do editor
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMonitoring } from '@/services/MonitoringService';
import { useFeatureFlags } from '@/utils/FeatureFlagManager';
import {
  Download,
  Edit,
  Eye,
  Grid,
  Layers,
  Monitor,
  Redo,
  Save,
  Settings,
  Smartphone,
  Tablet,
  Undo,
  Upload,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

export interface EditorControlsState {
  isPreviewing: boolean;
  viewportSize: 'mobile' | 'tablet' | 'desktop';
  showGrid: boolean;
  showLayers: boolean;
  autoSave: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
}

export interface EditorControlsActions {
  togglePreview: () => void;
  setViewportSize: (size: 'mobile' | 'tablet' | 'desktop') => void;
  toggleGrid: () => void;
  toggleLayers: () => void;
  save: () => void;
  undo: () => void;
  redo: () => void;
  exportTemplate: () => void;
  importTemplate: () => void;
}

export interface EditorControlsManagerProps {
  state: EditorControlsState;
  actions: EditorControlsActions;
  mode?: 'full' | 'compact' | 'minimal';
  className?: string;
  onStateChange?: (newState: Partial<EditorControlsState>) => void;
}

/**
 * ⚙️ Gerenciador de Controles do Editor
 *
 * Centraliza todos os controles de interface do editor
 */
export const EditorControlsManager: React.FC<EditorControlsManagerProps> = ({
  state,
  actions,
  mode = 'full',
  className = '',
  onStateChange,
}) => {
  const { trackEvent } = useMonitoring();
  const flags = useFeatureFlags();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Configuração de layout por modo
  const layoutConfig = useMemo(() => {
    const configs = {
      full: {
        showLabels: true,
        showBadges: true,
        groupControls: true,
        showAdvanced: true,
      },
      compact: {
        showLabels: false,
        showBadges: true,
        groupControls: true,
        showAdvanced: false,
      },
      minimal: {
        showLabels: false,
        showBadges: false,
        groupControls: false,
        showAdvanced: false,
      },
    };
    return configs[mode];
  }, [mode]);

  // Handlers com tracking
  const handlePreviewToggle = useCallback(() => {
    actions.togglePreview();
    trackEvent('editor_preview_toggled', {
      newState: !state.isPreviewing,
      mode,
    });
    onStateChange?.({ isPreviewing: !state.isPreviewing });
  }, [actions, state.isPreviewing, trackEvent, mode, onStateChange]);

  const handleViewportChange = useCallback(
    (viewport: 'mobile' | 'tablet' | 'desktop') => {
      actions.setViewportSize(viewport);
      trackEvent('editor_viewport_changed', { viewport, mode });
      onStateChange?.({ viewportSize: viewport });
    },
    [actions, trackEvent, mode, onStateChange]
  );

  const handleSave = useCallback(() => {
    actions.save();
    trackEvent('editor_manual_save', { mode });
  }, [actions, trackEvent, mode]);

  // Viewport controls
  const ViewportControls = () => (
    <div className="viewport-controls flex items-center bg-gray-50 rounded-lg p-1">
      {[
        { key: 'desktop', icon: Monitor, label: 'Desktop' },
        { key: 'tablet', icon: Tablet, label: 'Tablet' },
        { key: 'mobile', icon: Smartphone, label: 'Mobile' },
      ].map(({ key, icon: Icon, label }) => (
        <Button
          key={key}
          variant={state.viewportSize === key ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleViewportChange(key as any)}
          className="flex items-center gap-1"
        >
          <Icon className="w-4 h-4" />
          {layoutConfig.showLabels && <span>{label}</span>}
        </Button>
      ))}
    </div>
  );

  // Preview controls
  const PreviewControls = () => (
    <div className="preview-controls flex items-center gap-2">
      <Button
        variant={state.isPreviewing ? 'default' : 'outline'}
        size="sm"
        onClick={handlePreviewToggle}
        className="flex items-center gap-2"
      >
        {state.isPreviewing ? (
          <>
            <Edit className="w-4 h-4" />
            {layoutConfig.showLabels && 'Editar'}
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            {layoutConfig.showLabels && 'Preview'}
          </>
        )}
      </Button>

      {layoutConfig.showBadges && (
        <Badge variant={state.isPreviewing ? 'default' : 'secondary'}>
          {state.isPreviewing ? 'Preview' : 'Edição'}
        </Badge>
      )}
    </div>
  );

  // Action controls
  const ActionControls = () => (
    <div className="action-controls flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={actions.undo}
        disabled={!state.canUndo}
        title="Desfazer"
      >
        <Undo className="w-4 h-4" />
        {layoutConfig.showLabels && 'Desfazer'}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={actions.redo}
        disabled={!state.canRedo}
        title="Refazer"
      >
        <Redo className="w-4 h-4" />
        {layoutConfig.showLabels && 'Refazer'}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={state.isSaving}
        title="Salvar"
        className="flex items-center gap-1"
      >
        <Save className="w-4 h-4" />
        {layoutConfig.showLabels && (state.isSaving ? 'Salvando...' : 'Salvar')}
      </Button>
    </div>
  );

  // Advanced controls
  const AdvancedControls = () => (
    <div className="advanced-controls flex items-center gap-1">
      <Button
        variant={state.showGrid ? 'default' : 'outline'}
        size="sm"
        onClick={actions.toggleGrid}
        title="Grid"
      >
        <Grid className="w-4 h-4" />
        {layoutConfig.showLabels && 'Grid'}
      </Button>

      <Button
        variant={state.showLayers ? 'default' : 'outline'}
        size="sm"
        onClick={actions.toggleLayers}
        title="Camadas"
      >
        <Layers className="w-4 h-4" />
        {layoutConfig.showLabels && 'Camadas'}
      </Button>

      <Button variant="outline" size="sm" onClick={actions.exportTemplate} title="Exportar">
        <Download className="w-4 h-4" />
        {layoutConfig.showLabels && 'Exportar'}
      </Button>

      <Button variant="outline" size="sm" onClick={actions.importTemplate} title="Importar">
        <Upload className="w-4 h-4" />
        {layoutConfig.showLabels && 'Importar'}
      </Button>
    </div>
  );

  // Auto-save indicator
  const AutoSaveIndicator = () =>
    state.autoSave && (
      <div className="auto-save-indicator flex items-center gap-1 text-xs text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        {layoutConfig.showLabels && 'Auto-save ativo'}
      </div>
    );

  const containerClasses = [
    'editor-controls-manager',
    `mode-${mode}`,
    'flex items-center gap-4 p-3 bg-white border-b',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (mode === 'minimal') {
    return (
      <div className={containerClasses}>
        <PreviewControls />
        <ViewportControls />
      </div>
    );
  }

  if (mode === 'compact') {
    return (
      <div className={containerClasses}>
        <PreviewControls />
        <ViewportControls />
        <ActionControls />

        {flags.shouldLogCompatibility() && (
          <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
            <Settings className="w-4 h-4" />
          </Button>
        )}

        {showAdvanced && <AdvancedControls />}
        <AutoSaveIndicator />
      </div>
    );
  }

  // Mode 'full'
  return (
    <div className={containerClasses}>
      {/* Left section - Main controls */}
      <div className="flex items-center gap-4">
        <PreviewControls />
        <ViewportControls />
      </div>

      {/* Center section - Actions */}
      <div className="flex items-center gap-2">
        <ActionControls />
      </div>

      {/* Right section - Advanced & Status */}
      <div className="flex items-center gap-2 ml-auto">
        {layoutConfig.showAdvanced && <AdvancedControls />}
        <AutoSaveIndicator />

        {/* Status badges */}
        {layoutConfig.showBadges && (
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {state.viewportSize}
            </Badge>

            {flags.shouldLogCompatibility() && (
              <Badge variant="secondary" className="text-xs">
                Debug
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Debug info (development) */}
      {process.env.NODE_ENV === 'development' && flags.shouldLogCompatibility() && (
        <details className="ml-4 text-xs">
          <summary className="cursor-pointer">🐛</summary>
          <div className="absolute top-full right-0 mt-1 p-2 bg-gray-800 text-white rounded text-xs z-50 max-w-xs">
            <div>Preview: {state.isPreviewing ? 'ON' : 'OFF'}</div>
            <div>Viewport: {state.viewportSize}</div>
            <div>Grid: {state.showGrid ? 'ON' : 'OFF'}</div>
            <div>Auto-save: {state.autoSave ? 'ON' : 'OFF'}</div>
            <div>Can Undo: {state.canUndo ? 'YES' : 'NO'}</div>
            <div>Can Redo: {state.canRedo ? 'YES' : 'NO'}</div>
          </div>
        </details>
      )}
    </div>
  );
};

/**
 * 🎯 Hook para gerenciar estado dos controles
 */
export const useEditorControls = (initialState?: Partial<EditorControlsState>) => {
  const [state, setState] = useState<EditorControlsState>({
    isPreviewing: false,
    viewportSize: 'desktop',
    showGrid: false,
    showLayers: false,
    autoSave: true,
    canUndo: false,
    canRedo: false,
    isSaving: false,
    ...initialState,
  });

  const actions: EditorControlsActions = {
    togglePreview: () => setState(prev => ({ ...prev, isPreviewing: !prev.isPreviewing })),
    setViewportSize: size => setState(prev => ({ ...prev, viewportSize: size })),
    toggleGrid: () => setState(prev => ({ ...prev, showGrid: !prev.showGrid })),
    toggleLayers: () => setState(prev => ({ ...prev, showLayers: !prev.showLayers })),
    save: () => {
      setState(prev => ({ ...prev, isSaving: true }));
      // Simular save
      setTimeout(() => {
        setState(prev => ({ ...prev, isSaving: false }));
      }, 1000);
    },
    undo: () => setState(prev => ({ ...prev, canRedo: true, canUndo: false })),
    redo: () => setState(prev => ({ ...prev, canUndo: true, canRedo: false })),
    exportTemplate: () => console.log('Export template'),
    importTemplate: () => console.log('Import template'),
  };

  const updateState = (updates: Partial<EditorControlsState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return {
    state,
    actions,
    updateState,
  };
};

export default EditorControlsManager;
