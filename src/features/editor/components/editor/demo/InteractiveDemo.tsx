import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const InteractiveDemo: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemToggle = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Demo Interativo</h3>

      <div className="space-y-2 mb-4">
        {items.map(item => (
          <Button
            key={item}
            variant={selectedItems.includes(item) ? 'default' : 'outline'}
            onClick={() => handleItemToggle(item)}
            className="w-full justify-start"
          >
            {item}
          </Button>
        ))}
      </div>

      <div style={{ backgroundColor: '#FAF9F7' }}>
        <p style={{ color: '#6B4F43' }}>
          Itens selecionados: {selectedItems.length > 0 ? selectedItems.join(', ') : 'Nenhum'}
        </p>
      </div>
    </Card>
  );
};

export default InteractiveDemo;
