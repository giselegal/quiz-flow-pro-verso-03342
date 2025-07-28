
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  Play,
  Pause,
  Archive,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const PublishingWorkflow = () => {
  const [funnels, setFunnels] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  useEffect(() => {
    fetchWorkflowData();
  }, []);

  const fetchWorkflowData = async () => {
    try {
      setLoading(true);
      
      // Fetch existing funnels
      const { data: funnelsData, error: funnelsError } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at', { ascending: false });

      if (funnelsError) {
        console.error('Error fetching funnels:', funnelsError);
      } else {
        setFunnels(funnelsData || []);
      }

      // Create mock workflow data based on existing funnels
      const mockWorkflows = (funnelsData || []).map(funnel => ({
        id: `workflow-${funnel.id}`,
        funnel_id: funnel.id,
        funnel_name: funnel.name,
        status: funnel.is_published ? 'published' : 'draft',
        assignee_id: 'user-1',
        assignee_name: 'Editor Principal',
        reviewer_id: 'user-2',
        reviewer_name: 'Revisor Senior',
        scheduled_at: funnel.is_published ? null : new Date(Date.now() + 86400000).toISOString(),
        published_at: funnel.is_published ? funnel.created_at : null,
        paused_at: null,
        archived_at: null,
        created_at: funnel.created_at,
        updated_at: funnel.updated_at,
        progress: funnel.is_published ? 100 : 75,
        priority: 'medium',
        notes: 'Workflow criado automaticamente'
      }));

      setWorkflows(mockWorkflows);
    } catch (error) {
      console.error('Error fetching workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'in_review': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'published': return 'bg-blue-500';
      case 'scheduled': return 'bg-purple-500';
      case 'paused': return 'bg-orange-500';
      case 'archived': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'in_review': return <Eye className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'published': return <CheckCircle className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'archived': return <Archive className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusChange = async (workflowId, newStatus) => {
    try {
      // Update workflow status (mock implementation)
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId 
          ? { ...w, status: newStatus, updated_at: new Date().toISOString() }
          : w
      ));
      
      // If publishing, update the actual funnel
      if (newStatus === 'published') {
        const workflow = workflows.find(w => w.id === workflowId);
        if (workflow) {
          const { error } = await supabase
            .from('funnels')
            .update({ is_published: true })
            .eq('id', workflow.funnel_id);
            
          if (error) {
            console.error('Error updating funnel:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error updating workflow status:', error);
    }
  };

  const handleSchedulePublication = async (workflowId, scheduledDate) => {
    try {
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId 
          ? { 
              ...w, 
              status: 'scheduled', 
              scheduled_at: scheduledDate,
              updated_at: new Date().toISOString()
            }
          : w
      ));
    } catch (error) {
      console.error('Error scheduling publication:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando workflow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow de Publicação</h1>
          <p className="text-gray-600 mt-2">Gerencie o processo de publicação dos seus funnels</p>
        </div>
        <Button onClick={fetchWorkflowData} disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {/* Workflow Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.status === 'draft').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Revisão</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.status === 'in_review').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.status === 'published').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow List */}
      <Card>
        <CardHeader>
          <CardTitle>Workflows Ativos</CardTitle>
          <CardDescription>Gerencie o status e progresso dos seus funnels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div 
                key={workflow.id} 
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)}`}></div>
                    <h3 className="font-semibold text-lg">{workflow.funnel_name}</h3>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      {getStatusIcon(workflow.status)}
                      <span className="capitalize">{workflow.status}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(workflow.id, 'in_review')}
                      disabled={workflow.status === 'published'}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Revisar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(workflow.id, 'published')}
                      disabled={workflow.status === 'published'}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Publicar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(workflow.id, 'paused')}
                      disabled={workflow.status === 'draft'}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pausar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Responsável</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{workflow.assignee_name}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Revisor</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{workflow.reviewer_name}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Última Atualização</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {new Date(workflow.updated_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progresso</span>
                    <span className="text-sm text-gray-600">{workflow.progress}%</span>
                  </div>
                  <Progress percent={workflow.progress} className="h-2" />
                </div>

                {workflow.scheduled_at && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        Agendado para: {new Date(workflow.scheduled_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {workflow.published_at && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        Publicado em: {new Date(workflow.published_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Operações comuns do workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 h-auto p-4"
              onClick={() => handleStatusChange('all', 'in_review')}
            >
              <Eye className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Revisar Todos</div>
                <div className="text-sm text-gray-600">Mover rascunhos para revisão</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center space-x-2 h-auto p-4"
              onClick={() => handleSchedulePublication('all', new Date(Date.now() + 86400000).toISOString())}
            >
              <Calendar className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Agendar Publicação</div>
                <div className="text-sm text-gray-600">Programar para amanhã</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center space-x-2 h-auto p-4"
              onClick={() => handleStatusChange('all', 'published')}
            >
              <Play className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Publicar Aprovados</div>
                <div className="text-sm text-gray-600">Publicar todos aprovados</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center space-x-2 h-auto p-4"
              onClick={() => handleStatusChange('all', 'archived')}
            >
              <Archive className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Arquivar Antigos</div>
                <div className="text-sm text-gray-600">Arquivar workflows antigos</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline do Workflow</CardTitle>
          <CardDescription>Histórico de atividades recentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.slice(0, 5).map((workflow) => (
              <div key={workflow.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{workflow.funnel_name}</p>
                  <p className="text-xs text-gray-600">
                    Status alterado para {workflow.status} • {new Date(workflow.updated_at).toLocaleString()}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {workflow.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublishingWorkflow;
