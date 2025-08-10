import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blockDefinitions, getCategories, getBlocksByCategory } from "@/config/blockDefinitions";
import { BlockDefinition } from "@/types/editor";

interface ComponentsSidebarProps {
  onComponentSelect: (type: string) => void;
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ onComponentSelect }) => {
  const categories = getCategories();

  return (
    <div className="h-full border-r border-gray-200 bg-white">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-900">Componentes</h2>
        <p className="text-sm text-gray-500 mt-1">Clique para adicionar</p>
      </div>

      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {categories.map(category => {
            const categoryBlocks = getBlocksByCategory(category);

            return (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700">{category}</CardTitle>
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
                          <div className="text-xs text-gray-500 truncate">{block.description}</div>
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
