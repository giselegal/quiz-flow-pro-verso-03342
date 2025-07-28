
import React, { createContext, useContext, useState } from 'react';

export type WorkflowStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

interface WorkflowItem {
  id: string;
  title: string;
  status: WorkflowStatus;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

interface WorkflowContextType {
  items: WorkflowItem[];
  updateStatus: (id: string, status: WorkflowStatus) => void;
  createItem: (title: string) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WorkflowItem[]>([]);

  const updateStatus = (id: string, status: WorkflowStatus) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status, updatedAt: new Date() } : item
    ));
  };

  const createItem = (title: string) => {
    const newItem: WorkflowItem = {
      id: Date.now().toString(),
      title,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: 'current-user'
    };
    setItems(prev => [...prev, newItem]);
  };

  return (
    <WorkflowContext.Provider value={{ items, updateStatus, createItem }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowManager');
  }
  return context;
};

export const StatusBadge: React.FC<{ status: WorkflowStatus }> = ({ status }) => {
  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'review': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'published': return 'bg-blue-500';
      case 'archived': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-white text-xs ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};
