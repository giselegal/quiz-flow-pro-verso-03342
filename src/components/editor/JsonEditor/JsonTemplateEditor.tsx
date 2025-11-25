/**
 * 🎨 JSON TEMPLATE EDITOR - Sistema Flexível
 * 
 * Editor completo para templates com:
 * - Suporte para 1-30 etapas (flexível)
 * - Lógica de cálculo de resultados variáveis
 * - Regras de pontuação configuráveis
 * - Sistema de classificação personalizável
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileJson,
  Save,
  Copy,
  RefreshCw,
  Calculator,
  Layers
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { appLogger } from '@/lib/utils/appLogger';
import { validateTemplateV4, type ValidationResult } from '@/lib/validation/jsonSchemaValidator';

interface JsonTemplateEditorProps {
  template?: any;
  onTemplateChange?: (template: any) => void;
  readOnly?: boolean;
  templateId?: string;
}

interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Template padrão compatível com a estrutura existente
 * Usa a mesma lógica de computeResult e ResultEngine
 */
const DEFAULT_TEMPLATE = {
  templateId: 'novo-template',
  name: 'Novo Template',
  description: 'Template criado via editor JSON',
  version: '1.0.0',

  // Configuração flexível de etapas (1-30)
  settings: {
    minStages: 1,
    maxStages: 30,
    allowDynamicStages: true
  },

  // Sistema de runtime compatível com o existente
  runtime: {
    // Scoring usando a estrutura atual
    scoring: {
      // Pesos por questão (compatível com metadata.scoring.weight)
      weights: {
        // Exemplo: 'classico': 1.5 dá mais peso ao estilo clássico
      },

      // Pesos específicos por opção (override)
      optionWeights: {
        // Exemplo: 'step-02': { 'classico_elegante': 2 }
      },

      // Peso geral de questões (compatível com ResultEngine)
      weightQuestions: 1
    }
  },

  // Stages flexíveis (de 1 a 30)
  // Estrutura compatível com QuizStepV3
  stages: [
    {
      id: 'step-01',
      name: 'Introdução',
      description: 'Primeira etapa do quiz',
      type: 'intro', // 'intro', 'question', 'transition', 'result'
      order: 0,
      blocks: [
        {
          id: 'block-1',
          type: 'heading',
          content: {
            text: 'Bem-vindo ao Quiz!',
            level: 1
          }
        }
      ],
      metadata: {
        // Peso desta etapa (usado por computeResult)
        scoring: {
          weight: 1
        }
      }
    },
    {
      id: 'step-02',
      name: 'Pergunta 1',
      description: 'Primeira pergunta',
      type: 'question',
      order: 1,
      blocks: [
        {
          id: 'block-2',
          type: 'question-single',
          content: {
            question: 'Qual é seu estilo preferido?',
            options: [
              {
                id: 'natural_confortavel',
                text: 'Confortável e Natural'
              },
              {
                id: 'classico_elegante',
                text: 'Clássico e Elegante'
              },
              {
                id: 'contemporaneo_moderno',
                text: 'Contemporâneo e Moderno'
              }
            ]
          }
        }
      ],
      metadata: {
        scoring: {
          weight: 1 // Peso desta pergunta no cálculo final
        }
      }
    }
  ]
};

