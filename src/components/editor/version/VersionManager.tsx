import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { History, Clock, User, RotateCcw, Save, FileText, GitBranch } from 'lucide-react';
import { type FunnelVersion } from '@/services/schemaDrivenFunnelService';

interface VersionManagerProps {
  versions: FunnelVersion[];
  currentVersion?: number;
  onRestoreVersion: (versionId: string) => void;
  className?: string;
  trigger?: React.ReactNode;
}

export const VersionManager: React.FC<VersionManagerProps> = ({
  versions,
  currentVersion,
  onRestoreVersion,
  className = '',
  trigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTimeDifference = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    } else if (diffHours > 0) {
      return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${Math.max(1, diffMinutes)} minuto${diffMinutes > 1 ? 's' : ''} atrás`;
    }
  };

  const handleRestore = () => {
    if (selectedVersion) {
      onRestoreVersion(selectedVersion);
      setIsOpen(false);
      setSelectedVersion(null);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className={className}>
      <History className="w-4 h-4 mr-2" />
      Versões ({versions.length})
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5" />
            <span>Histórico de Versões</span>
          </DialogTitle>
          <DialogDescription>
            Visualize e restaure versões anteriores do seu funil. As versões são salvas
            automaticamente conforme você edita.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#B89B7A]" />
                  <div>
                    <p className="text-sm font-medium">Total de Versões</p>
                    <p className="text-2xl font-bold">{versions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Auto-saves</p>
                    <p className="text-2xl font-bold">
                      {versions.filter(v => v.isAutoSave).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <User style={{ color: '#B89B7A' }} />
                  <div>
                    <p className="text-sm font-medium">Manuais</p>
                    <p className="text-2xl font-bold">
                      {versions.filter(v => !v.isAutoSave).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de versões */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Versões Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <div className="p-4 space-y-3">
                  {versions.length === 0 ? (
                    <div style={{ color: '#8B7355' }}>
                      <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma versão encontrada</p>
                      <p className="text-sm">
                        As versões serão criadas automaticamente conforme você edita
                      </p>
                    </div>
                  ) : (
                    versions
                      .sort((a, b) => b.version - a.version)
                      .map(version => (
                        <div
                          key={version.id}
                          className={`
                            border rounded-lg p-4 cursor-pointer transition-all duration-200
                            ${
                              selectedVersion === version.id
                                ? 'border-[#B89B7A] bg-[#B89B7A]/10'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                            ${currentVersion === version.version ? 'ring-2 ring-green-200' : ''}
                          `}
                          onClick={() => setSelectedVersion(version.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge
                                  variant={
                                    currentVersion === version.version ? 'default' : 'outline'
                                  }
                                >
                                  v{version.version}
                                  {currentVersion === version.version && ' (atual)'}
                                </Badge>

                                <Badge variant={version.isAutoSave ? 'secondary' : 'outline'}>
                                  {version.isAutoSave ? 'Auto-save' : 'Manual'}
                                </Badge>
                              </div>

                              <p className="font-medium text-sm mb-1">
                                {version.description || 'Sem descrição'}
                              </p>

                              <div style={{ color: '#8B7355' }}>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDate(version.createdAt)}</span>
                                </div>
                                <span>•</span>
                                <span>{getTimeDifference(version.createdAt)}</span>
                              </div>

                              {/* Informações da versão */}
                              <div style={{ color: '#6B4F43' }}>
                                <span>
                                  {version.data.pages.length} página
                                  {version.data.pages.length !== 1 ? 's' : ''} •{' '}
                                  {version.data.pages.reduce(
                                    (total: number, page: any) => total + page.blocks.length,
                                    0
                                  )}{' '}
                                  bloco
                                  {version.data.pages.reduce(
                                    (total: number, page: any) => total + page.blocks.length,
                                    0
                                  ) !== 1
                                    ? 's'
                                    : ''}
                                </span>
                              </div>
                            </div>

                            {selectedVersion === version.id &&
                              currentVersion !== version.version && (
                                <Button
                                  size="sm"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleRestore();
                                  }}
                                  className="ml-2"
                                >
                                  <RotateCcw className="w-3 h-3 mr-1" />
                                  Restaurar
                                </Button>
                              )}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Ações */}
          {selectedVersion &&
            currentVersion !== versions.find(v => v.id === selectedVersion)?.version && (
              <div style={{ borderColor: '#E5DDD5' }}>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-stone-600" />
                  <span className="text-sm font-medium text-stone-700">
                    Restaurar versão selecionada?
                  </span>
                </div>
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedVersion(null)}>
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRestore}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    Confirmar Restauração
                  </Button>
                </div>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
