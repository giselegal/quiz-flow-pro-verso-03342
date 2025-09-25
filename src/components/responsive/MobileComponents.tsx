/**
 * 🎯 COMPONENTES MOBILE PARA TESTES E2E
 * 
 * Componentes específicos para mobile viewport
 * Utilizados nos testes de responsividade
 */

import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onToggle, 
  children 
}) => {
  return (
    <>
      <Button
        data-testid="mobile-menu"
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="lg:hidden"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      
      {isOpen && (
        <div
          data-testid="mobile-menu-overlay"
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        >
          <div 
            className="fixed inset-y-0 left-0 z-50 w-3/4 border-r bg-background p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={onToggle}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

interface MobileEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const MobileEditor: React.FC<MobileEditorProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div 
      data-testid="mobile-editor"
      className={`lg:hidden flex flex-col h-screen ${className}`}
    >
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

interface MobileCanvasProps {
  children?: React.ReactNode;
}

export const MobileCanvas: React.FC<MobileCanvasProps> = ({ children }) => {
  return (
    <div 
      data-testid="mobile-canvas"
      className="flex-1 overflow-y-auto p-4"
    >
      {children}
    </div>
  );
};

interface MobilePropertiesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const MobilePropertiesPanel: React.FC<MobilePropertiesPanelProps> = ({
  isOpen,
  onClose,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div 
      data-testid="mobile-properties-panel"
      className="fixed inset-0 z-50 bg-background lg:hidden"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Propriedades</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 overflow-y-auto h-full">
        {children}
      </div>
    </div>
  );
};

export default {
  MobileMenu,
  MobileEditor,
  MobileCanvas,
  MobilePropertiesPanel
};