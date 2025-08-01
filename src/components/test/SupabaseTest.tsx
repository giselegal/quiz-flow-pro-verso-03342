import React, { useEffect, useState } from 'react';
import { useFunnels } from '../../context/FunnelsContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Loader2, CheckCircle, XCircle, RefreshCw, Database, Server, Clipboard, AlertCircle, Eye } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { toast } from '../../components/ui/use-toast';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { Progress } from '../../components/ui/progress';

/**
 * Componente para testar integração com Supabase para funis
 */
export const SupabaseTest: React.FC = () => {
  const { 
    funnels, 
    addFunnel, 
    updateFunnel, 
    deleteFunnel, 
    duplicateFunnel,
    isLoading 
  } = useFunnels();
  
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [supabaseFunnels, setSupabaseFunnels] = useState<any[]>([]);
  const [supabasePages, setSupabasePages] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [activeTest, setActiveTest] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  
  // Função para checar se o Supabase está conectado
  const checkSupabaseConnection = async () => {
    setActiveTest('connection');
    try {
      const { data, error } = await supabase.from('funnels').select('count');
      if (error) throw error;
      
      setTestResults(prev => ({
        ...prev,
        connection: { 
          success: true, 
          message: 'Conexão com Supabase estabelecida com sucesso!'
        }
      }));
      return true;
    } catch (error) {
      console.error('Erro ao conectar ao Supabase:', error);
      setTestResults(prev => ({
        ...prev,
        connection: { 
          success: false, 
          message: `Erro ao conectar: ${error.message || 'Desconhecido'}`
        }
      }));
      return false;
    }
  };

  // Função para testar a criação de um funil
  const testCreateFunnel = async () => {
    setActiveTest('create');
    try {
      const testName = `Funil Teste ${new Date().toISOString().slice(11, 19)}`;
      const funnelId = await addFunnel(testName, 'quiz-estilo');
      
      // Verificar se o funil foi criado no Supabase
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', funnelId)
        .single();
      
      if (error) throw error;
      
      // Verificar se páginas foram criadas
      const { data: pages, error: pagesError } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', funnelId);
      
      if (pagesError) throw pagesError;
      
      setTestResults(prev => ({
        ...prev,
        create: { 
          success: true, 
          message: `Funil "${testName}" criado com ID: ${funnelId}. ${pages?.length || 0} páginas criadas.`
        }
      }));
      
      // Salvar o ID para teste de exclusão
      localStorage.setItem('testFunnelId', funnelId);
      
      return funnelId;
    } catch (error) {
      console.error('Erro ao criar funil de teste:', error);
      setTestResults(prev => ({
        ...prev,
        create: { 
          success: false, 
          message: `Erro ao criar funil: ${error.message || 'Desconhecido'}`
        }
      }));
      return null;
    }
  };

  // Função para testar a atualização de um funil
  const testUpdateFunnel = async (funnelId: string) => {
    setActiveTest('update');
    try {
      const updatedName = `Funil Atualizado ${new Date().toISOString().slice(11, 19)}`;
      await updateFunnel(funnelId, {
        name: updatedName,
        description: 'Descrição atualizada via teste',
        theme: 'dark'
      });
      
      // Verificar se o funil foi atualizado no Supabase
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', funnelId)
        .single();
      
      if (error) throw error;
      
      const success = data.name === updatedName;
      
      setTestResults(prev => ({
        ...prev,
        update: { 
          success, 
          message: success 
            ? `Funil atualizado para "${updatedName}" com sucesso!` 
            : `Falha na atualização: nome esperado "${updatedName}", mas encontrado "${data.name}"`
        }
      }));
      
      return success;
    } catch (error) {
      console.error('Erro ao atualizar funil de teste:', error);
      setTestResults(prev => ({
        ...prev,
        update: { 
          success: false, 
          message: `Erro ao atualizar funil: ${error.message || 'Desconhecido'}`
        }
      }));
      return false;
    }
  };

  // Função para testar a duplicação de um funil
  const testDuplicateFunnel = async (funnelId: string) => {
    setActiveTest('duplicate');
    try {
      const duplicateName = `Funil Duplicado ${new Date().toISOString().slice(11, 19)}`;
      const newFunnelId = await duplicateFunnel(funnelId, duplicateName);
      
      if (!newFunnelId) throw new Error('ID do funil duplicado não retornado');
      
      // Verificar se o funil foi duplicado no Supabase
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', newFunnelId)
        .single();
      
      if (error) throw error;
      
      // Verificar se páginas foram duplicadas
      const { data: pages, error: pagesError } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', newFunnelId);
      
      if (pagesError) throw pagesError;
      
      setTestResults(prev => ({
        ...prev,
        duplicate: { 
          success: true, 
          message: `Funil duplicado como "${duplicateName}" com ID: ${newFunnelId}. ${pages?.length || 0} páginas duplicadas.`
        }
      }));
      
      // Salvar o ID do funil duplicado para teste de exclusão
      localStorage.setItem('testDuplicateFunnelId', newFunnelId);
      
      return true;
    } catch (error) {
      console.error('Erro ao duplicar funil de teste:', error);
      setTestResults(prev => ({
        ...prev,
        duplicate: { 
          success: false, 
          message: `Erro ao duplicar funil: ${error.message || 'Desconhecido'}`
        }
      }));
      return false;
    }
  };

  // Função para testar a exclusão de um funil
  const testDeleteFunnel = async (funnelId: string) => {
    setActiveTest('delete');
    try {
      await deleteFunnel(funnelId);
      
      // Verificar se o funil foi excluído do Supabase
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', funnelId);
      
      if (error) throw error;
      
      const success = !data || data.length === 0;
      
      setTestResults(prev => ({
        ...prev,
        delete: { 
          success, 
          message: success 
            ? `Funil com ID ${funnelId} excluído com sucesso!` 
            : `Falha na exclusão: funil com ID ${funnelId} ainda existe no Supabase`
        }
      }));
      
      return success;
    } catch (error) {
      console.error('Erro ao excluir funil de teste:', error);
      setTestResults(prev => ({
        ...prev,
        delete: { 
          success: false, 
          message: `Erro ao excluir funil: ${error.message || 'Desconhecido'}`
        }
      }));
      return false;
    }
  };

  // Função para carregar dados do Supabase para verificação
  const loadSupabaseData = async () => {
    try {
      const { data: funnelsData, error: funnelsError } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (funnelsError) throw funnelsError;
      setSupabaseFunnels(funnelsData || []);
      
      const { data: pagesData, error: pagesError } = await supabase
        .from('funnel_pages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (pagesError) throw pagesError;
      setSupabasePages(pagesData || []);
      
      toast({
        title: 'Dados atualizados',
        description: `Carregados ${funnelsData?.length || 0} funis e ${pagesData?.length || 0} páginas`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Erro ao carregar dados do Supabase:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: `Não foi possível carregar dados do Supabase: ${error.message || 'Erro desconhecido'}`,
        variant: 'destructive'
      });
    }
  };

  // Executar todos os testes em sequência
  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({});
    setProgress(0);
    
    try {
      // Testar conexão
      setProgress(10);
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) throw new Error('Falha na conexão com o Supabase');
      setProgress(20);
      
      // Testar criação
      const funnelId = await testCreateFunnel();
      if (!funnelId) throw new Error('Falha na criação do funil');
      setProgress(40);
      
      // Testar atualização
      const updateSuccess = await testUpdateFunnel(funnelId);
      if (!updateSuccess) throw new Error('Falha na atualização do funil');
      setProgress(60);
      
      // Testar duplicação
      const duplicateSuccess = await testDuplicateFunnel(funnelId);
      if (!duplicateSuccess) throw new Error('Falha na duplicação do funil');
      setProgress(80);
      
      // Testar exclusão do funil duplicado
      const duplicateFunnelId = localStorage.getItem('testDuplicateFunnelId');
      if (duplicateFunnelId) {
        const deleteSuccess = await testDeleteFunnel(duplicateFunnelId);
        if (!deleteSuccess) console.warn('Aviso: Falha na exclusão do funil duplicado');
      }
      
      // Testar exclusão do funil original
      const deleteSuccess = await testDeleteFunnel(funnelId);
      if (!deleteSuccess) throw new Error('Falha na exclusão do funil');
      setProgress(100);
      
      // Carregar dados atualizados
      await loadSupabaseData();
      
      toast({
        title: 'Testes concluídos',
        description: 'Todos os testes foram executados com sucesso!',
        variant: 'default'
      });
    } catch (error) {
      console.error('Erro nos testes:', error);
      toast({
        title: 'Erro nos testes',
        description: `Ocorreu um erro durante os testes: ${error.message || 'Erro desconhecido'}`,
        variant: 'destructive'
      });
    } finally {
      setActiveTest('');
      setIsRunningTests(false);
    }
  };

  // Carregar dados do Supabase ao montar o componente
  useEffect(() => {
    if (!isLoading) {
      loadSupabaseData();
    }
  }, [isLoading]);

  const getTestIcon = (key: string) => {
    if (!testResults[key]) return <AlertCircle className="h-5 w-5 text-gray-300" />;
    return testResults[key].success 
      ? <CheckCircle className="h-5 w-5 text-green-500" />
      : <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getTestStatus = (key: string) => {
    if (isRunningTests && activeTest === key) return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    return getTestIcon(key);
  };

  return (
    <div className="container py-6 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diagnóstico de Integração</h1>
          <p className="text-muted-foreground mt-1">
            Verifique a integração dos funis com o Supabase
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadSupabaseData}
            variant="outline"
            size="sm"
            disabled={isRunningTests}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar dados
          </Button>
          <Button 
            onClick={runAllTests} 
            disabled={isRunningTests} 
            size="sm"
          >
            {isRunningTests ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Executando testes...
              </>
            ) : (
              <>
                <Server className="h-4 w-4 mr-2" />
                Executar testes
              </>
            )}
          </Button>
        </div>
      </div>

      {isRunningTests && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progresso dos testes</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tests">Status dos Testes</TabsTrigger>
          <TabsTrigger value="supabase">Dados no Supabase</TabsTrigger>
          <TabsTrigger value="local">Estado Local</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tests" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Conexão</CardTitle>
                </div>
                <CardDescription>
                  Teste de conectividade com Supabase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getTestStatus('connection')}
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {testResults.connection 
                        ? testResults.connection.success 
                          ? 'Conectado com sucesso' 
                          : 'Falha na conexão'
                        : 'Aguardando teste'}
                    </p>
                    {testResults.connection && (
                      <p className={`text-sm ${testResults.connection.success ? 'text-green-600' : 'text-red-600'}`}>
                        {testResults.connection.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Criação</CardTitle>
                </div>
                <CardDescription>
                  Teste de criação de novo funil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getTestStatus('create')}
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {testResults.create 
                        ? testResults.create.success 
                          ? 'Funil criado com sucesso' 
                          : 'Falha na criação'
                        : 'Aguardando teste'}
                    </p>
                    {testResults.create && (
                      <p className={`text-sm ${testResults.create.success ? 'text-green-600' : 'text-red-600'}`}>
                        {testResults.create.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Atualização</CardTitle>
                </div>
                <CardDescription>
                  Teste de atualização de funil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getTestStatus('update')}
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {testResults.update 
                        ? testResults.update.success 
                          ? 'Funil atualizado com sucesso' 
                          : 'Falha na atualização'
                        : 'Aguardando teste'}
                    </p>
                    {testResults.update && (
                      <p className={`text-sm ${testResults.update.success ? 'text-green-600' : 'text-red-600'}`}>
                        {testResults.update.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Duplicação</CardTitle>
                </div>
                <CardDescription>
                  Teste de duplicação de funil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getTestStatus('duplicate')}
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {testResults.duplicate 
                        ? testResults.duplicate.success 
                          ? 'Funil duplicado com sucesso' 
                          : 'Falha na duplicação'
                        : 'Aguardando teste'}
                    </p>
                    {testResults.duplicate && (
                      <p className={`text-sm ${testResults.duplicate.success ? 'text-green-600' : 'text-red-600'}`}>
                        {testResults.duplicate.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Exclusão</CardTitle>
                </div>
                <CardDescription>
                  Teste de exclusão de funil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getTestStatus('delete')}
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {testResults.delete 
                        ? testResults.delete.success 
                          ? 'Funil excluído com sucesso' 
                          : 'Falha na exclusão'
                        : 'Aguardando teste'}
                    </p>
                    {testResults.delete && (
                      <p className={`text-sm ${testResults.delete.success ? 'text-green-600' : 'text-red-600'}`}>
                        {testResults.delete.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="supabase" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Funis no Supabase ({supabaseFunnels.length})</h3>
            <Button 
              onClick={() => setShowDetails(!showDetails)} 
              variant="outline" 
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showDetails ? 'Esconder detalhes' : 'Mostrar detalhes'}
            </Button>
          </div>
          
          <div className="border rounded-md">
            {supabaseFunnels.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum funil encontrado no Supabase
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                      {showDetails && (
                        <>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Publicado</th>
                        </>
                      )}
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Criado em</th>
                    </tr>
                  </thead>
                  <tbody className="bg-popover divide-y divide-border">
                    {supabaseFunnels.map((funnel) => (
                      <tr key={funnel.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-2 text-sm whitespace-nowrap truncate max-w-[100px]">{funnel.id}</td>
                        <td className="px-4 py-2 text-sm">{funnel.name}</td>
                        {showDetails && (
                          <>
                            <td className="px-4 py-2 text-sm">{funnel.description || '-'}</td>
                            <td className="px-4 py-2 text-sm">
                              <Badge variant={funnel.is_published ? "success" : "secondary"}>
                                {funnel.is_published ? 'Sim' : 'Não'}
                              </Badge>
                            </td>
                          </>
                        )}
                        <td className="px-4 py-2 text-sm">{new Date(funnel.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Páginas no Supabase ({supabasePages.length})</h3>
          <div className="border rounded-md">
            {supabasePages.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhuma página encontrada no Supabase
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Funil ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Título</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ordem</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-popover divide-y divide-border">
                    {supabasePages.map((page) => (
                      <tr key={page.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-2 text-sm whitespace-nowrap truncate max-w-[100px]">{page.id}</td>
                        <td className="px-4 py-2 text-sm whitespace-nowrap truncate max-w-[100px]">{page.funnel_id}</td>
                        <td className="px-4 py-2 text-sm">{page.title || '-'}</td>
                        <td className="px-4 py-2 text-sm">
                          <Badge variant="outline">{page.page_order}</Badge>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <Badge variant="secondary">{page.page_type || 'default'}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="local" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Funis no Estado Local ({funnels.length})</CardTitle>
              <CardDescription>
                Estes são os funis carregados no estado do React via FunnelsContext
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                {funnels.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhum funil carregado no estado local
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Publicado</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Etapas</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Atualizado</th>
                        </tr>
                      </thead>
                      <tbody className="bg-popover divide-y divide-border">
                        {funnels.map((funnel) => (
                          <tr key={funnel.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-2 text-sm whitespace-nowrap truncate max-w-[100px]">{funnel.id}</td>
                            <td className="px-4 py-2 text-sm">{funnel.name}</td>
                            <td className="px-4 py-2 text-sm">
                              <Badge variant={funnel.isPublished ? "success" : "secondary"}>
                                {funnel.isPublished ? 'Sim' : 'Não'}
                              </Badge>
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <Badge variant="outline">{funnel.steps.length}</Badge>
                            </td>
                            <td className="px-4 py-2 text-sm">{new Date(funnel.updatedAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
