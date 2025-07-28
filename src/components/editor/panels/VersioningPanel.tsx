
import React from 'react';
import { QuizFunnel, Version } from '@/types/quiz';

export interface VersioningPanelProps {
  funnel: QuizFunnel;
  onLoadVersion: (version: Version) => QuizFunnel | null;
  onDeleteVersion: () => void;
  onClearHistory: () => void;
  isLoading: boolean;
}

export const VersioningPanel: React.FC<VersioningPanelProps> = ({
  funnel,
  onLoadVersion,
  onDeleteVersion,
  onClearHistory,
  isLoading
}) => {
  const versions: Version[] = []; // This would come from your version manager

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Version History</h3>
      
      {versions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No versions saved yet</p>
      ) : (
        <div className="space-y-2">
          {versions.map((version) => (
            <div key={version.id} className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Version {version.id}</div>
                  <div className="text-sm text-gray-600">{version.timestamp}</div>
                </div>
                <button
                  onClick={() => onLoadVersion(version)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Load
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="space-y-2">
        <button
          onClick={onDeleteVersion}
          disabled={isLoading || versions.length === 0}
          className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Delete Latest Version
        </button>
        
        <button
          onClick={onClearHistory}
          disabled={isLoading || versions.length === 0}
          className="w-full px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Clear History
        </button>
      </div>
    </div>
  );
};

export default VersioningPanel;
