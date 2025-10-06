// @ts-nocheck
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { blockDefinitions, getCategories, getBlocksByCategory } from '@/config/blockDefinitions';
import { BlockDefinition } from '@/types/editor';

interface ComponentsSidebarProps {
  onComponentSelect: (type: string) => void;
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ onComponentSelect }) => {
  const categories = getCategories();

  return (
    <div style={{ borderColor: '#E5DDD5' }}>
      <div className="p-4 border-b">
        <h2 style={{ color: '#432818' }}>Componentes</h2>
        <p style={{ color: '#8B7355' }}>Clique para adicionar</p>
      </div>

      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {categories.map(category => {
            const categoryBlocks = getBlocksByCategory(category);

            return (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle style={{ color: '#6B4F43' }}>{category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categoryBlocks.map((block: BlockDefinition) => {
                    const IconComponent = block.icon;
                    return (
                      <Button
                        key={block.type}
                        variant="ghost"
                        className="w-full justify-start h-auto p-3 text-left"
                        onClick={() => onComponentSelect(block.type)}
                      >
                        <IconComponent className="w-4 h-4 mr-3 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-sm">{block.name}</div>
                          <div style={{ color: '#8B7355' }}>{block.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ComponentsSidebar;
