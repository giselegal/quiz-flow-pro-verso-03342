/**
 * SIMPLIFIED SMART COMPONENTS PANEL
 */
import React, { useState } from 'react';
import { Search, Layout } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateBlockDefinitions } from '@/config/enhancedBlockRegistry';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';

interface SmartComponentsPanelProps {
  onAddComponent?: (type: string) => void;
}

const SmartComponentsPanel: React.FC<SmartComponentsPanelProps> = ({ onAddComponent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { scrollRef } = useSyncedScroll({ source: 'components' });

  // Use real block definitions from registry
  const allComponents = generateBlockDefinitions();

  // Filter based on search term
  const components = allComponents.filter(
    comp =>
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Layout className="h-4 w-4" />
          Components
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto editor-scrollable [scrollbar-gutter:stable] space-y-2 p-4"
        >
        {components.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No components found</p>
        ) : (
          components.map(component => (
            <Button
              key={component.type}
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onAddComponent?.(component.type)}
              title={component.description}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{component.name}</span>
                <span className="text-xs text-muted-foreground">{component.category}</span>
              </div>
            </Button>
          ))
        )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartComponentsPanel;
