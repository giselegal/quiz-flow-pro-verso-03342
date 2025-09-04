import React, { useState, useEffect } from 'react';
import { getFunnelIdFromEnvOrStorage } from '@/utils/funnelIdentity';
import { schemaDrivenFunnelService, type SchemaDrivenFunnelData } from '@/services/schemaDrivenFunnelService';
import { FunnelManager } from './FunnelManager';
import { SaveStatusIndicator } from './SaveStatusIndicator';

interface FunnelHeaderProps {
  funnelId?: string;
  onFunnelChange?: (funnelId: string) => void;
  lastSaved?: Date | null;
  isSaving?: boolean;
  onManualSave?: () => void;
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
  onManualSave
}) => {
  const [currentFunnel, setCurrentFunnel] = useState<SchemaDrivenFunnelData | null>(null);
  const [showManager, setShowManager] = useState(false);
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
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="animate-pulse flex justify-between items-center">
          <div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* 🎯 Informações do Funil */}
          <div className="flex items-center gap-4">
            {/* 📊 Ícone e Nome */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                🎯
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {currentFunnel?.name || 'Carregando...'}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentFunnel?.description || 'Descrição não disponível'}
                </p>
              </div>
            </div>

            {/* 🏷️ Tags */}
            <div className="flex items-center gap-2">
              {currentFunnel?.isPublished && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  PUBLICADO
                </span>
              )}
              {currentFunnelId === 'quiz-estilo-completo' && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  TEMPLATE
                </span>
              )}
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-mono">
                {currentFunnelId}
              </span>
            </div>
          </div>

          {/* 🛠️ Controles */}
          <div className="flex items-center gap-4">
            {/* 💾 Status de Salvamento */}
            <SaveStatusIndicator
              funnelId={currentFunnelId}
              lastSaved={lastSaved}
              isSaving={isSaving}
              onManualSave={onManualSave}
              autoSaveEnabled={true}
            />

            {/* 📋 Gerenciar Funis */}
            <button
              onClick={() => setShowManager(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>📋</span>
              Gerenciar Funis
            </button>
          </div>
        </div>

        {/* 📊 Informações Adicionais */}
        {currentFunnel && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-6 text-sm text-gray-500 max-w-7xl mx-auto">
              <span>
                <strong>Versão:</strong> {currentFunnel.version || 1}
              </span>
              <span>
                <strong>Criado:</strong> {currentFunnel.createdAt?.toLocaleDateString() || 'N/A'}
              </span>
              <span>
                <strong>Modificado:</strong> {currentFunnel.lastModified?.toLocaleDateString() || 'N/A'}
              </span>
              <span>
                <strong>Páginas:</strong> {Array.isArray(currentFunnel.pages) ? currentFunnel.pages.length : 0}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 📋 Modal do Gerenciador de Funis */}
      {showManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <FunnelManager
              currentFunnelId={currentFunnelId}
              onFunnelSelect={handleFunnelSelect}
              onClose={() => setShowManager(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FunnelHeader;