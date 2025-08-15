import EnhancedComponentsSidebar from '@/components/editor/EnhancedComponentsSidebar';
import ReusableComponentsPanel from '@/components/editor/ReusableComponentsPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3X3, Package } from 'lucide-react';

interface CombinedComponentsPanelProps {
  currentStepNumber?: number;
}

export const CombinedComponentsPanel: React.FC<CombinedComponentsPanelProps> = ({
  currentStepNumber = 1,
}) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-border/50 bg-card/80 p-3">
        <h3 className="text-sm font-medium text-foreground">
          Quiz Builder com Componentes Modulares
        </h3>
      </div>

      <Tabs defaultValue="blocks" className="h-full flex flex-col">
        <div className="flex-shrink-0 border-b border-border/30 bg-card/50 p-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blocks" className="flex items-center gap-2 text-xs">
              <Grid3X3 className="h-3 w-3" />
              Blocos
            </TabsTrigger>
            <TabsTrigger value="reusable" className="flex items-center gap-2 text-xs">
              <Package className="h-3 w-3" />
              Reutilizáveis
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="blocks" className="h-full m-0 p-0 overflow-hidden">
            <EnhancedComponentsSidebar />
          </TabsContent>

          <TabsContent value="reusable" className="h-full m-0 p-0">
            <div className="h-full overflow-y-auto editor-scrollable [scrollbar-gutter:stable]">
              <div className="p-2">
                <ReusableComponentsPanel
                  currentStepNumber={currentStepNumber}
                  onComponentAdd={type => {
                    console.log(`✅ Componente reutilizável ${type} adicionado!`);
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CombinedComponentsPanel;
