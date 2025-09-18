import { Button } from '@/components/ui/button';

interface StyleGuideViewerProps {
  className?: string;
}

export const StyleGuideViewer: React.FC<StyleGuideViewerProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Style Guide Viewer</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Colors</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="w-16 h-16 bg-primary rounded"></div>
              <div className="w-16 h-16 bg-secondary rounded"></div>
              <div className="w-16 h-16 bg-accent rounded"></div>
              <div className="w-16 h-16 bg-muted rounded"></div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Buttons</h3>
            <div className="space-x-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
