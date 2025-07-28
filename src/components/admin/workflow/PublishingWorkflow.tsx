// Sistema de Workflow de Publicação
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Send, 
  Pause, 
  Play, 
  Archive, 
  MessageSquare, 
  User, 
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  History,
  Bell,
  Users
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { supabase } from '../../../lib/supabase';

// Tipos para workflow de publicação
export type FunnelStatus = 
  | 'draft'       // Rascunho - editável
  | 'review'      // Em revisão - aguardando aprovação
  | 'approved'    // Aprovado - pronto para publicar
  | 'scheduled'   // Agendado - publicação futura
  | 'published'   // Publicado - live
  | 'paused'      // Pausado - temporariamente offline
  | 'archived';   // Arquivado - não editável

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested';

export interface WorkflowState {
  id: string;
  funnelId: string;
  status: FunnelStatus;
  assigneeId?: string;
  reviewerId?: string;
  scheduledAt?: Date;
  publishedAt?: Date;
  pausedAt?: Date;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewComment {
  id: string;
  funnelId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userAvatar?: string;
  comment: string;
  type: 'comment' | 'approval' | 'rejection' | 'revision';
  isResolved: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface WorkflowHistory {
  id: string;
  funnelId: string;
  userId: string;
  userEmail: string;
  fromStatus: FunnelStatus;
  toStatus: FunnelStatus;
  reason?: string;
  createdAt: Date;
}

export interface NotificationSettings {
  emailOnStatusChange: boolean;
  emailOnComment: boolean;
  emailOnScheduledPublish: boolean;
  pushNotifications: boolean;
}

// Hook para gerenciar workflow
export const useWorkflow = (funnelId: string) => {
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [history, setHistory] = useState<WorkflowHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWorkflowState = useCallback(async () => {
    if (!funnelId) return;

    setLoading(true);
    try {
      const { data: workflow, error } = await supabase
        .from('funnel_workflow')
        .select('*')
        .eq('funnel_id', funnelId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (workflow) {
        setWorkflowState({
          id: workflow.id,
          funnelId: workflow.funnel_id,
          status: workflow.status,
          assigneeId: workflow.assignee_id,
          reviewerId: workflow.reviewer_id,
          scheduledAt: workflow.scheduled_at ? new Date(workflow.scheduled_at) : undefined,
          publishedAt: workflow.published_at ? new Date(workflow.published_at) : undefined,
          pausedAt: workflow.paused_at ? new Date(workflow.paused_at) : undefined,
          archivedAt: workflow.archived_at ? new Date(workflow.archived_at) : undefined,
          createdAt: new Date(workflow.created_at),
          updatedAt: new Date(workflow.updated_at)
        });
      } else {
        // Criar workflow inicial se não existir
        await createWorkflow('draft');
      }
    } catch (error) {
      console.error('Error loading workflow state:', error);
    } finally {
      setLoading(false);
    }
  }, [funnelId]);

  const createWorkflow = useCallback(async (initialStatus: FunnelStatus = 'draft') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('funnel_workflow')
        .insert({
          funnel_id: funnelId,
          status: initialStatus,
          assignee_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setWorkflowState({
        id: data.id,
        funnelId: data.funnel_id,
        status: data.status,
        assigneeId: data.assignee_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      });
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  }, [funnelId]);

  const updateStatus = useCallback(async (
    newStatus: FunnelStatus, 
    options: {
      reason?: string;
      scheduledAt?: Date;
      assigneeId?: string;
      reviewerId?: string;
    } = {}
  ) => {
    if (!workflowState) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Status específicos
      switch (newStatus) {
        case 'scheduled':
          if (options.scheduledAt) {
            updateData.scheduled_at = options.scheduledAt.toISOString();
          }
          break;
        case 'published':
          updateData.published_at = new Date().toISOString();
          break;
        case 'paused':
          updateData.paused_at = new Date().toISOString();
          break;
        case 'archived':
          updateData.archived_at = new Date().toISOString();
          break;
      }

      if (options.assigneeId) {
        updateData.assignee_id = options.assigneeId;
      }

      if (options.reviewerId) {
        updateData.reviewer_id = options.reviewerId;
      }

      const { error } = await supabase
        .from('funnel_workflow')
        .update(updateData)
        .eq('id', workflowState.id);

      if (error) throw error;

      // Adicionar ao histórico
      await supabase.from('workflow_history').insert({
        funnel_id: funnelId,
        user_id: user.id,
        user_email: user.email,
        from_status: workflowState.status,
        to_status: newStatus,
        reason: options.reason
      });

      // Recarregar estado
      await loadWorkflowState();
      await loadHistory();
      
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      return false;
    }
  }, [workflowState, funnelId, loadWorkflowState]);

  const loadComments = useCallback(async () => {
    if (!funnelId) return;

    try {
      const { data, error } = await supabase
        .from('review_comments')
        .select(`
          *,
          users!review_comments_user_id_fkey(email, raw_user_meta_data)
        `)
        .eq('funnel_id', funnelId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const processedComments: ReviewComment[] = data?.map(comment => ({
        id: comment.id,
        funnelId: comment.funnel_id,
        userId: comment.user_id,
        userEmail: comment.users.email,
        userName: comment.users.raw_user_meta_data?.full_name || comment.users.email,
        userAvatar: comment.users.raw_user_meta_data?.avatar_url,
        comment: comment.comment,
        type: comment.type,
        isResolved: comment.is_resolved,
        createdAt: new Date(comment.created_at),
        updatedAt: comment.updated_at ? new Date(comment.updated_at) : undefined
      })) || [];

      setComments(processedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, [funnelId]);

  const addComment = useCallback(async (
    comment: string, 
    type: 'comment' | 'approval' | 'rejection' | 'revision' = 'comment'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('review_comments')
        .insert({
          funnel_id: funnelId,
          user_id: user.id,
          comment,
          type,
          is_resolved: false
        });

      if (error) throw error;

      await loadComments();
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  }, [funnelId, loadComments]);

  const loadHistory = useCallback(async () => {
    if (!funnelId) return;

    try {
      const { data, error } = await supabase
        .from('workflow_history')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedHistory: WorkflowHistory[] = data?.map(record => ({
        id: record.id,
        funnelId: record.funnel_id,
        userId: record.user_id,
        userEmail: record.user_email,
        fromStatus: record.from_status,
        toStatus: record.to_status,
        reason: record.reason,
        createdAt: new Date(record.created_at)
      })) || [];

      setHistory(processedHistory);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, [funnelId]);

  useEffect(() => {
    loadWorkflowState();
    loadComments();
    loadHistory();
  }, [loadWorkflowState, loadComments, loadHistory]);

  return {
    workflowState,
    comments,
    history,
    loading,
    updateStatus,
    addComment,
    refresh: () => {
      loadWorkflowState();
      loadComments();
      loadHistory();
    }
  };
};

// Componente de status badge
export const StatusBadge: React.FC<{ status: FunnelStatus }> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'draft':
        return { color: 'bg-gray-100 text-gray-800', icon: FileText, label: 'Rascunho' };
      case 'review':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Eye, label: 'Em Revisão' };
      case 'approved':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Aprovado' };
      case 'scheduled':
        return { color: 'bg-blue-100 text-blue-800', icon: Calendar, label: 'Agendado' };
      case 'published':
        return { color: 'bg-green-100 text-green-800', icon: Send, label: 'Publicado' };
      case 'paused':
        return { color: 'bg-orange-100 text-orange-800', icon: Pause, label: 'Pausado' };
      case 'archived':
        return { color: 'bg-gray-100 text-gray-800', icon: Archive, label: 'Arquivado' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: FileText, label: 'Desconhecido' };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

// Componente principal do workflow
export const WorkflowManager: React.FC<{
  funnelId: string;
  funnelName: string;
}> = ({ funnelId, funnelName }) => {
  const { workflowState, comments, history, updateStatus, addComment } = useWorkflow(funnelId);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'comment' | 'approval' | 'rejection' | 'revision'>('comment');

  const canTransitionTo = useMemo(() => {
    if (!workflowState) return [];

    const transitions: { [key in FunnelStatus]: FunnelStatus[] } = {
      draft: ['review'],
      review: ['approved', 'draft'],
      approved: ['published', 'scheduled', 'draft'],
      scheduled: ['published', 'draft'],
      published: ['paused', 'archived'],
      paused: ['published', 'archived'],
      archived: []
    };

    return transitions[workflowState.status] || [];
  }, [workflowState]);

  const handleStatusChange = async (newStatus: FunnelStatus) => {
    if (newStatus === 'scheduled') {
      setShowScheduleDialog(true);
    } else {
      await updateStatus(newStatus);
    }
  };

  const handleScheduledPublish = async () => {
    if (!scheduledDate) return;

    const scheduledAt = new Date(scheduledDate);
    const success = await updateStatus('scheduled', { scheduledAt });
    
    if (success) {
      setShowScheduleDialog(false);
      setScheduledDate('');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const success = await addComment(newComment, commentType);
    if (success) {
      setNewComment('');
      setCommentType('comment');
    }
  };

  const getStatusDescription = (status: FunnelStatus) => {
    switch (status) {
      case 'draft':
        return 'Funil em desenvolvimento. Pode ser editado livremente.';
      case 'review':
        return 'Funil enviado para revisão. Aguardando aprovação.';
      case 'approved':
        return 'Funil aprovado. Pronto para publicação.';
      case 'scheduled':
        return 'Funil agendado para publicação automática.';
      case 'published':
        return 'Funil publicado e acessível publicamente.';
      case 'paused':
        return 'Funil pausado temporariamente.';
      case 'archived':
        return 'Funil arquivado. Não pode ser editado.';
      default:
        return '';
    }
  };

  if (!workflowState) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Carregando workflow...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{funnelName}</h2>
          <p className="text-gray-600">{getStatusDescription(workflowState.status)}</p>
        </div>
        <StatusBadge status={workflowState.status} />
      </div>

      <Tabs defaultValue="workflow">
        <TabsList>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="comments">
            Comentários ({comments.filter(c => !c.isResolved).length})
          </TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-4">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {canTransitionTo.map(status => (
                  <Button
                    key={status}
                    variant="outline"
                    onClick={() => handleStatusChange(status)}
                    className="flex items-center gap-2"
                  >
                    {status === 'review' && <Eye className="h-4 w-4" />}
                    {status === 'approved' && <CheckCircle className="h-4 w-4" />}
                    {status === 'published' && <Send className="h-4 w-4" />}
                    {status === 'scheduled' && <Calendar className="h-4 w-4" />}
                    {status === 'paused' && <Pause className="h-4 w-4" />}
                    {status === 'archived' && <Archive className="h-4 w-4" />}
                    {status === 'draft' && <FileText className="h-4 w-4" />}
                    
                    {status === 'review' && 'Enviar para Revisão'}
                    {status === 'approved' && 'Aprovar'}
                    {status === 'published' && 'Publicar Agora'}
                    {status === 'scheduled' && 'Agendar Publicação'}
                    {status === 'paused' && 'Pausar'}
                    {status === 'archived' && 'Arquivar'}
                    {status === 'draft' && 'Voltar ao Rascunho'}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Visual */}
          <Card>
            <CardHeader>
              <CardTitle>Status do Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['draft', 'review', 'approved', 'published'].map((status, index) => {
                  const isCompleted = ['draft', 'review', 'approved', 'published'].indexOf(workflowState.status) >= index;
                  const isCurrent = workflowState.status === status;
                  
                  return (
                    <div key={status} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCurrent ? 'bg-blue-500 text-white' :
                        isCompleted ? 'bg-green-500 text-white' :
                        'bg-gray-200 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                          <StatusBadge status={status as FunnelStatus} />
                        </div>
                        <div className="text-sm text-gray-600">
                          {getStatusDescription(status as FunnelStatus)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Schedule Info */}
          {workflowState.status === 'scheduled' && workflowState.scheduledAt && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Publicação agendada para:</strong> {' '}
                {workflowState.scheduledAt.toLocaleString()}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          {/* Add Comment */}
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Comentário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="comment-type">Tipo</Label>
                <Select value={commentType} onValueChange={(value: any) => setCommentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comment">Comentário</SelectItem>
                    <SelectItem value="approval">Aprovação</SelectItem>
                    <SelectItem value="rejection">Rejeição</SelectItem>
                    <SelectItem value="revision">Solicitar Revisão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="comment">Comentário</Label>
                <Textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Digite seu comentário..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Adicionar Comentário
              </Button>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map(comment => (
              <Card key={comment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback>
                        {comment.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.userName}</span>
                        <Badge variant={
                          comment.type === 'approval' ? 'secondary' :
                          comment.type === 'rejection' ? 'destructive' :
                          'outline'
                        }>
                          {comment.type === 'approval' && 'Aprovação'}
                          {comment.type === 'rejection' && 'Rejeição'}
                          {comment.type === 'revision' && 'Revisão'}
                          {comment.type === 'comment' && 'Comentário'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {comment.createdAt.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Nenhum comentário ainda.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {history.map(record => (
              <Card key={record.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <History className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={record.fromStatus} />
                        <span className="text-gray-400">→</span>
                        <StatusBadge status={record.toStatus} />
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Por {record.userEmail} • {record.createdAt.toLocaleString()}
                      </div>
                      {record.reason && (
                        <div className="text-sm text-gray-700 mt-2">
                          <strong>Motivo:</strong> {record.reason}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {history.length === 0 && (
              <div className="text-center py-8">
                <History className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Nenhum histórico disponível.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Publicação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="scheduled-date">Data e Hora</Label>
              <Input
                id="scheduled-date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleScheduledPublish} disabled={!scheduledDate}>
                <Calendar className="h-4 w-4 mr-2" />
                Agendar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default useWorkflow;
