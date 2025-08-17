import React from 'react';
import { 
  Undo, 
  Redo, 
  Save, 
  Cloud, 
  Monitor, 
  Smartphone, 
  Settings, 
  Play,
  X,
  Clipboard,
  PencilRuler,
  Workflow,
  Palette,
  UserRoundSearch,
  Cog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/context/EditorContext';

interface FunnelNavbarProps {
  onSave?: () => void;
  onPublish?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onTogglePreview?: () => void;
  viewportSize?: 'sm' | 'md' | 'lg' | 'xl';
  onViewportSizeChange?: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
}

const FunnelNavbar: React.FC<FunnelNavbarProps> = ({
  onSave = () => console.log('Salvar'),
  onPublish = () => console.log('Publicar'),
  onUndo = () => console.log('Desfazer'),
  onRedo = () => console.log('Refazer'),
  canUndo = false,
  canRedo = false,
  onTogglePreview = () => console.log('Toggle Preview'),
  viewportSize = 'lg',
  onViewportSizeChange = () => console.log('Change viewport'),
}) => {
  const { activeStageId, computed: { stageCount, totalBlocks } } = useEditor();
  
  const [activeTab, setActiveTab] = React.useState('construtor');

  const tabItems = [
    { id: 'construtor', label: 'Construtor', icon: PencilRuler },
    { id: 'fluxo', label: 'Fluxo', icon: Workflow },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'leads', label: 'Leads', icon: UserRoundSearch },
    { id: 'configuracoes', label: 'Configurações', icon: Cog },
  ];

  return (
    <div className="bg-zinc-950/50 backdrop-blur-lg border-b border-zinc-800/50 text-white">
      <div className="w-full flex flex-wrap md:flex-nowrap justify-between">
        {/* Left Section - Close and Controls */}
        <div className="order-0 md:order-0 flex w-full max-w-[5.75rem] lg:max-w-[18rem]">
          <div className="border-r border-zinc-800/50">
            <Button
              variant="ghost"
              size="sm"
              className="h-[3rem] px-4 md:px-5 text-zinc-100 border-transparent hover:bg-zinc-100/10 rounded-none"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-row justify-between">
            <div className="flex p-3 gap-1 md:gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 border-zinc-700 bg-zinc-800/50 hover:bg-primary hover:text-foreground"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 border-zinc-700 bg-zinc-800/50 hover:bg-primary hover:text-foreground"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 border-zinc-700 bg-zinc-800/50 hover:bg-primary hover:text-foreground"
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden order-1 md:order-3 w-full flex gap-1 md:gap-2 p-3">
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 border-zinc-700 bg-zinc-800/50 hover:bg-primary hover:text-foreground"
                onClick={() => onViewportSizeChange(viewportSize === 'sm' ? 'lg' : 'sm')}
              >
                {viewportSize === 'sm' ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 border-zinc-700 bg-zinc-800/50 hover:bg-primary hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 border-zinc-700 bg-zinc-800/50 hover:bg-primary hover:text-foreground"
                onClick={onTogglePreview}
              >
                <Play className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 py-2 border-zinc-700 bg-zinc-800/50 hover:bg-primary hover:text-foreground"
                onClick={onSave}
              >
                <span className="md:inline hidden">Salvar</span>
                <Save className="w-4 h-4 md:hidden block" />
              </Button>
              
              <Button
                className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onPublish}
              >
                <span className="md:inline hidden">Publicar</span>
                <Cloud className="w-4 h-4 md:hidden block" />
              </Button>
            </div>
          </div>
        </div>

        {/* Center Section - Tab Navigation */}
        <div className="border-t md:border-t-0 md:order-1 w-full">
          <div className="md:mx-auto md:max-w-[32rem] flex h-full items-center justify-center p-1 md:p-0 gap-1 md:gap-2">
            {tabItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className={`h-10 px-4 py-2 ${
                    isActive 
                      ? 'bg-primary text-foreground' 
                      : 'hover:bg-primary hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="md:mr-2 md:mx-0 mx-4 h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Right Section - Desktop Controls */}
        <div className="md:flex hidden order-1 md:order-3 w-fit gap-1 md:gap-2 p-3">
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 border-zinc-700 bg-zinc-800/50 hover:bg-primary hover:text-foreground"
            onClick={() => onViewportSizeChange(viewportSize === 'sm' ? 'lg' : 'sm')}
          >
            {viewportSize === 'sm' ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 border-zinc-700 bg-zinc-800/50 hover:bg-primary hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 border-zinc-700 bg-zinc-800/50 hover:bg-primary hover:text-foreground"
            onClick={onTogglePreview}
          >
            <Play className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-4 py-2 border-zinc-700 bg-zinc-800/50 hover:bg-primary hover:text-foreground"
            onClick={onSave}
          >
            <span className="md:inline hidden">Salvar</span>
            <Save className="w-4 h-4 md:hidden block" />
          </Button>
          
          <Button
            className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onPublish}
          >
            <span className="md:inline hidden">Publicar</span>
            <Cloud className="w-4 h-4 md:hidden block" />
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-zinc-900/50 border-t border-zinc-800/50 text-sm text-zinc-400">
        <div className="flex items-center justify-between">
          <span>
            Etapa {activeStageId} • {stageCount} etapas • {totalBlocks} componentes
          </span>
          <span className="text-green-400">
            ● Sistema Ativo
          </span>
        </div>
      </div>
    </div>
  );
};

export default FunnelNavbar;