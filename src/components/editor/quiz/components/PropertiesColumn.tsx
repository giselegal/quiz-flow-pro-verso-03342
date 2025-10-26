/**
 * ⚙️ PROPERTIES COLUMN - Fase 2 Modularização
 * 
 * Coluna 4: Painel de propriedades para edição detalhada
 * Extraído de QuizModularProductionEditor para melhor organização
 */

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Settings } from 'lucide-react';

export interface PropertyField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'color' | 'select' | 'boolean';
  value: any;
  options?: { label: string; value: string }[];
  placeholder?: string;
  description?: string;
}

interface PropertiesColumnProps {
  selectedBlockId?: string;
  selectedBlockType?: string;
  fields?: PropertyField[];
  onFieldChange?: (key: string, value: any) => void;
  renderCustomEditor?: () => React.ReactNode;
  className?: string;
}

export const PropertiesColumn: React.FC<PropertiesColumnProps> = ({
  selectedBlockId,
  selectedBlockType,
  fields = [],
  onFieldChange,
  renderCustomEditor,
  className,
}) => {
  return (
    <div className={cn('flex flex-col h-full border-l bg-muted/10', className)}>
      <div className="p-4 border-b bg-background">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Propriedades</h2>
        </div>
        {selectedBlockType && (
          <p
            className="text-sm text-muted-foreground mt-1"
            data-testid="properties-selected-type"
          >
            {selectedBlockType}
          </p>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {!selectedBlockId ? (
            <Alert data-testid="properties-no-selection">
              <AlertDescription>
                Selecione um bloco no canvas para editar suas propriedades
              </AlertDescription>
            </Alert>
          ) : renderCustomEditor ? (
            renderCustomEditor()
          ) : (
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-sm font-medium">
                    {field.label}
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={field.value || ''}
                      onChange={(e) => onFieldChange?.(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      value={field.value || ''}
                      onChange={(e) => onFieldChange?.(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  )}

                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={field.value || 0}
                      onChange={(e) => onFieldChange?.(field.key, Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  )}

                  {field.type === 'color' && (
                    <input
                      type="color"
                      value={field.value || '#000000'}
                      onChange={(e) => onFieldChange?.(field.key, e.target.value)}
                      className="w-full h-10 border rounded-md"
                    />
                  )}

                  {field.type === 'select' && field.options && (
                    <select
                      value={field.value || ''}
                      onChange={(e) => onFieldChange?.(field.key, e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Selecione...</option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'boolean' && (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.value || false}
                        onChange={(e) => onFieldChange?.(field.key, e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">{field.description || 'Habilitar'}</span>
                    </label>
                  )}

                  {field.description && field.type !== 'boolean' && (
                    <p className="text-xs text-muted-foreground">
                      {field.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
