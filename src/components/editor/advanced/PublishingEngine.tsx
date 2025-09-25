import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  Globe, 
  Settings, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Clock,
  BarChart3,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Rocket, 
  Globe, 
  Settings, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Clock,
  BarChart3,
  Copy,
  ExternalLink
} from 'lucide-react';
import { PublishService, PublishOptions, PublishResult } from '@/services/publishService';

interface PublishingEngineProps {
  funnelId: string;
  onPublishComplete?: (result: PublishResult) => void;
}

interface PublishingState {
  isPublishing: boolean;
  publishProgress: number;
  publishResult: PublishResult | null;
  previewUrl: string | null;
  lastPublished: Date | null;
}

export const PublishingEngine: React.FC<PublishingEngineProps> = ({
  funnelId,
  onPublishComplete,
}) => {
  const [publishingState, setPublishingState] = useState<PublishingState>({
    isPublishing: false,
    publishProgress: 0,
    publishResult: null,
    previewUrl: null,
    lastPublished: null,
  });

  const [publishOptions, setPublishOptions] = useState<PublishOptions>({
    funnelId,
    environment: 'staging',
    enableAnalytics: true,
    customDomain: '',
  });

  const [activeTab, setActiveTab] = useState('publish');

  const handlePublish = useCallback(async () => {
    setPublishingState(prev => ({
      ...prev,
      isPublishing: true,
      publishProgress: 0,
      publishResult: null,
    }));

    try {
      // Simulate publishing progress
      const progressSteps = [
        { step: 'Validando configurações...', progress: 20 },
        { step: 'Compilando assets...', progress: 40 },
        { step: 'Otimizando imagens...', progress: 60 },
        { step: 'Enviando para servidor...', progress: 80 },
        { step: 'Finalizando deploy...', progress: 100 },
      ];

      for (const { step, progress } of progressSteps) {
        console.log(`📤 ${step}`);
        setPublishingState(prev => ({ ...prev, publishProgress: progress }));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const result = await PublishService.publishFunnel(publishOptions);
      
      setPublishingState(prev => ({
        ...prev,
        isPublishing: false,
        publishResult: result,
        previewUrl: result.url || null,
        lastPublished: result.success ? new Date() : prev.lastPublished,
      }));

      if (onPublishComplete) {
        onPublishComplete(result);
      }
      
    } catch (error) {
      console.error('❌ Erro durante a publicação:', error);
      setPublishingState(prev => ({
        ...prev,
        isPublishing: false,
        publishResult: {
          success: false,
          errors: ['Erro inesperado durante a publicação'],
        },
      }));
    }
  }, [publishOptions, funnelId, onPublishComplete]);

  const copyUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    console.log('📋 URL copiada para a área de transferência');
  }, []);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="w-5 h-5" />
          Engine de Publicação
        </CardTitle>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {publishOptions.environment === 'staging' ? 'Ambiente de Teste' : 'Produção'}
          </Badge>
          {publishingState.lastPublished && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Última publicação: {publishingState.lastPublished.toLocaleString()}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="publish">
              <Rocket className="w-4 h-4 mr-2" />
              Publicar
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="publish" className="space-y-6 mt-6">
            {/* Publishing Status */}
            {publishingState.isPublishing && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div>Publicando seu funil...</div>
                    <Progress value={publishingState.publishProgress} className="w-full" />
                    <div className="text-sm text-muted-foreground">
                      {publishingState.publishProgress}% completo
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Publish Result */}
            {publishingState.publishResult && (
              <Alert className={publishingState.publishResult.success ? 'border-green-200' : 'border-red-200'}>
                {publishingState.publishResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>
                  {publishingState.publishResult.success ? (
                    <div className="space-y-2">
                      <div className="font-medium text-green-800">
                        🎉 Funil publicado com sucesso!
                      </div>
                      {publishingState.publishResult.url && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">URL:</span>
                          <code className="px-2 py-1 bg-muted rounded text-sm">
                            {publishingState.publishResult.url}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyUrl(publishingState.publishResult!.url!)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(publishingState.publishResult!.url!, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="font-medium text-red-800">
                        ❌ Erro na publicação
                      </div>
                      {publishingState.publishResult.errors?.map((error, index) => (
                        <div key={index} className="text-sm text-red-700">
                          • {error}
                        </div>
                      ))}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Publish Button */}
            <div className="flex gap-4">
              <Button
                onClick={handlePublish}
                disabled={publishingState.isPublishing}
                className="flex-1"
                size="lg"
              >
                <Rocket className="w-4 h-4 mr-2" />
                {publishingState.isPublishing ? 'Publicando...' : 'Publicar Funil'}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => setPublishOptions(prev => ({ 
                  ...prev, 
                  environment: prev.environment === 'staging' ? 'production' : 'staging' 
                }))}
              >
                <Globe className="w-4 h-4 mr-2" />
                {publishOptions.environment === 'staging' ? 'Usar Produção' : 'Usar Teste'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Configurações de Deploy</h3>
                
                <div className="space-y-2">
                  <Label>Domínio Personalizado</Label>
                  <Input
                    placeholder="meu-site.com"
                    value={publishOptions.customDomain || ''}
                    onChange={(e) => setPublishOptions(prev => ({
                      ...prev,
                      customDomain: e.target.value
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Habilitar Analytics</Label>
                  <Switch
                    checked={publishOptions.enableAnalytics}
                    onCheckedChange={(checked) => setPublishOptions(prev => ({
                      ...prev,
                      enableAnalytics: checked
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Otimizações</h3>
                
                <div className="flex items-center justify-between">
                  <Label>Comprimir Imagens</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Minificar CSS/JS</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Cache Otimizado</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            {publishingState.previewUrl ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Preview do Funil</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyUrl(publishingState.previewUrl!)}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar URL
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(publishingState.previewUrl!, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Abrir em Nova Aba
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    src={publishingState.previewUrl}
                    className="w-full h-96"
                    title="Preview do Funil"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Publique seu funil para visualizar o preview</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Analytics serão exibidos após a primeira publicação</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};