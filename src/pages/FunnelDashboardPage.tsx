import React, { useState, useEffect } from 'react';
import { getFunnelIdFromEnvOrStorage, saveFunnelIdToStorage } from '@/utils/funnelIdentity';
import { FunnelManager } from '@/components/editor/FunnelManager';
import { useLocation } from 'wouter';
import { toast } from '@/hooks/use-toast';

interface FunnelDashboardPageProps {}

/**
 * 🎯 PÁGINA DO DASHBOARD DE FUNIS
 * 
 * Página dedicada para:
 * - Visualizar todos os funis
 * - Criar novos funis
 * - Gerenciar funis existentes
 * - Navegar para o editor
 */
export const FunnelDashboardPage: React.FC<FunnelDashboardPageProps> = () => {
  const [, setLocation] = useLocation();
  const [currentFunnelId, setCurrentFunnelId] = useState<string>('');

  // 🔄 Carregar funil atual
  useEffect(() => {
    const activeFunnelId = getFunnelIdFromEnvOrStorage() || 'quiz-estilo-completo';
    setCurrentFunnelId(activeFunnelId);
  }, []);

  // 🎯 Navegar para o editor com funil selecionado
  const handleFunnelSelect = (funnelId: string) => {
    console.log('🎯 Navegando para editor com funil:', funnelId);
    
    // Salvar funil selecionado
    saveFunnelIdToStorage(funnelId);
    setCurrentFunnelId(funnelId);
    
    // Navegar para o editor
    setLocation(`/editor?funnel=${funnelId}`);
    
    toast({
      title: 'Funil selecionado',
      description: `Abrindo editor para o funil: ${funnelId}`,
      variant: 'default'
    });
  };

  // 🏠 Navegar para home
  const handleGoHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 📋 Cabeçalho da Página */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                🎯 Dashboard de Funis
              </h1>
              <span className="text-sm text-gray-500">
                Gerencie todos os seus funis de quiz
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoHome}
                className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                🏠 Início
              </button>
              {currentFunnelId && (
                <button
                  onClick={() => handleFunnelSelect(currentFunnelId)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ✏️ Editar Funil Ativo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Funil Ativo */}
      {currentFunnelId && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-blue-800 mb-1">
                  🎯 Funil Ativo
                </h2>
                <p className="text-blue-700">
                  <strong>ID:</strong> {currentFunnelId}
                </p>
                <p className="text-blue-600 text-sm">
                  Este é o funil que será editado quando você abrir o editor
                </p>
              </div>
              <button
                onClick={() => handleFunnelSelect(currentFunnelId)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ✏️ Abrir Editor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📋 Gerenciador de Funis */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <FunnelManager
          currentFunnelId={currentFunnelId}
          onFunnelSelect={handleFunnelSelect}
        />
      </div>

      {/* 🚀 Ações Rápidas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🚀 Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleFunnelSelect('quiz-estilo-completo')}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-semibold text-gray-800">Template Padrão</h4>
              <p className="text-sm text-gray-600">
                Abrir o template de 21 etapas
              </p>
            </button>
            
            <button
              onClick={() => setLocation('/editor')}
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
            >
              <div className="text-2xl mb-2">✨</div>
              <h4 className="font-semibold text-gray-800">Editor Rápido</h4>
              <p className="text-sm text-gray-600">
                Abrir editor com funil atual
              </p>
            </button>
            
            <button
              onClick={handleGoHome}
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
            >
              <div className="text-2xl mb-2">🏠</div>
              <h4 className="font-semibold text-gray-800">Página Inicial</h4>
              <p className="text-sm text-gray-600">
                Voltar para a home
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* 📚 Documentação */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            📚 Como usar o sistema de funis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-yellow-700">
            <div>
              <h4 className="font-semibold mb-2">🎯 Gerenciamento de Funis:</h4>
              <ul className="space-y-1">
                <li>• Cada funil tem um ID único</li>
                <li>• Use o parâmetro <code>?funnel=ID</code> na URL</li>
                <li>• Alterações são salvas automaticamente</li>
                <li>• Funis são isolados entre si</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💾 Sistema de Salvamento:</h4>
              <ul className="space-y-1">
                <li>• Auto-save a cada 2 segundos</li>
                <li>• Dados salvos no Supabase</li>
                <li>• Backup local automático</li>
                <li>• Indicadores visuais de status</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelDashboardPage;