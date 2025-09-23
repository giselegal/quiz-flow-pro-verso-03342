/**
 * 🎯 LAYOUT DO EDITOR - COMPONENTE WRAPPER
 * 
 * Layout consistente para todas as páginas do editor
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Settings, Crown } from 'lucide-react';
import { useLocation } from 'wouter';

interface EditorLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  className?: string;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  children,
  title = "Editor Neural",
  subtitle = "Editor visual unificado",
  showBackButton = true,
  className = ""
}) => {
  const [, setLocation] = useLocation();

  const handleGoBack = () => {
    setLocation('/');
  };

  const handleGoToSettings = () => {
    setLocation('/admin');
  };

  return (
    <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
      {/* Header do Editor */}
      <div className="flex items-center justify-between p-4 bg-background border-b border-border">
        {/* Logo e Navegação */}
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          )}
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            <div>
              <h1 className="font-bold text-lg">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <Badge variant="secondary" className="text-xs ml-2">
              v2.0 UNIFIED
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoToSettings}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Admin
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-muted/30 border-t border-border flex items-center justify-between px-4">
        <div className="text-xs text-muted-foreground">
          Sistema de Editor Unificado ✅
        </div>
        <div className="text-xs text-muted-foreground">
          Neural Editor v2.0 - Production Ready
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;