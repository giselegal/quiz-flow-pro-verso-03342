
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Monitor, Smartphone } from 'lucide-react';

export interface PreviewPanelProps {
  isPreviewMode: boolean;
  onComponentSelect: (componentId: string) => void;
  data: any;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  isPreviewMode,
  onComponentSelect,
  data
}) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Preview Controls */}
      <div className="border-b bg-white p-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('desktop')}
            className={viewMode === 'desktop' ? 'bg-gray-100' : ''}
          >
            <Monitor className="w-4 h-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('mobile')}
            className={viewMode === 'mobile' ? 'bg-gray-100' : ''}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {isPreviewMode ? (
            <Eye className="w-4 h-4 text-green-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-sm text-gray-600">
            {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
          </span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className={`mx-auto bg-white rounded-lg shadow-sm border ${
          viewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
        }`}>
          <div className="p-8">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Preview Content
              </h1>
              <p className="text-gray-600">
                This is where the funnel content will be displayed.
              </p>
              
              {!isPreviewMode && (
                <div className="mt-8 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-sm text-gray-500 mb-4">
                    Click components to select and edit them
                  </p>
                  <Button
                    onClick={() => onComponentSelect('sample-component')}
                    variant="outline"
                    size="sm"
                  >
                    Sample Component
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
