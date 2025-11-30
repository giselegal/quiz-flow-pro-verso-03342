/**
 * 🎨 PROPERTIES COLUMN WITH JSON EDITOR
 * 
 * Wrapper que adiciona funcionalidade de edição JSON ao PropertiesColumn
 * mantendo as 4 colunas originais do editor.
 * 
 * Características:
 * - Separação entre textValue (buffer de texto) e parsedValue (valor parseado)
 * - Commit só ocorre se JSON é válido
 * - Mensagens claras de erro para JSON inválido
 * 
 * @see SinglePropertiesPanel - Painel canônico de propriedades
 * @see useDraftProperties - Hook para gerenciamento de draft
 */

import React, { useState, useCallback, useMemo, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileJson, Settings, AlertCircle, CheckCircle2 } from 'lucide-react';
import { JsonTemplateEditor } from '@/components/editor/JsonEditor';
import { safeParseJson } from '@/core/schema/propertyValidation';
import type { Block } from '@/types/editor';

// Import lazy do componente original para padronizar com o editor
const PropertiesColumn = React.lazy(() => import('./index'));

interface PropertiesColumnWithJsonProps {
  selectedBlock?: Block | undefined;
  onBlockUpdate: (blockId: string, updates: Partial<Block>) => void;
  onClearSelection: () => void;
  blocks?: Block[] | null;
  onBlockSelect?: (blockId: string) => void;

  // Props para o editor JSON
  fullTemplate?: any;
  onTemplateChange?: (template: any) => void;
  templateId?: string;
}

export function PropertiesColumnWithJson({
  selectedBlock,
  onBlockUpdate,
  onClearSelection,
  blocks,
  onBlockSelect,
  fullTemplate,
  onTemplateChange,
  templateId
}: PropertiesColumnWithJsonProps) {
  const [activeTab, setActiveTab] = useState<'properties' | 'json'>('properties');

  // Estado local para separar textValue e parsedValue
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonIsValid, setJsonIsValid] = useState<boolean>(true);

  // Callback para validar e aplicar mudanças de JSON
  const handleTemplateChangeWithValidation = useCallback((newTemplate: string | Record<string, unknown>) => {
    // Se já é um objeto (não string), aceita diretamente
    if (typeof newTemplate !== 'string') {
      setJsonError(null);
      setJsonIsValid(true);
      onTemplateChange?.(newTemplate);
      return;
    }

    // Se é string, tenta parsear
    const { value, error, isValid } = safeParseJson(newTemplate);

    setJsonIsValid(isValid);

    if (isValid) {
      setJsonError(null);
      onTemplateChange?.(value);
    } else {
      setJsonError(error ?? 'JSON inválido');
      // Não faz commit se JSON é inválido
    }
  }, [onTemplateChange]);

  return (
    <div className="h-full flex flex-col bg-background border-l">
      {/* Tabs Header */}
      <div className="border-b px-2 py-2 bg-muted/30">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="properties" className="text-xs">
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              Propriedades
            </TabsTrigger>
            <TabsTrigger value="json" className="text-xs">
              <FileJson className="h-3.5 w-3.5 mr-1.5" />
              JSON
              {/* Indicador de status de validação */}
              {activeTab === 'json' && !jsonIsValid && (
                <Badge variant="destructive" className="ml-1.5 h-4 px-1">
                  <AlertCircle className="h-2.5 w-2.5" />
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'properties' ? (
          <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Carregando propriedades…</div>}>
            <PropertiesColumn
              selectedBlock={selectedBlock}
              onBlockUpdate={onBlockUpdate}
              onClearSelection={onClearSelection}
              blocks={blocks}
              onBlockSelect={onBlockSelect}
            />
          </Suspense>
        ) : (
          <div className="h-full overflow-y-auto">
            {/* Status bar para erros de JSON */}
            {jsonError && (
              <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/20 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-destructive">{jsonError}</span>
              </div>
            )}
            {!jsonError && jsonIsValid && (
              <div className="px-4 py-2 bg-green-500/10 border-b border-green-500/20 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600">JSON válido - alterações serão aplicadas</span>
              </div>
            )}

            <div className="p-4">
              <JsonTemplateEditor
                template={fullTemplate}
                onTemplateChange={handleTemplateChangeWithValidation}
                templateId={templateId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertiesColumnWithJson;
