import { Button } from '@/components/ui/button';

interface ComponentsSidebarProps {
  onComponentSelect: (type: string) => void;
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ onComponentSelect }) => {
  const components = [
    { type: 'header', label: 'Header' },
    { type: 'text', label: 'Text' },
    { type: 'image', label: 'Image' },
    { type: 'cta', label: 'Call to Action' },
  ];

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      <h3 className="text-lg font-semibold mb-4">Components</h3>
      <div className="space-y-2">
        {components.map(component => (
          <Button
            key={component.type}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onComponentSelect(component.type)}
          >
            {component.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
