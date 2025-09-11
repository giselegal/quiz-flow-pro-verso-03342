import React, { useState, useEffect } from 'react';
import { Menu, X, Settings, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveEditorLayoutProps {
  stagesPanel: React.ReactNode;
  componentsPanel: React.ReactNode;
  canvas: React.ReactNode;
  propertiesPanel: React.ReactNode;
  className?: string;
}

/**
 * 🎯 LAYOUT RESPONSIVO MELHORADO PARA O EDITOR
 * 
 * Layout que funciona corretamente em mobile e desktop:
 * - Mobile: Header com botões + overlays deslizantes
 * - Desktop: 4 colunas tradicionais redimensionáveis
 * - Transições suaves entre breakpoints
 */
export const ResponsiveEditorLayout: React.FC<ResponsiveEditorLayoutProps> = ({
  stagesPanel,
  componentsPanel,
  canvas,
  propertiesPanel,
  className,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  // Detectar breakpoint mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fechar painéis ao redimensionar para desktop
  useEffect(() => {
    if (!isMobile) {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    }
  }, [isMobile]);

  // Mobile Layout
  if (isMobile) {
    return (
      <div className={cn('editor-pro-container h-screen overflow-hidden bg-gray-50', className)}>
        {/* Mobile Header */}
        <div className="mobile-editor-header">
          <button
            onClick={() => setLeftPanelOpen(true)}
            className="mobile-editor-button"
          >
            <Menu className="w-4 h-4" />
            <span>Menu</span>
          </button>

          <div className="mobile-editor-title">Editor</div>

          <button
            onClick={() => setRightPanelOpen(true)}
            className="mobile-editor-button"
          >
            <Settings className="w-4 h-4" />
            <span>Prop.</span>
          </button>
        </div>

        {/* Canvas Area - Full Screen on Mobile */}
        <div className="editor-canvas-area">
          {canvas}
        </div>

        {/* Left Panel Overlay (Stages + Components) */}
        {leftPanelOpen && (
          <div className="mobile-panel-overlay active">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setLeftPanelOpen(false)} 
            />
            <div className="mobile-panel-content">
              <div className="mobile-panel-header">
                <h3 className="mobile-panel-title">Navegação</h3>
                <button
                  onClick={() => setLeftPanelOpen(false)}
                  className="mobile-panel-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mobile-panel-body">
                {/* Stages Panel */}
                <div className="border-b border-gray-700">
                  <div className="p-3 bg-gray-800 text-xs text-gray-300 font-semibold border-b border-gray-700">
                    ETAPAS DO FUNIL
                  </div>
                  <div className="max-h-[40vh] overflow-y-auto">
                    {stagesPanel}
                  </div>
                </div>
                
                {/* Components Panel */}
                <div>
                  <div className="p-3 bg-gray-800 text-xs text-gray-300 font-semibold border-b border-gray-700">
                    COMPONENTES
                  </div>
                  <div className="max-h-[50vh] overflow-y-auto">
                    {componentsPanel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Panel Overlay (Properties) */}
        {rightPanelOpen && (
          <div className="mobile-panel-overlay right active">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setRightPanelOpen(false)} 
            />
            <div className="mobile-panel-content">
              <div className="mobile-panel-header">
                <h3 className="mobile-panel-title">Propriedades</h3>
                <button
                  onClick={() => setRightPanelOpen(false)}
                  className="mobile-panel-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mobile-panel-body">
                {propertiesPanel}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout - 4 Columns
  return (
    <div className={cn('editor-pro-container h-screen overflow-hidden bg-transparent', className)}>
      <div className="editor-four-column-layout">
        {/* Column 1: Stages */}
        <div className="editor-column editor-stages-column">
          <div className="p-3 bg-gray-800 text-xs text-gray-300 font-semibold border-b border-gray-700">
            ETAPAS DO FUNIL
          </div>
          <div className="editor-column-content">
            {stagesPanel}
          </div>
        </div>

        {/* Column 2: Components */}
        <div className="editor-column editor-components-column">
          <div className="p-3 bg-gray-800 text-xs text-gray-300 font-semibold border-b border-gray-700">
            COMPONENTES
          </div>
          <div className="editor-column-content">
            {componentsPanel}
          </div>
        </div>

        {/* Column 3: Canvas */}
        <div className="editor-column editor-canvas-column">
          {canvas}
        </div>

        {/* Column 4: Properties */}
        <div className="editor-column editor-properties-column">
          <div className="p-3 bg-gray-800 text-xs text-gray-300 font-semibold border-b border-gray-700">
            PROPRIEDADES
          </div>
          <div className="editor-column-content">
            {propertiesPanel}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveEditorLayout;
