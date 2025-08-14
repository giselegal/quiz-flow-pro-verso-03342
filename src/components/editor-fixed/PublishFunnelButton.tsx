// @ts-nocheck
/**
 * PUBLISH FUNNEL BUTTON
 * Botão para publicar o funil completo com validação e feedback
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Copy,
  ExternalLink 
} from 'lucide-react';
import { publishFunnel, PublishFunnelData } from '@/services/funnelPublishing';
import { toast } from '@/components/ui/use-toast';

interface PublishFunnelButtonProps {
  funnelData: PublishFunnelData;
  onPublishSuccess?: (publicUrl: string) => void;
  disabled?: boolean;
  className?: string;
}

export const PublishFunnelButton: React.FC<PublishFunnelButtonProps> = ({
  funnelData,
  onPublishSuccess,
  disabled,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    publicUrl?: string;
    error?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: funnelData.name || '',
    description: funnelData.description || ''
  });

  const handlePublish = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, insira um nome para o funil.',
        variant: 'destructive'
      });
      return;
    }

    setIsPublishing(true);
    setPublishResult(null);

    try {
      const dataToPublish: PublishFunnelData = {
        ...funnelData,
        name: formData.name,
        description: formData.description
      };

      const result = await publishFunnel(dataToPublish);
      setPublishResult(result);

      if (result.success && result.publicUrl) {
        onPublishSuccess?.(result.publicUrl);
      }

    } catch (error) {
      setPublishResult({
        success: false,
        error: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado!',
      description: 'URL copiada para a área de transferência.',
    });
  };

  const openPublicUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const resetDialog = () => {
    setPublishResult(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          disabled={disabled || !funnelData.stages || funnelData.stages.length !== 21}
          className={`gap-2 ${className}`}
        >
          <Globe className="h-4 w-4" />
          Publicar Funil
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Publicar Funil de Quiz
          </DialogTitle>
          <DialogDescription>
            Publique seu funil de 21 etapas para que os usuários possam acessá-lo.
          </DialogDescription>
        </DialogHeader>

        {!publishResult ? (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="funnel-name">Nome do Funil</Label>
                <Input
                  id="funnel-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Quiz de Estilo Pessoal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="funnel-description">Descrição (opcional)</Label>
                <Textarea
                  id="funnel-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o objetivo do seu quiz..."
                  rows={3}
                />
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p><strong>Seu funil possui:</strong></p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{funnelData.stages?.length || 0} etapas</Badge>
                      <Badge variant="secondary">
                        {funnelData.stages?.reduce((total, stage) => total + (stage.blocks?.length || 0), 0)} blocos
                      </Badge>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={resetDialog}>
                Cancelar
              </Button>
              <Button 
                onClick={handlePublish} 
                disabled={isPublishing || !formData.name.trim()}
                className="gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4" />
                    Publicar Agora
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            {publishResult.success ? (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Funil publicado com sucesso!</strong>
                    <br />
                    Seu quiz está agora disponível publicamente.
                  </AlertDescription>
                </Alert>

                {publishResult.publicUrl && (
                  <div className="space-y-2">
                    <Label>URL Pública:</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={publishResult.publicUrl} 
                        readOnly 
                        className="text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(publishResult.publicUrl!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPublicUrl(publishResult.publicUrl!)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Erro na publicação:</strong>
                  <br />
                  {publishResult.error}
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button onClick={resetDialog}>
                Fechar
              </Button>
              {publishResult.success && publishResult.publicUrl && (
                <Button 
                  variant="default" 
                  onClick={() => openPublicUrl(publishResult.publicUrl!)}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver Quiz Público
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PublishFunnelButton;