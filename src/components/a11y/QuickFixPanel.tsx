import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Wand2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Image as ImageIcon,
  MousePointer,
  Layers,
  FileText
} from 'lucide-react';
import {
  fixMissingAltText,
  fixButtonLabels,
  fixDecorativeIcons,
  fixInputLabels,
  type QuickFixResult,
} from '@/lib/utils/a11yQuickFix';

interface FixOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  fixFunction: (container?: HTMLElement) => QuickFixResult;
  enabled: boolean;
}

export function QuickFixPanel() {
  const [fixes, setFixes] = useState<FixOption[]>([
    {
      id: 'alt-text',
      name: 'Alt Text em Imagens',
      description: 'Adiciona alt text genérico em imagens sem descrição',
      icon: ImageIcon,
      fixFunction: fixMissingAltText,
      enabled: true,
    },
    {
      id: 'button-labels',
      name: 'Labels de Botões',
      description: 'Adiciona aria-label em botões sem texto visível',
      icon: MousePointer,
      fixFunction: fixButtonLabels,
      enabled: true,
    },
    {
      id: 'decorative-icons',
      name: 'Ícones Decorativos',
      description: 'Marca ícones decorativos com aria-hidden',
      icon: Layers,
      fixFunction: fixDecorativeIcons,
      enabled: true,
    },
    {
      id: 'input-labels',
      name: 'Labels de Inputs',
      description: 'Adiciona aria-label em inputs sem label associado',
      icon: FileText,
      fixFunction: fixInputLabels,
      enabled: true,
    },
  ]);

  const [previewResults, setPreviewResults] = useState<Record<string, QuickFixResult> | null>(null);
  const [appliedResults, setAppliedResults] = useState<Record<string, QuickFixResult> | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const toggleFix = (id: string) => {
    setFixes((prev) =>
      prev.map((fix) => (fix.id === id ? { ...fix, enabled: !fix.enabled } : fix))
    );
    // Limpar preview quando mudar seleção
    setPreviewResults(null);
  };

  const runPreview = () => {
    const results: Record<string, QuickFixResult> = {};
    const enabledFixes = fixes.filter((f) => f.enabled);

    enabledFixes.forEach((fix) => {
      try {
        // Executar em um container clone para preview
        const clone = document.body.cloneNode(true) as HTMLElement;
        results[fix.id] = fix.fixFunction(clone);
      } catch (error) {
        console.error(`Erro ao preview ${fix.id}:`, error);
        results[fix.id] = {
          fixed: 0,
          skipped: 0,
          errors: [String(error)],
          details: [],
        };
      }
    });

    setPreviewResults(results);
  };

  const applyFixes = () => {
    setIsApplying(true);
    const results: Record<string, QuickFixResult> = {};
    const enabledFixes = fixes.filter((f) => f.enabled);

    try {
      enabledFixes.forEach((fix) => {
        results[fix.id] = fix.fixFunction(document.body);
      });

      setAppliedResults(results);
      setPreviewResults(null);

      // Feedback visual
      setTimeout(() => {
        setIsApplying(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao aplicar correções:', error);
      setIsApplying(false);
    }
  };

  const totalPreviewFixed = previewResults
    ? Object.values(previewResults).reduce((sum, r) => sum + r.fixed, 0)
    : 0;

  const totalApplied = appliedResults
    ? Object.values(appliedResults).reduce((sum, r) => sum + r.fixed, 0)
    : 0;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          <CardTitle>Correções Automáticas</CardTitle>
        </div>
        <CardDescription>
          Aplique correções básicas de acessibilidade automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Success Alert */}
        {appliedResults && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              ✅ <strong>{totalApplied} correções</strong> aplicadas com sucesso! Execute uma nova
              auditoria para verificar.
            </AlertDescription>
          </Alert>
        )}

        {/* Warning */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> Correções automáticas usam valores genéricos. Revise
            manualmente após aplicar.
          </AlertDescription>
        </Alert>

        {/* Fix Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Selecione as correções:</h4>
          {fixes.map((fix) => {
            const Icon = fix.icon;
            return (
              <div
                key={fix.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <Checkbox
                  id={fix.id}
                  checked={fix.enabled}
                  onCheckedChange={() => toggleFix(fix.id)}
                />
                <div className="flex-1 space-y-1">
                  <label
                    htmlFor={fix.id}
                    className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                    {fix.name}
                  </label>
                  <p className="text-xs text-muted-foreground">{fix.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Preview Results */}
        {previewResults && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview das Correções
            </h4>
            <ScrollArea className="h-[200px] rounded-lg border p-3 bg-muted/30">
              <div className="space-y-3">
                {Object.entries(previewResults).map(([id, result]) => {
                  const fix = fixes.find((f) => f.id === id);
                  if (!fix) return null;

                  return (
                    <div key={id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{fix.name}</span>
                        <div className="flex gap-2">
                          {result.fixed > 0 && (
                            <Badge variant="default" className="text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {result.fixed} correções
                            </Badge>
                          )}
                          {result.skipped > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {result.skipped} ignorados
                            </Badge>
                          )}
                          {result.errors.length > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              <XCircle className="h-3 w-3 mr-1" />
                              {result.errors.length} erros
                            </Badge>
                          )}
                        </div>
                      </div>
                      {result.details.length > 0 && (
                        <div className="text-xs text-muted-foreground pl-2 space-y-1">
                          {result.details.slice(0, 3).map((detail, i) => (
                            <div key={i}>• {detail}</div>
                          ))}
                          {result.details.length > 3 && (
                            <div className="italic">
                              ... e mais {result.details.length - 3} correções
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                Total: <strong>{totalPreviewFixed} correções</strong> serão aplicadas
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={runPreview}
            variant="outline"
            className="flex-1"
            disabled={!fixes.some((f) => f.enabled) || isApplying}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={applyFixes}
            className="flex-1"
            disabled={!previewResults || isApplying}
          >
            {isApplying ? (
              <>Aplicando...</>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Aplicar Correções
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
