import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const Step20IntegrationGuide: React.FC = () => {
    const { toast } = useToast();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Código copiado!",
            description: "O código foi copiado para a área de transferência.",
        });
    };

    const codeExamples = {
        basicUsage: `import { useStep20Configuration } from '@/hooks/useStep20Configuration';

export const QuizResultPage = () => {
  const { configuration, getBackgroundStyle, getResultIcon } = useStep20Configuration();

  return (
    <div style={getBackgroundStyle()}>
      <h1>{configuration.pageTitle}</h1>
      <p>{configuration.resultMessage}</p>
      {configuration.showResultIcon && (
        <div className="text-6xl">{getResultIcon()}</div>
      )}
      <button>{configuration.ctaButtonText}</button>
    </div>
  );
};`,

        routerIntegration: `// Em App.tsx
import { Route, Router, Switch } from 'wouter';

function App() {
  return (
    <Router>
      <Switch>
        {/* Etapas regulares */}
        <Route path="/step/:step" component={StepPage} />
        
        {/* Página de resultado especializada */}
        <Route path="/step20" component={QuizResultPage} />
        
        {/* Outras rotas */}
        <Route path="/" component={HomePage} />
      </Switch>
    </Router>
  );
}`,

        storeUpdate: `// Para atualizar configurações programaticamente
import { useStep20Configuration } from '@/hooks/useStep20Configuration';

const { updateConfiguration } = useStep20Configuration();

// Atualizar titulo dinamicamente
updateConfiguration({
  pageTitle: 'Seu Resultado Personalizado!',
  ctaButtonText: 'Ver Oferta Especial'
});`,

        noCodeIntegration: `// Integração com sistema NoCode
import { useStep20NoCodeIntegration } from '@/hooks/useStep20Configuration';

export const NoCodeConfigPanel = () => {
  const { configuration, updateConfiguration, applyToStepNavigation } = useStep20NoCodeIntegration();
  
  // Aplicar configurações ao sistema de navegação
  const navConfig = applyToStepNavigation();
  
  return (
    <div>
      <input 
        value={configuration.pageTitle}
        onChange={(e) => updateConfiguration({ pageTitle: e.target.value })}
      />
    </div>
  );
};`
    };

    return (
        <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
            <CardHeader>
                <CardTitle className="text-[#432818] flex items-center gap-2">
                    <Code className="w-5 h-5" style={{ color: '#B89B7A' }} />
                    Guia de Integração - Etapa 20 NoCode
                </CardTitle>
                <p className="text-sm text-[#6B4F43]">
                    Exemplos de código para usar as configurações NoCode da Etapa 20
                </p>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Uso Básico */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#432818]">1. Uso Básico do Hook</h3>
                        <Button
                            onClick={() => copyToClipboard(codeExamples.basicUsage)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            Copiar
                        </Button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm">
                            <code>{codeExamples.basicUsage}</code>
                        </pre>
                    </div>
                </div>

                {/* Integração com Router */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#432818]">2. Configuração de Rotas</h3>
                        <Button
                            onClick={() => copyToClipboard(codeExamples.routerIntegration)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            Copiar
                        </Button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm">
                            <code>{codeExamples.routerIntegration}</code>
                        </pre>
                    </div>
                </div>

                {/* Atualização Programática */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#432818]">3. Atualização Programática</h3>
                        <Button
                            onClick={() => copyToClipboard(codeExamples.storeUpdate)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            Copiar
                        </Button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm">
                            <code>{codeExamples.storeUpdate}</code>
                        </pre>
                    </div>
                </div>

                {/* Integração NoCode */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#432818]">4. Integração NoCode Completa</h3>
                        <Button
                            onClick={() => copyToClipboard(codeExamples.noCodeIntegration)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            Copiar
                        </Button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm">
                            <code>{codeExamples.noCodeIntegration}</code>
                        </pre>
                    </div>
                </div>

                {/* Recursos Disponíveis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                        <h4 className="font-semibold text-[#432818] mb-2">🎨 Configurações Visuais</h4>
                        <ul className="text-sm text-[#6B4F43] space-y-1">
                            <li>• Background gradiente personalizado</li>
                            <li>• Ícones de resultado (troféu, estrela, etc.)</li>
                            <li>• Cores e tipografia</li>
                            <li>• Layout responsivo</li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                        <h4 className="font-semibold text-[#432818] mb-2">⚙️ Funcionalidades</h4>
                        <ul className="text-sm text-[#6B4F43] space-y-1">
                            <li>• Compartilhamento social</li>
                            <li>• CTAs personalizados</li>
                            <li>• Mensagens de próximos passos</li>
                            <li>• URL dedicada (/step20)</li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FED7AA' }}>
                        <h4 className="font-semibold text-[#432818] mb-2">🔧 Persistência</h4>
                        <ul className="text-sm text-[#6B4F43] space-y-1">
                            <li>• Configurações salvas no localStorage</li>
                            <li>• Sincronização automática</li>
                            <li>• Backup e restore</li>
                            <li>• Versionamento de configurações</li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                        <h4 className="font-semibold text-[#432818] mb-2">📊 Analytics</h4>
                        <ul className="text-sm text-[#6B4F43] space-y-1">
                            <li>• Tracking específico da página</li>
                            <li>• Métricas de conversão</li>
                            <li>• A/B testing de configurações</li>
                            <li>• Relatórios de performance</li>
                        </ul>
                    </div>
                </div>

                {/* Links Úteis */}
                <div className="pt-6 border-t border-[#E6DDD4]">
                    <h4 className="font-semibold text-[#432818] mb-4">📚 Recursos Adicionais</h4>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => window.open('/docs/step20-configuration', '_blank')}
                        >
                            <ExternalLink className="w-4 h-4" />
                            Documentação Completa
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => window.open('/examples/step20-templates', '_blank')}
                        >
                            <ExternalLink className="w-4 h-4" />
                            Templates de Exemplo
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => window.open('/api/step20-reference', '_blank')}
                        >
                            <ExternalLink className="w-4 h-4" />
                            Referência da API
                        </Button>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};

export default Step20IntegrationGuide;
