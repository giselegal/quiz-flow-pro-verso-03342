import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <div style={{ borderColor: '#E5DDD5' }}>
      <div className="p-4">
        <h2 style={{ color: '#432818' }}>Components</h2>
        <ScrollArea className="h-full">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Text Block
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Image Block
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Button Block
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Form Block
            </Button>
          </div>
          {children}
        </ScrollArea>
      </div>
    </div>
  );
}
