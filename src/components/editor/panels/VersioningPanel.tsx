
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Trash2, RotateCcw, Download } from 'lucide-react';
import { Version } from '@/types/quiz';

export interface VersioningPanelProps {
  versions: Version[];
  onDeleteVersion: (versionId: string) => void;
  onRestoreVersion: (versionId: string) => void;
}

export const VersioningPanel: React.FC<VersioningPanelProps> = ({
  versions,
  onDeleteVersion,
  onRestoreVersion
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Histórico de Versões</h3>
        <Badge variant="outline">{versions.length}</Badge>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        {versions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma versão salva ainda</p>
          </div>
        ) : (
          versions.map((version) => (
            <Card key={version.id} className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{version.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      v{version.version || 1}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {version.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatDate(version.timestamp)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRestoreVersion(version.id)}
                    className="h-8 w-8 p-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteVersion(version.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
