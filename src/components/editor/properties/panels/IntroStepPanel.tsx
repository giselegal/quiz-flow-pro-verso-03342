// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PropertyCategory } from '@/hooks/useUnifiedProperties';
import React from 'react';
import { withPropertyEditor } from '../core/propertyEditors';
import type { BaseProperty } from '../core/types';
import { groupPropertiesByCategory } from '../core/utils';
import { withPropertyControls } from '../core/withPropertyControls';
import { introStepConfig } from './introStepConfig';

interface IntroStepPanelProps {
  properties: BaseProperty[];
  onUpdate: (key: string, value: any) => void;
}

const IntroStepPanel: React.FC<IntroStepPanelProps> = ({ properties, onUpdate }) => {
  const groupedProperties = groupPropertiesByCategory(properties);

  const renderCategory = (category: PropertyCategory, properties: BaseProperty[]) => {
    const titles = {
      [PropertyCategory.CONTENT]: 'Conteúdo',
      [PropertyCategory.STYLE]: 'Aparência',
      [PropertyCategory.BEHAVIOR]: 'Comportamento',
      [PropertyCategory.ACCESSIBILITY]: 'Acessibilidade',
      [PropertyCategory.LAYOUT]: 'Layout',
    };

    return (
      <Card key={category}>
        <CardHeader>
          <CardTitle className="text-sm">{titles[category] || category}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{properties.map(renderProperty)}</CardContent>
      </Card>
    );
  };

  const renderProperty = (property: BaseProperty) => {
    const Editor = withPropertyEditor(property.type);
    return <Editor key={property.key} property={property} onChange={onUpdate} />;
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {Object.entries(groupedProperties).map(([category, props]) => (
          <React.Fragment key={category}>
            {renderCategory(category as PropertyCategory, props)}
            <Separator className="my-4" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
};

export default withPropertyControls(IntroStepPanel, introStepConfig);