export function JsonTemplateEditor({
  template,
  onTemplateChange,
  readOnly = false,
  templateId
}: JsonTemplateEditorProps) {
  const { toast } = useToast();

  const [jsonText, setJsonText] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  // Inicializar com template
  useEffect(() => {
    if (template) {
      try {
        const formatted = JSON.stringify(template, null, 2);
        setJsonText(formatted);
        setHasChanges(false);
      } catch (error) {
        appLogger.error('Erro ao formatar template:', { data: [error] });
      }
    } else {
      const newTemplate = { ...DEFAULT_TEMPLATE };
      if (templateId) {
        newTemplate.templateId = templateId;
      }
      setJsonText(JSON.stringify(newTemplate, null, 2));
    }
  }, [template, templateId]);

  // Validação completa do JSON
  const validateJson = useCallback((text: string): boolean => {
    const errors: ValidationError[] = [];

    try {
      const parsed = JSON.parse(text);

      // 🎯 JSON Schema validation (Draft 2020-12)
      const schemaResult: ValidationResult = validateTemplateV4(parsed);
      if (!schemaResult.valid && schemaResult.errors) {
        schemaResult.errors.forEach((error) => {
          errors.push({
            path: error.instancePath || '/schema',
            message: error.message || 'Schema validation error',
            severity: 'error'
          });
        });
      }

      // Validar campos obrigatórios
      if (!parsed.templateId) {
        errors.push({
          path: 'templateId',
          message: 'Campo "templateId" é obrigatório',
          severity: 'error'
        });
      }

      if (!parsed.name) {
        errors.push({
          path: 'name',
          message: 'Campo "name" é obrigatório',
          severity: 'error'
        });
      }

      if (!Array.isArray(parsed.stages)) {
        errors.push({
          path: 'stages',
          message: 'Campo "stages" deve ser um array',
          severity: 'error'
        });
      } else {
        // Validar número de stages (1-30)
        if (parsed.stages.length < 1) {
          errors.push({
            path: 'stages',
            message: 'Template deve ter pelo menos 1 stage',
            severity: 'error'
          });
        }

        if (parsed.stages.length > 30) {
          errors.push({
            path: 'stages',
            message: 'Template não pode ter mais de 30 stages',
            severity: 'error'
          });
        }

        // Validar cada stage
        parsed.stages.forEach((stage: any, index: number) => {
          if (!stage.id) {
            errors.push({
              path: `stages[${index}].id`,
              message: `Stage ${index + 1}: campo "id" é obrigatório`,
              severity: 'error'
            });
          }

          if (typeof stage.order !== 'number') {
            errors.push({
              path: `stages[${index}].order`,
              message: `Stage ${index + 1}: campo "order" deve ser um número`,
              severity: 'warning'
            });
          }

          if (!Array.isArray(stage.blocks)) {
            errors.push({
              path: `stages[${index}].blocks`,
              message: `Stage ${index + 1}: campo "blocks" deve ser um array`,
              severity: 'error'
            });
          } else {
            // Validar blocos
            stage.blocks.forEach((block: any, blockIndex: number) => {
              if (!block.id) {
                errors.push({
                  path: `stages[${index}].blocks[${blockIndex}].id`,
                  message: `Stage ${index + 1}, Block ${blockIndex + 1}: "id" obrigatório`,
                  severity: 'error'
                });
              }

              if (!block.type) {
                errors.push({
                  path: `stages[${index}].blocks[${blockIndex}].type`,
                  message: `Stage ${index + 1}, Block ${blockIndex + 1}: "type" obrigatório`,
                  severity: 'error'
                });
              }
            });
          }
        });
      }

      // Validar sistema de pontuação (se habilitado)
      if (parsed.scoring?.enabled) {
        if (!parsed.scoring.method) {
          errors.push({
            path: 'scoring.method',
            message: 'Método de pontuação é obrigatório quando scoring está habilitado',
            severity: 'error'
          });
        }

        if (parsed.scoring.method === 'weighted' && !Array.isArray(parsed.scoring.categories)) {
          errors.push({
            path: 'scoring.categories',
            message: 'Categorias são obrigatórias para método "weighted"',
            severity: 'error'
          });
        }

        if (!Array.isArray(parsed.scoring.classifications) || parsed.scoring.classifications.length === 0) {
          errors.push({
            path: 'scoring.classifications',
            message: 'Pelo menos uma classificação de resultado é necessária',
            severity: 'warning'
          });
        }
      }

      // Warnings para campos recomendados
      if (!parsed.description) {
        errors.push({
          path: 'description',
          message: 'Recomendado adicionar descrição',
          severity: 'warning'
        });
      }

      if (!parsed.version) {
        errors.push({
          path: 'version',
          message: 'Recomendado adicionar versão',
          severity: 'warning'
        });
      }

    } catch (error: any) {
      errors.push({
        path: 'root',
        message: `JSON inválido: ${error.message}`,
        severity: 'error'
      });
    }

    setValidationErrors(errors);
    const hasErrors = errors.some(e => e.severity === 'error');
    setIsValid(!hasErrors);

    return !hasErrors;
  }, []);

  const handleJsonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJsonText(newText);
    setHasChanges(true);
    validateJson(newText);
  }, [validateJson]);

  const handleApply = useCallback(() => {
    console.group('📝 [JsonTemplateEditor] handleApply chamado');
    appLogger.info('isValid:', { data: [isValid] });
    appLogger.info('hasChanges:', { data: [hasChanges] });
    appLogger.info('jsonText length:', { data: [jsonText.length] });

    if (!isValid) {
      appLogger.warn('❌ JSON inválido, abortando');
      console.groupEnd();
      toast({
        title: 'JSON inválido',
        description: 'Corrija os erros antes de aplicar',
        variant: 'destructive'
      });
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      appLogger.info('✅ JSON parseado com sucesso:', { data: [parsed] });
      appLogger.info('Chamando onTemplateChange:', { data: [typeof onTemplateChange] });
      appLogger.info('parsed.stages:', { data: [parsed.stages?.length || 0] });
      appLogger.info('parsed.blocks:', { data: [parsed.blocks?.length || 0] });

      onTemplateChange?.(parsed);
      appLogger.info('✅ onTemplateChange chamado');
      setHasChanges(false);

      toast({
        title: 'Template atualizado',
        description: `${parsed.stages?.length || parsed.blocks?.length || 0} itens configurados`,
      });
      console.groupEnd();
    } catch (error: any) {
      appLogger.error('❌ Erro ao aplicar:', { data: [error] });
      console.groupEnd();
      toast({
        title: 'Erro ao aplicar',
        description: error.message,
        variant: 'destructive'
      });
    }
  }, [jsonText, isValid, hasChanges, onTemplateChange, toast]);

  const handleExport = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${parsed.templateId || 'template'}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Template exportado',
        description: 'Arquivo JSON salvo',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao exportar',
        description: error.message,
        variant: 'destructive'
      });
    }
  }, [jsonText, toast]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        setJsonText(JSON.stringify(parsed, null, 2));
        setHasChanges(true);
        validateJson(text);

        toast({
          title: 'Template importado',
          description: `${parsed.stages?.length || 0} stages carregados`,
        });
      } catch (error: any) {
        toast({
          title: 'Erro ao importar',
          description: error.message,
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [validateJson, toast]);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);

      toast({
        title: 'JSON formatado',
        description: 'Código formatado com sucesso',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao formatar',
        description: 'JSON inválido',
        variant: 'destructive'
      });
    }
  }, [jsonText, toast]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(jsonText).then(() => {
      toast({
        title: 'Copiado!',
        description: 'JSON copiado para clipboard',
      });
    });
  }, [jsonText, toast]);

  // Estatísticas do template
  const stats = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonText);
      const stages = parsed.stages || [];
      const totalBlocks = stages.reduce((sum: number, stage: any) =>
        sum + (stage.blocks?.length || 0), 0
      );

      const scoringEnabled = parsed.scoring?.enabled || false;
      const numCategories = parsed.scoring?.categories?.length || 0;
      const numClassifications = parsed.scoring?.classifications?.length || 0;

      return {
        stages: stages.length,
        blocks: totalBlocks,
        size: new Blob([jsonText]).size,
        scoringEnabled,
        numCategories,
        numClassifications,
        stagesRange: `${stages.length}/30 etapas`,
        scoringMethod: parsed.scoring?.method || 'N/A'
      };
    } catch {
      return {
        stages: 0,
        blocks: 0,
        size: 0,
        scoringEnabled: false,
        numCategories: 0,
        numClassifications: 0,
        stagesRange: '0/30 etapas',
        scoringMethod: 'N/A'
      };
    }
  }, [jsonText]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Editor JSON - Sistema Flexível
            </CardTitle>
            <CardDescription>
              Suporte para 1-30 etapas com cálculo de resultados variáveis
            </CardDescription>
          </div>

          {isValid ? (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              Válido
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <XCircle className="h-4 w-4" />
              Inválido
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="scoring">Pontuação</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            {/* Grid de estatísticas rápidas */}
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center p-2 bg-muted rounded">
                <Layers className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <div className="font-semibold">{stats.stages}</div>
                <div className="text-muted-foreground">Stages</div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-semibold">{stats.blocks}</div>
                <div className="text-muted-foreground">Blocos</div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <Calculator className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <div className="font-semibold">{stats.scoringEnabled ? 'Sim' : 'Não'}</div>
                <div className="text-muted-foreground">Pontuação</div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-semibold">{(stats.size / 1024).toFixed(1)} KB</div>
                <div className="text-muted-foreground">Tamanho</div>
              </div>
            </div>

            {/* Validação */}
            {validationErrors.length > 0 && (
              <Alert variant={validationErrors.some(e => e.severity === 'error') ? 'destructive' : 'default'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-1">
                    {validationErrors.filter(e => e.severity === 'error').length} erros, {' '}
                    {validationErrors.filter(e => e.severity === 'warning').length} avisos
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {validationErrors.slice(0, 3).map((error, i) => (
                      <li key={i}>
                        <span className="font-mono text-xs">{error.path}</span>: {error.message}
                      </li>
                    ))}
                    {validationErrors.length > 3 && (
                      <li className="text-muted-foreground">
                        ... e mais {validationErrors.length - 3}
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={handleApply}
                disabled={!isValid || !hasChanges || readOnly}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Aplicar
              </Button>

              <Button onClick={handleFormat} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Formatar
              </Button>

              <Button onClick={handleCopy} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>

              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={readOnly}
                />
                <Button variant="outline" size="sm" disabled={readOnly}>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </Button>
              </div>
            </div>

            {/* Editor */}
            <div className="relative">
              <textarea
                value={jsonText}
                onChange={handleJsonChange}
                readOnly={readOnly}
                className="w-full h-[450px] p-4 font-mono text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Cole ou edite o JSON do template aqui..."
                spellCheck={false}
              />

              {hasChanges && !readOnly && (
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Não salvo
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Estrutura</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Etapas:</span>
                    <span className="font-semibold">{stats.stagesRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de Blocos:</span>
                    <span className="font-semibold">{stats.blocks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tamanho:</span>
                    <span className="font-semibold">{(stats.size / 1024).toFixed(2)} KB</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sistema de Pontuação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Habilitado:</span>
                    <span className={`font-semibold ${stats.scoringEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                      {stats.scoringEnabled ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Método:</span>
                    <span className="font-semibold">{stats.scoringMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Categorias:</span>
                    <span className="font-semibold">{stats.numCategories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Classificações:</span>
                    <span className="font-semibold">{stats.numClassifications}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scoring" className="space-y-4">
            <Alert>
              <Calculator className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">Sistema de Cálculo Flexível</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>simple:</strong> Soma simples de pontos</li>
                  <li><strong>weighted:</strong> Pontuação ponderada por categorias</li>
                  <li><strong>custom:</strong> Fórmulas personalizadas</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="text-sm space-y-2">
              <p className="font-semibold">Exemplo de Configuração:</p>
              <pre className="p-3 bg-muted rounded text-xs overflow-x-auto">
                {`"scoring": {
  "enabled": true,
  "method": "weighted",
  "categories": [
    {
      "id": "estilo",
      "name": "Estilo",
      "weight": 0.6,
      "scoreField": "score"
    }
  ],
  "classifications": [
    {
      "id": "classico",
      "name": "Clássico",
      "condition": {
        "type": "score_range",
        "min": 0,
        "max": 33
      }
    }
  ]
}`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
