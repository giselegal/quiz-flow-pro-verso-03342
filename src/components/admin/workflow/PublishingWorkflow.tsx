
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Play, Pause, Archive } from 'lucide-react';

// Define proper types for our data
interface FunnelData {
  id: string;
  name: string;
  description: string | null;
  is_published: boolean | null;
  version: number | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
  settings: any;
}

interface WorkflowItem {
  id: string;
  funnel_id: string;
  funnel_name: string;
  status: string;
  assignee_id: string;
  assignee_name: string;
  reviewer_id: string;
  reviewer_name: string;
  scheduled_at: string | null;
  published_at: string | null;
  paused_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  priority: string;
  estimated_completion: string;
  actual_completion: string | null;
  notes: string;
}

const PublishingWorkflow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [funnels, setFunnels] = useState<FunnelData[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadFunnels();
    loadWorkflows();
  }, []);

  const loadFunnels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFunnels(data || []);
    } catch (err) {
      console.error('Error loading funnels:', err);
      setError('Failed to load funnels');
      // Use mock data as fallback
      setFunnels([
        {
          id: '1',
          name: 'Lead Generation Funnel',
          description: 'Main lead generation funnel',
          is_published: true,
          version: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          user_id: 'user1',
          settings: {}
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflows = async () => {
    try {
      // Using mock data since the workflow tables don't exist in the current schema
      const mockWorkflows: WorkflowItem[] = [
        {
          id: '1',
          funnel_id: '1',
          funnel_name: 'Lead Generation Funnel',
          status: 'in_progress',
          assignee_id: 'user1',
          assignee_name: 'John Doe',
          reviewer_id: 'user2',
          reviewer_name: 'Jane Smith',
          scheduled_at: '2024-01-15T10:00:00Z',
          published_at: null,
          paused_at: null,
          archived_at: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          priority: 'high',
          estimated_completion: '2024-01-15T00:00:00Z',
          actual_completion: null,
          notes: 'Working on final review'
        },
        {
          id: '2',
          funnel_id: '2',
          funnel_name: 'Product Sales Funnel',
          status: 'completed',
          assignee_id: 'user2',
          assignee_name: 'Jane Smith',
          reviewer_id: 'user3',
          reviewer_name: 'Bob Johnson',
          scheduled_at: '2024-01-10T09:00:00Z',
          published_at: '2024-01-10T09:30:00Z',
          paused_at: null,
          archived_at: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-10T09:30:00Z',
          priority: 'medium',
          estimated_completion: '2024-01-10T00:00:00Z',
          actual_completion: '2024-01-10T09:30:00Z',
          notes: 'Completed successfully'
        }
      ];

      setWorkflows(mockWorkflows);
    } catch (err) {
      console.error('Error loading workflows:', err);
      setError('Failed to load workflows');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Play className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const updateWorkflowStatus = (workflowId: string, newStatus: string) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === workflowId 
          ? { ...workflow, status: newStatus, updated_at: new Date().toISOString() }
          : workflow
      )
    );
  };

  const scheduleWorkflow = (workflowId: string, scheduledDate: string) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === workflowId 
          ? { ...workflow, scheduled_at: scheduledDate, updated_at: new Date().toISOString() }
          : workflow
      )
    );
  };

  const filteredWorkflows = selectedStatus === 'all' 
    ? workflows 
    : workflows.filter(workflow => workflow.status === selectedStatus);

  if (loading) {
    return <div className="p-6">Loading workflow...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={() => { setError(null); loadFunnels(); loadWorkflows(); }}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Publishing Workflow</h1>
          <p className="text-gray-600">Manage funnel publishing and review process</p>
        </div>
        <Button>
          <Play className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">Active workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Published funnels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paused</CardTitle>
            <Pause className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.status === 'paused').length}
            </div>
            <p className="text-xs text-muted-foreground">On hold</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow List */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredWorkflows.map((workflow) => (
                  <div key={workflow.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getStatusColor(workflow.status)}>
                            {getStatusIcon(workflow.status)}
                            <span className="ml-1 capitalize">{workflow.status}</span>
                          </Badge>
                          <h3 className="font-semibold">{workflow.funnel_name}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Assignee: {workflow.assignee_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Reviewer: {workflow.reviewer_name}</span>
                          </div>
                          {workflow.scheduled_at && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Scheduled: {new Date(workflow.scheduled_at).toLocaleDateString()}</span>
                            </div>
                          )}
                          {workflow.estimated_completion && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>Est. Completion: {new Date(workflow.estimated_completion).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        {workflow.notes && (
                          <p className="text-sm text-gray-700 mt-2">{workflow.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateWorkflowStatus(workflow.id, 'completed')}
                        >
                          Complete
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateWorkflowStatus(workflow.id, 'paused')}
                        >
                          Pause
                        </Button>
                      </div>
                    </div>
                    <Progress percent={workflow.status === 'completed' ? 100 : workflow.status === 'in_progress' ? 60 : 20} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.filter(w => w.status === 'completed').map((workflow) => (
                  <div key={workflow.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{workflow.funnel_name}</h3>
                        <p className="text-sm text-gray-600">
                          Completed by {workflow.assignee_name}
                        </p>
                        {workflow.published_at && (
                          <p className="text-sm text-gray-500">
                            Published: {new Date(workflow.published_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived">
          <Card>
            <CardHeader>
              <CardTitle>Archived Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                No archived workflows found.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublishingWorkflow;
