
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type WorkflowStatus = 'draft' | 'review' | 'approved' | 'published' | 'rejected';

interface WorkflowContextType {
  status: WorkflowStatus;
  canEdit: boolean;
  canPublish: boolean;
  canReview: boolean;
  updateStatus: (status: WorkflowStatus) => void;
  submitForReview: () => void;
  approve: () => void;
  reject: (reason?: string) => void;
  publish: () => void;
}

const WorkflowContext = createContext<WorkflowContextType>({
  status: 'draft',
  canEdit: true,
  canPublish: false,
  canReview: false,
  updateStatus: () => {},
  submitForReview: () => {},
  approve: () => {},
  reject: () => {},
  publish: () => {}
});

export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<WorkflowStatus>('draft');
  const [userRole] = useState<string>('editor'); // This would come from auth context

  const canEdit = status === 'draft' || status === 'rejected';
  const canPublish = status === 'approved' && userRole === 'admin';
  const canReview = status === 'review' && userRole === 'reviewer';

  const updateStatus = (newStatus: WorkflowStatus) => {
    setStatus(newStatus);
  };

  const submitForReview = () => {
    setStatus('review');
  };

  const approve = () => {
    setStatus('approved');
  };

  const reject = (reason?: string) => {
    setStatus('rejected');
    console.log('Rejected:', reason);
  };

  const publish = () => {
    setStatus('published');
  };

  const value: WorkflowContextType = {
    status,
    canEdit,
    canPublish,
    canReview,
    updateStatus,
    submitForReview,
    approve,
    reject,
    publish
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => useContext(WorkflowContext);

interface StatusBadgeProps {
  status: WorkflowStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'review': return 'default';
      case 'approved': return 'secondary';
      case 'published': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Badge variant={getStatusColor(status)} className={className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

interface WorkflowManagerProps {
  children: ReactNode;
}

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({ children }) => {
  const workflow = useWorkflow();

  return (
    <WorkflowProvider>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Workflow Status</span>
              <StatusBadge status={workflow.status} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              {workflow.canEdit && (
                <Button onClick={workflow.submitForReview} size="sm">
                  Submit for Review
                </Button>
              )}
              {workflow.canReview && (
                <>
                  <Button onClick={workflow.approve} size="sm">
                    Approve
                  </Button>
                  <Button 
                    onClick={() => workflow.reject('Content needs revision')} 
                    variant="outline" 
                    size="sm"
                  >
                    Reject
                  </Button>
                </>
              )}
              {workflow.canPublish && (
                <Button onClick={workflow.publish} size="sm">
                  Publish
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {children}
      </div>
    </WorkflowProvider>
  );
};

export default WorkflowManager;
