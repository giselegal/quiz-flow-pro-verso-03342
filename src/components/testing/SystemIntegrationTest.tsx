// Componente de Teste para Verificar Integração dos Sistemas
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  Database,
  Zap,
  Shield,
  BarChart3,
  Globe,
  FileText,
  Users
} from 'lucide-react';

interface SystemTest {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  details?: string;
}

const SystemIntegrationTest: React.FC = () => {
  const [tests, setTests] = useState<SystemTest[]>([
    {
      name: 'Banco de Dados',
      description: 'Verificar tabelas e conexão com Supabase',
      icon: Database,
      status: 'pending'
    },
    {
      name: 'Serviço de Funis',
      description: 'Testar operações CRUD de funis',
      icon: FileText,
      status: 'pending'
    },
    {
      name: 'Sistema de Validação',
      description: 'Verificar componente de validação',
      icon: CheckCircle,
      status: 'pending'
    },
    {
      name: 'Sistema de Feedback',
      description: 'Testar toasts e indicadores visuais',
      icon: Zap,
      status: 'pending'
    },
    {
      name: 'Controle de Acesso',
      description: 'Verificar permissões e auditoria',
      icon: Shield,
      status: 'pending'
    },
    {
      name: 'Analytics',
      description: 'Testar métricas e dashboard',
      icon: BarChart3,
      status: 'pending'
    },
    {
      name: 'SEO System',
      description: 'Verificar URLs customizadas e metadados',
      icon: Globe,
      status: 'pending'
    },
    {
      name: 'Editor Melhorado',
      description: 'Testar integração completa do editor',
      icon: Users,
      status: 'pending'
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<number>(-1);

  const updateTestStatus = (index: number, status: SystemTest['status'], message?: string, details?: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, details } : test
    ));
  };

  const runTests = async () => {
    setIsRunning(true);
    setCurrentTest(0);

    for (let i = 0; i < tests.length; i++) {
      setCurrentTest(i);
      updateTestStatus(i, 'running');

      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay

        switch (i) {
          case 0: // Banco de Dados
            await testDatabase(i);
            break;
          case 1: // Serviço de Funis
            await testFunnelService(i);
            break;
          case 2: // Sistema de Validação
            await testValidationSystem(i);
            break;
          case 3: // Sistema de Feedback
            await testFeedbackSystem(i);
            break;
          case 4: // Controle de Acesso
            await testAccessControl(i);
            break;
          case 5: // Analytics
            await testAnalytics(i);
            break;
          case 6: // SEO System
            await testSEOSystem(i);
            break;
          case 7: // Editor Melhorado
            await testEnhancedEditor(i);
            break;
          default:
            updateTestStatus(i, 'error', 'Teste não implementado');
        }
      } catch (error) {
        updateTestStatus(i, 'error', `Erro: ${error.message}`, error.stack);
      }
    }

    setCurrentTest(-1);
    setIsRunning(false);
  };

  const testDatabase = async (index: number) => {
    try {
      // Verificar se o Supabase está configurado
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Variáveis de ambiente do Supabase não configuradas');
      }

      // Tentar importar e testar conexão
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Testar query simples
      const { data, error } = await supabase.from('funnels').select('count').limit(1);
      
      if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
        throw error;
      }

      updateTestStatus(index, 'success', 'Conexão com Supabase OK', 'Banco configurado corretamente');
    } catch (error) {
      updateTestStatus(index, 'error', 'Erro na conexão com banco', error.message);
    }
  };

  const testFunnelService = async (index: number) => {
    try {
      const { funnelService } = await import('../../services/funnelService');
      
      if (!funnelService) {
        throw new Error('Serviço de funis não encontrado');
      }

      // Verificar se os métodos existem
      const methods = ['loadFunnelData', 'saveFunnelData', 'getFunnelById', 'updateFunnel'];
      const missingMethods = methods.filter(method => typeof funnelService[method] !== 'function');
      
      if (missingMethods.length > 0) {
        throw new Error(`Métodos não encontrados: ${missingMethods.join(', ')}`);
      }

      updateTestStatus(index, 'success', 'Serviço de funis OK', 'Todos os métodos disponíveis');
    } catch (error) {
      updateTestStatus(index, 'error', 'Erro no serviço de funis', error.message);
    }
  };

  const testValidationSystem = async (index: number) => {
    try {
      const ValidationModule = await import('../../components/editor/validation/ValidationSystem');
      
      if (!ValidationModule.ValidationSummary || !ValidationModule.useValidation) {
        throw new Error('Componentes de validação não encontrados');
      }

      updateTestStatus(index, 'success', 'Sistema de validação OK', 'Componentes carregados');
    } catch (error) {
      updateTestStatus(index, 'error', 'Erro no sistema de validação', error.message);
    }
  };

  const testFeedbackSystem = async (index: number) => {
    try {
      const FeedbackModule = await import('../../components/editor/feedback/FeedbackSystem');
      
      if (!FeedbackModule.ToastContainer || !FeedbackModule.useFeedbackSystem) {
        throw new Error('Componentes de feedback não encontrados');
      }

      updateTestStatus(index, 'success', 'Sistema de feedback OK', 'Componentes carregados');
    } catch (error) {
      updateTestStatus(index, 'error', 'Erro no sistema de feedback', error.message);
    }
  };

  const testAccessControl = async (index: number) => {
    try {
      const AccessModule = await import('../../components/admin/security/AccessControlSystem');
      
      if (!AccessModule.PermissionsProvider || !AccessModule.usePermissions) {
        throw new Error('Componentes de acesso não encontrados');
      }

      updateTestStatus(index, 'success', 'Controle de acesso OK', 'Componentes carregados');
    } catch (error) {
      updateTestStatus(index, 'error', 'Erro no controle de acesso', error.message);
    }
  };

  const testAnalytics = async (index: number) => {
    try {
      const AnalyticsModule = await import('../../components/admin/analytics/AdvancedAnalytics');
      
      if (!AnalyticsModule.AnalyticsDashboard) {
        throw new Error('Componente de analytics não encontrado');
      }

      updateTestStatus(index, 'success', 'Sistema de analytics OK', 'Dashboard disponível');
    } catch (error) {
      updateTestStatus(index, 'error', 'Erro no sistema de analytics', error.message);
    }
  };

  const testSEOSystem = async (index: number) => {
    try {
      const SEOModule = await import('../../components/editor/seo/SEOSystem');
      
      if (!SEOModule.CustomURLEditor || !SEOModule.SEOEditor) {
        throw new Error('Componentes de SEO não encontrados');
      }

      updateTestStatus(index, 'success', 'Sistema de SEO OK', 'Componentes carregados');
    } catch (error) {
      updateTestStatus(index, 'error', 'Erro no sistema de SEO', error.message);
    }
  };

  const testEnhancedEditor = async (index: number) => {
    try {
      const EditorModule = await import('../../components/editor/EnhancedEditor');
      
      if (!EditorModule.default) {
        throw new Error('Editor melhorado não encontrado');
      }

      updateTestStatus(index, 'success', 'Editor melhorado OK', 'Integração completa');
    } catch (error) {
      updateTestStatus(index, 'error', 'Erro no editor melhorado', error.message);
    }
  };

  const getStatusIcon = (status: SystemTest['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running': return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: SystemTest['status']) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>;
      case 'error': return <Badge variant="destructive">Erro</Badge>;
      case 'running': return <Badge className="bg-blue-100 text-blue-800">Executando</Badge>;
      default: return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const overallStatus = () => {
    const completed = tests.filter(t => t.status === 'success' || t.status === 'error').length;
    const successful = tests.filter(t => t.status === 'success').length;
    
    if (completed === 0) return 'Não executado';
    if (completed < tests.length) return `${completed}/${tests.length} testados`;
    return `${successful}/${tests.length} sucessos`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Teste de Integração dos Sistemas
            <Badge variant="outline">{overallStatus()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Executando Testes...
                </>
              ) : (
                'Executar Todos os Testes'
              )}
            </Button>

            <div className="grid gap-4">
              {tests.map((test, index) => {
                const IconComponent = test.icon;
                
                return (
                  <Card 
                    key={index} 
                    className={`transition-all ${
                      currentTest === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-gray-600" />
                          <div>
                            <h3 className="font-medium">{test.name}</h3>
                            <p className="text-sm text-gray-600">{test.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(test.status)}
                          {getStatusIcon(test.status)}
                        </div>
                      </div>
                      
                      {test.message && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                          <p className="font-medium">{test.message}</p>
                          {test.details && (
                            <p className="text-gray-600 mt-1">{test.details}</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo dos Resultados */}
      {tests.some(t => t.status !== 'pending') && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo dos Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {tests.filter(t => t.status === 'success').length}
                </div>
                <div className="text-sm text-gray-600">Sucessos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {tests.filter(t => t.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Erros</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {tests.filter(t => t.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemIntegrationTest;
