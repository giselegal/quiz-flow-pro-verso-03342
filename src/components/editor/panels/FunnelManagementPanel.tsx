
import React from 'react';
import { QuizFunnel } from '@/types/quiz';

export interface FunnelManagementPanelProps {
  funnel: QuizFunnel;
  onLoadFunnel: (funnelId: string) => Promise<void>;
  onDeleteFunnel: (funnelId: string) => Promise<void>;
  isLoading: boolean;
}

export const FunnelManagementPanel: React.FC<FunnelManagementPanelProps> = ({
  funnel,
  onLoadFunnel,
  onDeleteFunnel,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Funnel Management</h3>
      
      <div className="p-4 bg-gray-50 rounded">
        <h4 className="font-medium">{funnel.name}</h4>
        <p className="text-sm text-gray-600 mt-1">{funnel.description}</p>
        <div className="mt-2 text-xs text-gray-500">
          ID: {funnel.id}
        </div>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={() => onLoadFunnel(funnel.id)}
          disabled={isLoading}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Reload Funnel'}
        </button>
        
        <button
          onClick={() => onDeleteFunnel(funnel.id)}
          disabled={isLoading}
          className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Delete Funnel
        </button>
      </div>
    </div>
  );
};

export default FunnelManagementPanel;
