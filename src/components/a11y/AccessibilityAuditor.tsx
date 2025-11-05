import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Info, Book, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface A11yIssue {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  nodes: string[];
}

/**
 * Componente de auditoria de acessibilidade
 * 
 * Usa axe-core para analisar a página em tempo real
 */
export const AccessibilityAuditor: React.FC = () => {
  const [issues, setIssues] = useState<A11yIssue[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  const runAudit = async () => {
    setIsRunning(true);
    
    try {
      // Importar axe-core dinamicamente
      const axe = await import('axe-core');
      
      // Configurar regras WCAG 2.1 AA
      const config = {
        runOnly: {
          type: 'tag' as const,
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
        rules: {
          // Habilitar regras específicas importantes
          'color-contrast': { enabled: true },
          'html-has-lang': { enabled: true },
          'label': { enabled: true },
          'link-name': { enabled: true },
          'button-name': { enabled: true },
          'image-alt': { enabled: true },
          'input-button-name': { enabled: true },
          'valid-lang': { enabled: true },
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
          'landmark-one-main': { enabled: true },
          'page-has-heading-one': { enabled: true },
          'region': { enabled: true },
        },
      };

      // Executar análise no documento inteiro
      console.log('🔍 Iniciando análise de acessibilidade...');
      const results = await axe.default.run(document, config);
      
      console.log('📊 Análise completa:', {
        violations: results.violations.length,
        passes: results.passes.length,
        incomplete: results.incomplete.length,
      });

      // Processar violações
      const processedIssues: A11yIssue[] = results.violations.map((violation) => ({
        id: violation.id,
        impact: (violation.impact || 'minor') as A11yIssue['impact'],
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map((node) => {
          // Extrair HTML do elemento
          const html = node.html;
          // Limitar tamanho para exibição
          return html.length > 150 ? html.substring(0, 150) + '...' : html;
        }),
      }));

      // Ordenar por severidade (crítico → sério → moderado → menor)
      const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
      processedIssues.sort((a, b) => severityOrder[a.impact] - severityOrder[b.impact]);

      setIssues(processedIssues);
      setLastRun(new Date());

      // Log resumo
      console.log('✅ Auditoria concluída:', {
        total: processedIssues.length,
        critical: processedIssues.filter(i => i.impact === 'critical').length,
        serious: processedIssues.filter(i => i.impact === 'serious').length,
        moderate: processedIssues.filter(i => i.impact === 'moderate').length,
        minor: processedIssues.filter(i => i.impact === 'minor').length,
      });
    } catch (error) {
      console.error('❌ Erro ao executar auditoria de acessibilidade:', error);
      
      // Exibir erro para o usuário
      const errorIssue: A11yIssue = {
        id: 'audit-error',
        impact: 'critical',
        description: `Erro ao executar auditoria: ${error instanceof Error ? error.message : String(error)}`,
        help: 'Falha ao carregar axe-core',
        helpUrl: 'https://github.com/dequelabs/axe-core',
        nodes: ['Erro na execução da auditoria'],
      };
      
      setIssues([errorIssue]);
    } finally {
      setIsRunning(false);
    }
  };

  const getImpactColor = (impact: A11yIssue['impact']) => {
    switch (impact) {
      case 'critical':
        return 'destructive';
      case 'serious':
        return 'destructive';
      case 'moderate':
        return 'warning';
      case 'minor':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getImpactIcon = (impact: A11yIssue['impact']) => {
    switch (impact) {
      case 'critical':
      case 'serious':
        return <AlertTriangle className="h-4 w-4" />;
      case 'moderate':
        return <Info className="h-4 w-4" />;
      case 'minor':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const issuesByImpact = {
    critical: issues.filter((i) => i.impact === 'critical'),
    serious: issues.filter((i) => i.impact === 'serious'),
    moderate: issues.filter((i) => i.impact === 'moderate'),
    minor: issues.filter((i) => i.impact === 'minor'),
  };

  return (
    <div className="space-y-4">
      {/* Guia de Primeira Auditoria */}
      {showGuide && !lastRun && (
        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <Book className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900 dark:text-blue-100">
            🚀 Primeira Auditoria de Acessibilidade
          </AlertTitle>
          <AlertDescription className="text-blue-800 dark:text-blue-200 space-y-2">
            <p className="text-sm">
              <strong>Passo 1:</strong> Clique em "Executar Auditoria" abaixo (aguarde 2-5s)
            </p>
            <p className="text-sm">
              <strong>Passo 2:</strong> Veja resultados agrupados por severidade
            </p>
            <p className="text-sm">
              <strong>Passo 3:</strong> Priorize correções: Críticos (hoje) → Sérios (amanhã)
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowGuide(false)}
                className="text-xs"
              >
                Entendi
              </Button>
              <a
                href="/docs/A11Y_QUICK_START.md"
                target="_blank"
                className="text-xs flex items-center gap-1 text-blue-700 hover:text-blue-900 dark:text-blue-300"
              >
                Ver guia completo <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Dica de Correção Rápida */}
      {lastRun && issues.length > 0 && (
        <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
          <Zap className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900 dark:text-amber-100">
            💡 Dica: Correções Rápidas
          </AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <p className="text-sm mb-2">
              Abra o DevTools Console e cole para ver preview:
            </p>
            <pre className="bg-amber-100 dark:bg-amber-900 p-2 rounded text-xs overflow-x-auto">
              {`const axe = await import('axe-core');
const results = await axe.default.run();
console.table(results.violations.map(v => ({
  id: v.id, impact: v.impact, count: v.nodes.length
})));`}
            </pre>
            <p className="text-xs mt-2">
              📚 Guia completo: <code className="bg-amber-200 dark:bg-amber-800 px-1 rounded">docs/A11Y_COMMON_FIXES.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Auditoria de Acessibilidade</CardTitle>
            </div>
            <Button
              onClick={runAudit}
              disabled={isRunning}
              size="sm"
            >
              {isRunning ? 'Analisando...' : 'Executar Auditoria'}
            </Button>
          </div>
          <CardDescription>
            Análise WCAG 2.1 AA com axe-core v{typeof window !== 'undefined' && (window as any).axe?.version || '4.x'}
            {lastRun && (
              <span className="ml-2 text-xs">
                • Última execução: {lastRun.toLocaleTimeString()}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Resumo */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="border-destructive/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Críticos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-destructive">
                  {issuesByImpact.critical.length}
                </p>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sérios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-500">
                  {issuesByImpact.serious.length}
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Moderados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-500">
                  {issuesByImpact.moderate.length}
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Menores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-500">
                  {issuesByImpact.minor.length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Issues */}
          {issues.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Problemas Encontrados</h3>
              {issues.map((issue, idx) => (
                <Card key={`${issue.id}-${idx}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        {getImpactIcon(issue.impact)}
                        <div className="flex-1">
                          <CardTitle className="text-sm">{issue.help}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {issue.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getImpactColor(issue.impact) as any}>
                        {issue.impact}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs">
                      <p className="font-medium mb-1">
                        Elementos afetados: {issue.nodes.length}
                      </p>
                      {issue.nodes.slice(0, 2).map((html, nodeIdx) => (
                        <pre
                          key={nodeIdx}
                          className="bg-muted p-2 rounded text-xs overflow-x-auto mb-1"
                        >
                          {html}
                        </pre>
                      ))}
                      {issue.nodes.length > 2 && (
                        <p className="text-muted-foreground">
                          +{issue.nodes.length - 2} mais...
                        </p>
                      )}
                    </div>
                    <a
                      href={issue.helpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Saiba mais →
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {issues.length === 0 && lastRun && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-lg font-semibold">Nenhum problema encontrado!</p>
              <p className="text-sm text-muted-foreground">
                Sua aplicação está em conformidade com WCAG 2.1 AA
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityAuditor;
