/**
 * 🎉 PUBLISH SUCCESS PAGE
 * 
 * Página de sucesso após publicação de um funil.
 * Exibe mensagem de confirmação, link de preview público e botão para copiar link.
 * 
 * Rota: /publish/success
 */

import React, { useCallback, useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { CheckCircle2, Copy, ExternalLink, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { appLogger } from '@/lib/utils/appLogger';

interface PublishSuccessPageProps {
  // Props podem ser passados via location state ou query params
}

export function PublishSuccessPage(_props: PublishSuccessPageProps) {
  const [location] = useLocation();
  const [copied, setCopied] = useState(false);
  const [publishData, setPublishData] = useState<{
    funnelId?: string;
    previewUrl?: string;
    publishedAt?: string;
  }>({});

  // Extrair dados de query params
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const funnelId = params.get('funnelId') || params.get('id') || undefined;
      const previewUrl = params.get('previewUrl') || (funnelId ? `${window.location.origin}/preview/${funnelId}` : undefined);
      const publishedAt = params.get('publishedAt') || new Date().toISOString();

      setPublishData({
        funnelId,
        previewUrl,
        publishedAt,
      });

      appLogger.info('[PublishSuccessPage] Mounted with data:', { funnelId, previewUrl });
    } catch (error) {
      appLogger.error('[PublishSuccessPage] Error parsing params:', error);
    }
  }, []);

  // Copiar link para clipboard
  const handleCopyLink = useCallback(async () => {
    if (!publishData.previewUrl) return;

    try {
      await navigator.clipboard.writeText(publishData.previewUrl);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
      
      appLogger.info('[PublishSuccessPage] Link copied to clipboard');
    } catch (error) {
      appLogger.error('[PublishSuccessPage] Copy failed:', error);
      // Show manual copy instruction as fallback
      // The Clipboard API is widely supported now, but in case it fails
      // we'll show a toast with instructions
      alert(`Copie o link manualmente: ${publishData.previewUrl}`);
    }
  }, [publishData.previewUrl]);

  // Compartilhar (se disponível)
  const handleShare = useCallback(async () => {
    if (!publishData.previewUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Meu Quiz',
          text: 'Confira meu quiz!',
          url: publishData.previewUrl,
        });
        appLogger.info('[PublishSuccessPage] Shared via Web Share API');
      } else {
        // Fallback to copy
        handleCopyLink();
      }
    } catch (error) {
      appLogger.warn('[PublishSuccessPage] Share cancelled or failed:', error);
    }
  }, [publishData.previewUrl, handleCopyLink]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center pb-2">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-200">
            Funil Publicado com Sucesso! 🎉
          </CardTitle>
          
          <CardDescription className="text-green-600 dark:text-green-400">
            Seu funil está disponível publicamente
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Publication Info */}
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-300">
              Publicado em {new Date(publishData.publishedAt || '').toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </Badge>
          </div>

          {/* Preview URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Link Público do Preview
            </label>
            <div className="flex gap-2">
              <Input
                value={publishData.previewUrl || ''}
                readOnly
                className="flex-1 bg-white dark:bg-gray-800"
              />
              <Button
                variant={copied ? 'default' : 'outline'}
                size="icon"
                onClick={handleCopyLink}
                className={copied ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Link copiado para a área de transferência!
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              asChild
            >
              <a href={publishData.previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Preview
              </a>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                asChild
              >
                <Link href={publishData.funnelId ? `/editor/${publishData.funnelId}` : '/editor'}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Editor
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                className="flex-1"
                asChild
              >
                <Link href="/meus-funis">
                  Meus Funis
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PublishSuccessPage;
