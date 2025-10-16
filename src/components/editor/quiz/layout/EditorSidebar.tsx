/**
 * 🎯 EDITOR SIDEBAR (Sprint 2 - TK-ED-04)
 * 
 * Sidebar com navegação de steps
 */

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export interface StepItem {
  id: string;
  label: string;
  icon: string;
  order: number;
  isValid?: boolean;
}

interface EditorSidebarProps {
  steps: StepItem[];
  currentStepId: string | null;
  onSelectStep: (stepId: string) => void;
}

export function EditorSidebar({
  steps,
  currentStepId,
  onSelectStep,
}: EditorSidebarProps) {
  return (
    <div className="w-64 border-r bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-sm font-semibold mb-1">
          Etapas do Funil
        </h2>
        <p className="text-xs text-muted-foreground">
          {steps.length} etapas
        </p>
      </div>

      {/* Steps list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {steps.map((step, index) => {
            const isActive = step.id === currentStepId;
            const isValid = step.isValid !== false;

            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "hover:bg-accent text-foreground"
                )}
              >
                {/* Icon */}
                <span className="text-lg flex-shrink-0">{step.icon}</span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">
                    {step.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Etapa {index + 1}
                  </div>
                </div>

                {/* Status */}
                {isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}

                {/* Active indicator */}
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer stats */}
      <div className="p-3 border-t bg-muted text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Total:</span>
          <Badge variant="outline" className="text-xs">
            {steps.length} etapas
          </Badge>
        </div>
      </div>
    </div>
  );
}
