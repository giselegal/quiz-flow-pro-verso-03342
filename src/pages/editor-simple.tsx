import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EditorSimple: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="p-8 max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Simple Editor</h1>
          <p className="text-muted-foreground mb-4">
            Basic editor component working properly
          </p>
          <Button onClick={() => window.location.href = '/editor-simples'}>
            Go to Full Editor
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditorSimple;