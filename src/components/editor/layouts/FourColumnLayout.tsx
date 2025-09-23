/**
 * 🏗️ FOUR COLUMN LAYOUT - LAYOUT SYSTEM UNIFICADO
 * 
 * Layout responsivo de 4 colunas que substitui toda fragmentação:
 * - Sidebar Esquerda 1: Steps/Etapas (w-64)
 * - Sidebar Esquerda 2: Components (w-64) 
 * - Main Content: Canvas/Editor (flex-1)
 * - Sidebar Direita: Properties (w-80)
 * 
 * FUNCIONALIDADES:
 * ✅ Responsive design com breakpoints
 * ✅ Collapsible panels
 * ✅ Performance otimizada
 * ✅ Intercambiável via props
 * ✅ Consistent spacing/theming
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';

export interface FourColumnLayoutProps {
  className?: string;
  
  // Panel Contents
  leftPanel?: React.ReactNode;      // Steps/Etapas
  leftSidebar?: React.ReactNode;    // Components
  mainContent: React.ReactNode;     // Canvas/Editor (required)
  rightSidebar?: React.ReactNode;   // Properties
  
  // Panel Configurations
  leftPanelWidth?: string;          // default: w-64
  leftSidebarWidth?: string;        // default: w-64
  rightSidebarWidth?: string;       // default: w-80
  
  // Responsive Settings
  hideLeftPanelOnMobile?: boolean;   // default: true
  hideLeftSidebarOnMobile?: boolean; // default: true
  hideRightSidebarOnMobile?: boolean; // default: true
  
  // Collapsible Settings
  leftPanelCollapsible?: boolean;    // default: true
  leftSidebarCollapsible?: boolean;  // default: true
  rightSidebarCollapsible?: boolean; // default: true
  
  // Initial States
  leftPanelInitialState?: boolean;   // default: true (open)
  leftSidebarInitialState?: boolean; // default: true (open)
  rightSidebarInitialState?: boolean; // default: true (open)
}

export const FourColumnLayout: React.FC<FourColumnLayoutProps> = ({
  className = '',
  leftPanel,
  leftSidebar,
  mainContent,
  rightSidebar,
  leftPanelWidth = 'w-64',
  leftSidebarWidth = 'w-64', 
  rightSidebarWidth = 'w-80',
  hideLeftPanelOnMobile = true,
  hideLeftSidebarOnMobile = true,
  hideRightSidebarOnMobile = true,
  leftPanelCollapsible = true,
  leftSidebarCollapsible = true,
  rightSidebarCollapsible = true,
  leftPanelInitialState = true,
  leftSidebarInitialState = true,
  rightSidebarInitialState = true
}) => {
  // 🎯 COLLAPSIBLE STATE MANAGEMENT
  const [leftPanelOpen, setLeftPanelOpen] = useState(leftPanelInitialState);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(leftSidebarInitialState);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(rightSidebarInitialState);

  // 🎯 RESPONSIVE CLASSES CALCULATION
  const responsiveClasses = useMemo(() => {
    return {
      leftPanel: cn(
        leftPanelOpen ? leftPanelWidth : 'w-0',
        'transition-all duration-300 ease-in-out',
        'border-r border-border bg-card overflow-hidden',
        hideLeftPanelOnMobile && 'hidden lg:flex',
        'flex-shrink-0'
      ),
      leftSidebar: cn(
        leftSidebarOpen ? leftSidebarWidth : 'w-0',
        'transition-all duration-300 ease-in-out',
        'border-r border-border bg-card overflow-hidden',
        hideLeftSidebarOnMobile && 'hidden md:flex',
        'flex-shrink-0'
      ),
      mainContent: cn(
        'flex-1 bg-background min-w-0',
        'transition-all duration-300 ease-in-out'
      ),
      rightSidebar: cn(
        rightSidebarOpen ? rightSidebarWidth : 'w-0',
        'transition-all duration-300 ease-in-out',
        'border-l border-border bg-card overflow-hidden',
        hideRightSidebarOnMobile && 'hidden xl:flex',
        'flex-shrink-0'
      )
    };
  }, [
    leftPanelOpen, leftSidebarOpen, rightSidebarOpen,
    leftPanelWidth, leftSidebarWidth, rightSidebarWidth,
    hideLeftPanelOnMobile, hideLeftSidebarOnMobile, hideRightSidebarOnMobile
  ]);

  // 🎯 TOGGLE BUTTONS COMPONENT
  const ToggleButtons = React.memo(() => (
    <div className="absolute top-4 right-4 z-50 flex gap-2">
      {/* Left Panel Toggle */}
      {leftPanel && leftPanelCollapsible && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className="h-8 w-8 p-0"
          title={leftPanelOpen ? 'Fechar Etapas' : 'Abrir Etapas'}
        >
          {leftPanelOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Left Sidebar Toggle */}
      {leftSidebar && leftSidebarCollapsible && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="h-8 w-8 p-0"
          title={leftSidebarOpen ? 'Fechar Componentes' : 'Abrir Componentes'}
        >
          {leftSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Right Sidebar Toggle */}
      {rightSidebar && rightSidebarCollapsible && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          className="h-8 w-8 p-0"
          title={rightSidebarOpen ? 'Fechar Propriedades' : 'Abrir Propriedades'}
        >
          {rightSidebarOpen ? (
            <PanelRightClose className="h-4 w-4" />
          ) : (
            <PanelRightOpen className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  ));

  return (
    <div className={cn('four-column-layout h-full w-full flex relative', className)}>
      {/* Left Panel - Steps/Etapas */}
      {leftPanel && (
        <div className={responsiveClasses.leftPanel}>
          <div className="h-full w-full overflow-y-auto">
            {leftPanel}
          </div>
        </div>
      )}

      {/* Left Sidebar - Components */}
      {leftSidebar && (
        <div className={responsiveClasses.leftSidebar}>
          <div className="h-full w-full overflow-y-auto">
            {leftSidebar}
          </div>
        </div>
      )}

      {/* Main Content - Canvas/Editor */}
      <div className={responsiveClasses.mainContent}>
        <div className="h-full w-full relative">
          {mainContent}
          
          {/* Toggle Buttons Overlay */}
          <ToggleButtons />
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {rightSidebar && (
        <div className={responsiveClasses.rightSidebar}>
          <div className="h-full w-full overflow-y-auto">
            {rightSidebar}
          </div>
        </div>
      )}
    </div>
  );
};

// 🎯 PRESET LAYOUTS FOR COMMON USE CASES

/**
 * 🎯 EDITOR LAYOUT PRESET
 * Layout completo para editor com todas as 4 colunas
 */
export const EditorLayoutPreset: React.FC<Omit<FourColumnLayoutProps, 'leftPanelWidth' | 'leftSidebarWidth' | 'rightSidebarWidth'>> = (props) => (
  <FourColumnLayout
    {...props}
    leftPanelWidth="w-64"    // Steps
    leftSidebarWidth="w-64"  // Components
    rightSidebarWidth="w-80" // Properties
  />
);

/**
 * 🎯 FUNNEL LAYOUT PRESET  
 * Layout simplificado para funnel (apenas steps + canvas + properties)
 */
export const FunnelLayoutPreset: React.FC<Omit<FourColumnLayoutProps, 'leftSidebarWidth'> & { leftSidebar?: never }> = ({ leftSidebar, ...props }) => (
  <FourColumnLayout
    {...props}
    leftSidebar={undefined}  // Remove components sidebar
    leftPanelWidth="w-64"    // Steps
    rightSidebarWidth="w-80" // Properties
  />
);

/**
 * 🎯 HEADLESS LAYOUT PRESET
 * Layout minimal apenas com canvas
 */
export const HeadlessLayoutPreset: React.FC<Pick<FourColumnLayoutProps, 'mainContent' | 'className'>> = ({ mainContent, className }) => (
  <FourColumnLayout
    className={className}
    mainContent={mainContent}
    leftPanel={undefined}
    leftSidebar={undefined}
    rightSidebar={undefined}
  />
);

export default FourColumnLayout;