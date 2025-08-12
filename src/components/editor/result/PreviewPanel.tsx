import React from 'react';
import { StyleResult } from '@/types/quiz';
import { Monitor, Smartphone, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PreviewPanelProps {
  primaryStyle: StyleResult;
  onSelectComponent?: (id: string | null) => void;
  selectedComponentId?: string | null;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  primaryStyle,
  onSelectComponent: _onSelectComponent,
  selectedComponentId: _selectedComponentId,
}) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');
  const [isPreviewing, setIsPreviewing] = React.useState(false);

  return (
    <div className="h-full flex flex-col bg-[#FAF9F7]">
      {/* Preview Controls */}
      <div className="border-b border-[#B89B7A]/20 p-4 bg-white flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('desktop')}
            className={viewMode === 'desktop' ? 'bg-[#FAF9F7]' : ''}
          >
            <Monitor className="w-4 h-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('mobile')}
            className={viewMode === 'mobile' ? 'bg-[#FAF9F7]' : ''}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile
          </Button>
        </div>

        <Button variant="outline" size="sm" onClick={() => setIsPreviewing(!isPreviewing)}>
          <Eye className="w-4 h-4 mr-2" />
          {isPreviewing ? 'Editar' : 'Visualizar'}
        </Button>
      </div>

      {/* Preview Content */}
      <div className={cn('flex-1 overflow-auto p-8', viewMode === 'mobile' && 'max-w-md mx-auto')}>
        <div className="min-h-full">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-playfair text-[#aa6b5d]">VOCÊ DESCOBRIU SEU ESTILO</h1>
            <p className="text-xl font-playfair text-[#3a3a3a]">
              Agora é hora de aplicar com clareza — e se vestir de você
            </p>
            <div className="inline-block bg-[#ffefec] px-4 py-2 rounded-md text-[#aa6b5d]">
              Seu estilo predominante é {primaryStyle.category}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <img
              src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
              alt="Guia Completo de Estilo"
              className="w-full rounded-lg shadow-lg"
            />
            <img
              src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744921536/Sem_nome_1080_x_1000_px_z0chuv.webp"
              alt="Gisele Galvão"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
