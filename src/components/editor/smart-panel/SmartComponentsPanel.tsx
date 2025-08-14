// @ts-nocheck
/**
 * SIMPLIFIED SMART COMPONENTS PANEL
 */
import React, { useState } from 'react';
import { Search, Layout } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SmartComponentsPanelProps {
  onAddComponent?: (type: string) => void;
}

const SmartComponentsPanel: React.FC<SmartComponentsPanelProps> = ({ onAddComponent }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const components = [
    { id: 'text-inline', name: 'Text Block', category: 'Content' },
    { id: 'quiz-question', name: 'Quiz Question', category: 'Quiz' },
    { id: 'button-inline', name: 'Button', category: 'Actions' },
  ];

  const filteredComponents = components.filter(comp =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5" />
          Smart Components
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {filteredComponents.map((component) => (
          <Button
            key={component.id}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddComponent?.(component.id)}
          >
            {component.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default SmartComponentsPanel;