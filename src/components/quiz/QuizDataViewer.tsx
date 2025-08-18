// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuizData } from '@/services/quizDataService';
import { useQuizSessionStats } from '@/hooks/useQuizTracking';
import {
  User,
  Clock,
  MousePointer,
  BarChart3,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  Target,
} from 'lucide-react';

export const QuizDataViewer: React.FC = () => {
  const { getCurrentSession, exportSessionData, clearAllData } = useQuizData();
  const { getStats } = useQuizSessionStats();
  const [currentStats, setCurrentStats] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Atualizar dados a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStats(getStats());
      setSession(getCurrentSession());
    }, 1000);

    return () => clearInterval(interval);
  }, [getStats, getCurrentSession, refreshKey]);

  const handleExportData = () => {
    const data = exportSessionData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_session_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      clearAllData();
      setRefreshKey(prev => prev + 1);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('pt-BR');
  };

  if (!session) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Quiz Data Viewer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p style={{ color: '#8B7355' }}>Nenhuma sessão de quiz ativa.</p>
            <p className="text-sm text-gray-400 mt-2">
              Inicie um quiz para ver os dados em tempo real.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header com estatísticas principais */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Quiz Session Analytics
              {currentStats?.isActive && (
                <Badge variant="default" className="bg-green-500">
                  AO VIVO
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setRefreshKey(prev => prev + 1)}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Atualizar
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-1" />
                Exportar
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClearData}>
                <Trash2 className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <User className="w-4 h-4 text-[#B89B7A]" />
                  <span className="text-sm font-medium">Usuário</span>
                </div>
                <p className="text-lg font-bold">{currentStats.userName || 'Anônimo'}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Duração</span>
                </div>
                <p className="text-lg font-bold">{formatDuration(currentStats.duration)}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Target style={{ color: '#B89B7A' }} />
                  <span className="text-sm font-medium">Questões</span>
                </div>
                <p className="text-lg font-bold">{currentStats.questionsAnswered}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <MousePointer className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Cliques</span>
                </div>
                <p className="text-lg font-bold">{currentStats.totalClicks}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs com dados detalhados */}
      <Tabs defaultValue="answers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="answers">Respostas</TabsTrigger>
          <TabsTrigger value="clicks">Cliques</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="raw">Dados Brutos</TabsTrigger>
        </TabsList>

        {/* Tab de Respostas */}
        <TabsContent value="answers">
          <Card>
            <CardHeader>
              <CardTitle>Respostas do Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {session.answers.map((answer: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">
                          Questão {index + 1}: {answer.questionText}
                        </h4>
                        <Badge variant="outline">{(answer.responseTime / 1000).toFixed(1)}s</Badge>
                      </div>
                      <div style={{ color: '#6B4F43' }}>
                        <strong>Respostas:</strong> {answer.optionTexts.join(', ')}
                      </div>
                      <div style={{ color: '#8B7355' }}>
                        <strong>Pontos de Estilo:</strong> {JSON.stringify(answer.stylePoints)}
                      </div>
                      <div style={{ color: '#8B7355' }}>
                        <strong>Timestamp:</strong> {formatTime(answer.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Cliques */}
        <TabsContent value="clicks">
          <Card>
            <CardHeader>
              <CardTitle>Eventos de Clique</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {session.clickEvents
                    .slice(-50)
                    .reverse()
                    .map((click: any, index: number) => (
                      <div key={index} style={{ backgroundColor: '#FAF9F7' }}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {click.elementType}
                          </Badge>
                          <span className="text-sm">
                            {click.elementText || click.elementId || 'Elemento sem texto'}
                          </span>
                        </div>
                        <div style={{ color: '#8B7355' }}>{formatTime(click.timestamp)}</div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Estatísticas */}
        <TabsContent value="stats">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStats && (
                  <>
                    <div className="flex justify-between">
                      <span>Tempo médio por resposta:</span>
                      <Badge>{(currentStats.averageResponseTime / 1000).toFixed(1)}s</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Cliques por questão:</span>
                      <Badge>{currentStats.clicksPerQuestion.toFixed(1)}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Dispositivo:</span>
                      <Badge>
                        {currentStats.device?.isMobile
                          ? 'Mobile'
                          : currentStats.device?.isTablet
                            ? 'Tablet'
                            : 'Desktop'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Resolução:</span>
                      <Badge>
                        {currentStats.device?.viewportWidth}x{currentStats.device?.viewportHeight}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>ID da Sessão:</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {session.sessionId.slice(-8)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Início:</span>
                  <Badge>{formatTime(session.startTime)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Referrer:</span>
                  <Badge className="max-w-32 truncate">{session.referrer || 'Direto'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>User Agent:</span>
                  <Badge className="max-w-32 truncate">
                    {session.userAgent?.split(' ')[0] || 'Desconhecido'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab de Dados Brutos */}
        <TabsContent value="raw">
          <Card>
            <CardHeader>
              <CardTitle>Dados Brutos da Sessão</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <pre style={{ backgroundColor: '#E5DDD5' }}>{JSON.stringify(session, null, 2)}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
