import React from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formElements = [
  { type: 'input', label: 'Campo de Texto', icon: '📝' },
  { type: 'button', label: 'Botão', icon: '🔘' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'radio', label: 'Radio Button', icon: '🔘' },
  { type: 'dropdown', label: 'Dropdown', icon: '📋' },
  { type: 'textarea', label: 'Área de Texto', icon: '📄' },
  { type: 'label', label: 'Label', icon: '🏷️' },
];

const DraggableElement = ({ element }: { element: any }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'form-element',
    item: { type: element.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 border rounded cursor-move hover:bg-gray-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <span>{element.icon}</span>
        <span className="text-sm">{element.label}</span>
      </div>
    </div>
  );
};

export function FormElementsPanel() {
  return (
    <Card className="w-64 h-full">
      <CardHeader>
        <CardTitle>Elementos de Formulário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {formElements.map((element) => (
          <DraggableElement key={element.type} element={element} />
        ))}
      </CardContent>
    </Card>
  );
}
