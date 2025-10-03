import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEditor } from '@/components/editor/EditorProvider';

export const DatabaseControlPanel: React.FC = () => {
  const { state } = useEditor();
  const databaseMode: 'local' | 'supabase' = 'supabase';
  const connectionStatus = 'connected' as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Database Control
          <Badge variant={databaseMode === 'supabase' ? 'default' : 'secondary'}>
            {databaseMode || 'local'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
              {connectionStatus}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Test Connection
            </Button>
            <Button size="sm" variant="outline">
              Reset Database
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseControlPanel;
