
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Version } from '@/types/quiz';
import { History, Download, Trash2, RotateCcw } from 'lucide-react';

export interface VersioningPanelProps {
  versions: Version[];
  currentVersionId: string | null;
  onLoadVersion: (versionId: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onClearHistory: () => void;
  isLoading: boolean;
}

export const VersioningPanel: React.FC<VersioningPanelProps> = ({
  versions,
  currentVersionId,
  onLoadVersion,
  onDeleteVersion,
  onClearHistory,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <History className="w-4 h-4" />
          Version History
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearHistory}
          disabled={isLoading || versions.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      <Separator />

      {versions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No versions saved yet</p>
          <p className="text-sm">Save your work to create version history</p>
        </div>
      ) : (
        <div className="space-y-3">
          {versions.map((version) => (
            <Card key={version.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {version.name}
                  </CardTitle>
                  {currentVersionId === version.id && (
                    <Badge variant="default" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3">
                  {version.description}
                </p>
                <div className="text-xs text-gray-500 mb-3">
                  {new Date(version.createdAt).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLoadVersion(version.id)}
                    disabled={isLoading || currentVersionId === version.id}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Load
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteVersion(version.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
</VersioningPanel>

export default VersioningPanel;
