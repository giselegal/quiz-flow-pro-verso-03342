import React, { useState, useEffect } from 'react';
import { getFunnelIdFromEnvOrStorage } from '@/utils/funnelIdentity';
import { schemaDrivenFunnelService, type SchemaDrivenFunnelData } from '@/services/schemaDrivenFunnelService';
import { FunnelManager } from './FunnelManager';
import { SaveStatusIndicator } from './SaveStatusIndicator';
import { FunnelSettingsModal } from './FunnelSettingsModal';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Monitor, Tablet, Smartphone, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FunnelHeaderProps {
  funnelId?: string;
  onFunnelChange?: (funnelId: string) => void;
  lastSaved?: Date | null;
  isSaving?: boolean;
  onManualSave?: () => void;
  // Controles de viewport responsivo
  viewportMode?: 'desktop' | 'tablet' | 'mobile' | 'xl';
  onViewportModeChange?: (mode: 'desktop' | 'tablet' | 'mobile' | 'xl') => void;
}

/**
 * 🎯 CABEÇALHO DO FUNIL
 * 
 * Componente que exibe:
 * - Informações do funil atual
 * - Status de salvamento
 * - Acesso ao gerenciador de funis
 * - Indicadores visuais
 */
export const FunnelHeader: React.FC<FunnelHeaderProps> = ({
  funnelId,
  onFunnelChange,
  lastSaved,
  isSaving,
  onManualSave,
  viewportMode = 'desktop',
  onViewportModeChange
}) => {
  const [currentFunnel, setCurrentFunnel] = useState<SchemaDrivenFunnelData | null>(null);
  const [showManager, setShowManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentFunnelId, setCurrentFunnelId] = useState<string>('');

  // 🎯 Determinar funil atual
  useEffect(() => {
    const activeFunnelId = funnelId || getFunnelIdFromEnvOrStorage() || 'quiz-estilo-completo';
    setCurrentFunnelId(activeFunnelId);
  }, [funnelId]);

  // 📋 Carregar informações do funil atual
  useEffect(() => {
    const loadFunnelInfo = async () => {
      if (!currentFunnelId) return;

      try {
        setLoading(true);
        console.log('📋 Carregando informações do funil:', currentFunnelId);

        // Para funis do template, usar informações hardcoded
        if (currentFunnelId === 'quiz-estilo-completo') {
          setCurrentFunnel({
            id: currentFunnelId,
            name: 'Quiz de Estilo Completo',
            description: 'Template padrão com 21 etapas pré-configuradas',
            pages: [],
            theme: 'default',
            isPublished: true,
            version: 1,
            config: {},
            createdAt: new Date('2024-01-01'),
            lastModified: new Date(),
            user_id: 'template'
          });
        } else {
          // Para funis personalizados, buscar no Supabase
          const funnelData = await schemaDrivenFunnelService.getFunnel(currentFunnelId);
          if (funnelData) {
            setCurrentFunnel(funnelData);
          } else {
            console.warn('⚠️ Funil não encontrado:', currentFunnelId);
            setCurrentFunnel({
              id: currentFunnelId,
              name: 'Funil Desconhecido',
              description: 'Funil não encontrado na base de dados',
              pages: [],
              theme: 'default',
              isPublished: false,
              version: 1,
              config: {},
              createdAt: new Date(),
              lastModified: new Date(),
              user_id: 'unknown'
            });
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar informações do funil:', error);
        setCurrentFunnel(null);
      } finally {
        setLoading(false);
      }
    };

    loadFunnelInfo();
  }, [currentFunnelId]);

  // 🔄 Lidar com mudança de funil
  const handleFunnelSelect = (newFunnelId: string) => {
    setCurrentFunnelId(newFunnelId);
    onFunnelChange?.(newFunnelId);
    setShowManager(false);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border-b border-gray-800/50 px-6 py-4">
        <div className="animate-pulse flex justify-between items-center">
          <div>
            <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-32"></div>
          </div>
          <div className="h-10 bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 border-b border-gray-800/50 px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Informações do Funil */}
          <div className="flex items-center gap-4">
            {/* Ícone e Nome */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-brightBlue to-brand-brightPink rounded-lg flex items-center justify-center text-white font-bold text-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-medium text-gray-200">
                  {currentFunnel?.name || 'Loading...'}
                </h1>
                <p className="text-sm text-gray-400">
                  {currentFunnel?.description || 'Description not available'}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2">
              {currentFunnel?.isPublished && (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                  PUBLISHED
                </span>
              )}
              {currentFunnelId === 'quiz-estilo-completo' && (
                <span className="bg-brand-brightBlue/20 text-brand-brightBlue text-xs px-2 py-1 rounded-full border border-brand-brightBlue/30">
                  TEMPLATE
                </span>
              )}
              <span className="bg-gray-800/50 text-gray-400 text-xs px-2 py-1 rounded-full font-mono border border-gray-700/50">
                {currentFunnelId}
              </span>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-4">
            {/* Controles de Viewport Responsivo */}
            <TooltipProvider>
              <div className="flex items-center bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewportModeChange?.('mobile')}
                      className={cn(
                        "h-8 px-3 rounded-md transition-colors",
                        viewportMode === 'mobile'
                          ? "bg-brand-brightBlue text-white shadow-sm"
                          : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                      )}
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mobile (sm)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewportModeChange?.('tablet')}
                      className={cn(
                        "h-8 px-3 rounded-md transition-colors",
                        viewportMode === 'tablet'
                          ? "bg-brand-brightBlue text-white shadow-sm"
                          : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                      )}
                    >
                      <Tablet className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tablet (md)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewportModeChange?.('desktop')}
                      className={cn(
                        "h-8 px-3 rounded-md transition-colors",
                        viewportMode === 'desktop'
                          ? "bg-brand-brightBlue text-white shadow-sm"
                          : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                      )}
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Desktop (lg)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewportModeChange?.('xl')}
                      className={cn(
                        "h-8 px-3 rounded-md transition-colors",
                        viewportMode === 'xl'
                          ? "bg-brand-brightBlue text-white shadow-sm"
                          : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                      )}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Large Desktop (xl)</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            {/* Status de Salvamento */}
            <SaveStatusIndicator
              funnelId={currentFunnelId}
              lastSaved={lastSaved}
              isSaving={isSaving}
              onManualSave={onManualSave}
              autoSaveEnabled={true}
            />

            {/* Configurações do Funil */}
            <button
              onClick={() => setShowSettings(true)}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-gray-700/50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurações
            </button>

            {/* Gerenciar Funis */}
            <button
              onClick={() => setShowManager(true)}
              className="bg-gradient-to-r from-brand-brightBlue to-brand-brightPink text-white px-4 py-2 rounded-lg hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Manage Funnels
            </button>
          </div>
        </div>

        {/* Informações Adicionais */}
        {currentFunnel && (
          <div className="mt-3 pt-3 border-t border-gray-800/50">
            <div className="flex items-center gap-6 text-sm text-gray-500 max-w-7xl mx-auto">
              <span>
                <strong>Version:</strong> {currentFunnel.version || 1}
              </span>
              <span>
                <strong>Created:</strong> {currentFunnel.createdAt?.toLocaleDateString() || 'N/A'}
              </span>
              <span>
                <strong>Modified:</strong> {currentFunnel.lastModified?.toLocaleDateString() || 'N/A'}
              </span>
              <span>
                <strong>Pages:</strong> {Array.isArray(currentFunnel.pages) ? currentFunnel.pages.length : 0}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal do Gerenciador de Funis */}
      {showManager && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800/50 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <FunnelManager
              currentFunnelId={currentFunnelId}
              onFunnelSelect={handleFunnelSelect}
              onClose={() => setShowManager(false)}
            />
          </div>
        </div>
      )}

      {/* Modal de Configurações do Funil */}
      {showSettings && currentFunnel && (
        <FunnelSettingsModal
          funnelId={currentFunnelId}
          funnelName={currentFunnel.name}
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
};

export default FunnelHeader;