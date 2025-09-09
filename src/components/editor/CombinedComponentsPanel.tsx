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
    <div className="h-full flex flex-col overflow-hidden bg-transparent">
      <div className="flex-shrink-0 border-b border-gray-700/50 bg-gray-800/80 p-3 backdrop-blur-sm">
        <h3 className="text-sm font-medium text-white">
          Quiz Builder com Componentes Modulares
        </h3>
      </div>

      <Tabs defaultValue="blocks" className="h-full flex flex-col">
        <div className="flex-shrink-0 border-b border-gray-700/30 bg-gray-800/50 p-2 backdrop-blur-sm">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-gray-700/30">
            <TabsTrigger 
              value="blocks" 
              className="flex items-center gap-2 text-xs text-gray-300 data-[state=active]:bg-brand-brightBlue/20 data-[state=active]:text-brand-brightBlue data-[state=active]:border-brand-brightBlue/30"
            >
              <Grid3X3 className="h-3 w-3" />
              Blocos
            </TabsTrigger>
            <TabsTrigger 
              value="reusable" 
              className="flex items-center gap-2 text-xs text-gray-300 data-[state=active]:bg-brand-brightPink/20 data-[state=active]:text-brand-brightPink data-[state=active]:border-brand-brightPink/30"
            >
              <Package className="h-3 w-3" />
              Reutilizáveis
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden bg-transparent">
          <TabsContent value="blocks" className="h-full m-0 p-0 overflow-hidden bg-transparent">
            <EnhancedComponentsSidebar />
          </TabsContent>

          <TabsContent value="reusable" className="h-full m-0 p-0 bg-transparent">
            <div className="h-full overflow-y-auto [scrollbar-gutter:stable]">
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
