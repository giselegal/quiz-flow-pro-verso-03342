
import React from 'react';
import { QuizConfig } from '@/types/quiz';

export interface ConfigPanelProps {
  config: QuizConfig;
  onUpdateConfig: (updates: Partial<QuizConfig>) => void;
  onUpdateConfigSection: <K extends keyof QuizConfig>(section: K, updates: Partial<QuizConfig[K]>) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onUpdateConfig,
  onUpdateConfigSection
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Configuration</h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">Quiz Title</label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => onUpdateConfig({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={config.description || ''}
          onChange={(e) => onUpdateConfig({ description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Primary Color</label>
        <input
          type="color"
          value={config.theme?.primaryColor || '#3b82f6'}
          onChange={(e) => onUpdateConfigSection('theme', { primaryColor: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Secondary Color</label>
        <input
          type="color"
          value={config.theme?.secondaryColor || '#64748b'}
          onChange={(e) => onUpdateConfigSection('theme', { secondaryColor: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

export default ConfigPanel;
