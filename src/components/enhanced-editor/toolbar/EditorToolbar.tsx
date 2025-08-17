import { Button } from '@/components/ui/button';
import {
  Eye,
  Save,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Settings,
  Activity,
  FileText,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import TemplateImportExport from '@/components/enhanced-editor/TemplateImportExport';

interface EditorToolbarProps {
  isPreviewing: boolean;
  viewportSize: 'sm' | 'md' | 'lg' | 'xl';
  onViewportSizeChange: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  onTogglePreview: () => void;
  onSave: () => void;
  onSaveAsTemplate?: () => void;
  onShowFunnelSettings?: () => void;
  onShowMonitoring?: () => void;
  currentFunnelData?: any;
  currentComponents?: any[];
  onImportTemplate?: (template: any) => void;
}

export function EditorToolbar({
  isPreviewing,
  viewportSize,
  onViewportSizeChange,
  onTogglePreview,
  onSave,
  onSaveAsTemplate,
  onShowFunnelSettings,
  onShowMonitoring,
  currentFunnelData,
  currentComponents,
  onImportTemplate,
}: EditorToolbarProps) {
  return (
    <div className="border-b border-[#B89B7A]/20 p-4 bg-white flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold text-[#432818] mr-4">Editor Visual</h1>

        <TooltipProvider>
          <div className="flex items-center bg-[#FAF9F7] rounded-md p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewportSizeChange('sm')}
                  className={cn(
                    'w-8 h-8 rounded-md',
                    viewportSize === 'sm' && 'bg-white shadow-sm'
                  )}
                >
                  <Smartphone className="w-4 h-4 text-[#8F7A6A]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mobile (sm)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewportSizeChange('md')}
                  className={cn(
                    'w-8 h-8 rounded-md',
                    viewportSize === 'md' && 'bg-white shadow-sm'
                  )}
                >
                  <Tablet className="w-4 h-4 text-[#8F7A6A]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tablet (md)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewportSizeChange('lg')}
                  className={cn(
                    'w-8 h-8 rounded-md',
                    viewportSize === 'lg' && 'bg-white shadow-sm'
                  )}
                >
                  <Monitor className="w-4 h-4 text-[#8F7A6A]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Desktop (lg)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewportSizeChange('xl')}
                  className={cn(
                    'w-8 h-8 rounded-md',
                    viewportSize === 'xl' && 'bg-white shadow-sm'
                  )}
                >
                  <Maximize2 className="w-4 h-4 text-[#8F7A6A]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Large Desktop (xl)</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <div className="flex gap-2">
        <TemplateImportExport
          currentFunnelData={currentFunnelData}
          currentComponents={currentComponents}
          onImportTemplate={onImportTemplate}
          className="mr-2"
        />

        {onShowMonitoring && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShowMonitoring}
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <Activity className="w-4 h-4 mr-2" />
            Monitoramento
          </Button>
        )}

        {onShowFunnelSettings && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShowFunnelSettings}
            className="border-[#B89B7A] text-[#432818]"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePreview}
          className="border-[#B89B7A] text-[#432818]"
        >
          <Eye className="w-4 h-4 mr-2" />
          {isPreviewing ? 'Editar' : 'Visualizar'}
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          className="bg-[#B89B7A] hover:bg-[#8F7A6A] text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>

        {onSaveAsTemplate && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveAsTemplate}
            className="border-[#B89B7A] text-[#432818] hover:bg-[#B89B7A]/10"
          >
            <FileText className="w-4 h-4 mr-2" />
            Salvar como Template
          </Button>
        )}
      </div>
    </div>
  );
}
