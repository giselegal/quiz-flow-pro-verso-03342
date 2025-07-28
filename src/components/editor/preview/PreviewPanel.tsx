
import React from 'react';
import { StyleResult } from '@/types/quiz';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';

interface PreviewPanelProps {
  selectedStyle: StyleResult;
  isPreviewMode?: boolean;
  selectedBlockId?: string | null;
  onSelectBlock?: (blockId: string) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  selectedStyle,
  isPreviewMode = false,
  selectedBlockId,
  onSelectBlock
}) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Preview</h3>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 bg-gray-50 overflow-auto">
        <div className={`mx-auto bg-white rounded-lg shadow-sm ${
          viewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
        }`}>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Preview do Funil
                </h2>
                <p className="text-gray-600 mb-4">
                  Estilo selecionado: {selectedStyle.category}
                </p>
                <div className="bg-gray-100 p-8 rounded-lg">
                  <p className="text-sm text-gray-500">
                    Conteúdo do funil será renderizado aqui
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
