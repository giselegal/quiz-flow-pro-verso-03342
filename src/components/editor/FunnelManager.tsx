import React, { useState, useEffect, useCallback } from 'react';
import { schemaDrivenFunnelService, type SchemaDrivenFunnelData } from '@/services/schemaDrivenFunnelService';
import { generateId } from '@/types/unified-schema';
import { toast } from '@/hooks/use-toast';
import { getFunnelIdFromEnvOrStorage, saveFunnelIdToStorage } from '@/utils/funnelIdentity';

interface FunnelManagerProps {
  currentFunnelId?: string;
  onFunnelSelect?: (funnelId: string) => void;
  onClose?: () => void;
}

interface FunnelInfo {
  id: string;
  name: string;
  description: string;
  lastModified: Date;
  isPublished: boolean;
  isActive: boolean;
}

/**
 * 🎯 GERENCIADOR DE FUNIS
 * 
 * Interface para:
 * - Visualizar funis existentes
 * - Criar novos funis
 * - Navegar entre funis
 * - Indicar qual funil está ativo
 */
export const FunnelManager: React.FC<FunnelManagerProps> = ({
  currentFunnelId,
  onFunnelSelect,
  onClose
}) => {
  const [funnels, setFunnels] = useState<FunnelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newFunnelName, setNewFunnelName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // 🔍 Determinar funil atual
  const activeFunnelId = currentFunnelId || getFunnelIdFromEnvOrStorage() || 'quiz-estilo-completo';

  // 📋 Carregar lista de funis
  const loadFunnels = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando lista de funis...');
      
      const funnelList = await schemaDrivenFunnelService.listFunnels();
      
      const mappedFunnels: FunnelInfo[] = funnelList.map(funnel => ({
        id: funnel.id,
        name: funnel.name,
        description: funnel.description,
        lastModified: funnel.lastModified || new Date(),
        isPublished: funnel.isPublished || false,
        isActive: funnel.id === activeFunnelId
      }));

      // 🎯 Adicionar funis do template se não existirem
      const templateFunnels = [
        {
          id: 'quiz-estilo-completo',
          name: 'Quiz de Estilo Completo (Template)',
          description: 'Template padrão com 21 etapas pré-configuradas',
          lastModified: new Date(),
          isPublished: true,
          isActive: activeFunnelId === 'quiz-estilo-completo'
        }
      ];

      // Combinar funis do banco com templates
      const existingIds = new Set(mappedFunnels.map(f => f.id));
      const allFunnels = [
        ...mappedFunnels,
        ...templateFunnels.filter(tf => !existingIds.has(tf.id))
      ];

      setFunnels(allFunnels);
      console.log('✅ Funis carregados:', allFunnels.length);
    } catch (error) {
      console.error('❌ Erro ao carregar funis:', error);
      toast({
        title: 'Erro ao carregar funis',
        description: 'Não foi possível carregar a lista de funis',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [activeFunnelId]);

  // 🔄 Carregar na inicialização
  useEffect(() => {
    loadFunnels();
  }, [loadFunnels]);

  // ➕ Criar novo funil
  const handleCreateFunnel = async () => {
    if (!newFunnelName.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Digite um nome para o novo funil',
        variant: 'destructive'
      });
      return;
    }

    try {
      setCreating(true);
      console.log('🆕 Criando novo funil:', newFunnelName);

      const newFunnel = await schemaDrivenFunnelService.createFunnel({
        id: generateId(),
        name: newFunnelName.trim(),
        description: `Funil criado em ${new Date().toLocaleDateString()}`,
        pages: []
      });

      console.log('✅ Funil criado com sucesso:', newFunnel.id);

      toast({
        title: 'Funil criado',
        description: `Funil "${newFunnel.name}" criado com sucesso`,
        variant: 'default'
      });

      // 🔄 Recarregar lista
      await loadFunnels();
      
      // 🎯 Selecionar o novo funil
      handleSelectFunnel(newFunnel.id);
      
      // 🧹 Limpar formulário
      setNewFunnelName('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('❌ Erro ao criar funil:', error);
      toast({
        title: 'Erro ao criar funil',
        description: 'Não foi possível criar o novo funil',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  // 🎯 Selecionar funil
  const handleSelectFunnel = (funnelId: string) => {
    console.log('🎯 Selecionando funil:', funnelId);
    
    // 💾 Salvar no localStorage
    saveFunnelIdToStorage(funnelId);
    
    // 🔄 Atualizar lista local
    setFunnels(prev => prev.map(f => ({ ...f, isActive: f.id === funnelId })));
    
    // 📢 Notificar componente pai
    onFunnelSelect?.(funnelId);
    
    toast({
      title: 'Funil selecionado',
      description: `Agora editando: ${funnels.find(f => f.id === funnelId)?.name || funnelId}`,
      variant: 'default'
    });

    // 🔗 Navegar para o editor com o funil selecionado
    const newUrl = `/editor?funnel=${funnelId}`;
    if (window.location.href !== window.location.origin + newUrl) {
      window.location.href = newUrl;
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* 📋 Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Gerenciar Funis
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie seus funis de quiz e navegue entre eles
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
          >
            ✕
          </button>
        )}
      </div>

      {/* 🎯 Funil Atual */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="font-semibold text-blue-800">Funil Ativo</span>
        </div>
        <p className="text-blue-700">
          <strong>ID:</strong> {activeFunnelId}
        </p>
        <p className="text-blue-600 text-sm mt-1">
          Este é o funil que está sendo editado atualmente
        </p>
      </div>

      {/* ➕ Criar Novo Funil */}
      <div className="mb-6">
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            Criar Novo Funil
          </button>
        ) : (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-3">Criar Novo Funil</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newFunnelName}
                onChange={(e) => setNewFunnelName(e.target.value)}
                placeholder="Nome do funil..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFunnel()}
              />
              <button
                onClick={handleCreateFunnel}
                disabled={creating || !newFunnelName.trim()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? '⏳' : '✅'} {creating ? 'Criando...' : 'Criar'}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewFunnelName('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 📋 Lista de Funis */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 mb-3">
          Funis Disponíveis ({funnels.length})
        </h3>
        
        {funnels.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum funil encontrado</p>
            <p className="text-sm mt-1">Crie seu primeiro funil para começar</p>
          </div>
        ) : (
          funnels.map((funnel) => (
            <div
              key={funnel.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                funnel.isActive
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => handleSelectFunnel(funnel.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold ${
                      funnel.isActive ? 'text-blue-800' : 'text-gray-800'
                    }`}>
                      {funnel.name}
                    </h4>
                    {funnel.isActive && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        ATIVO
                      </span>
                    )}
                    {funnel.isPublished && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        PUBLICADO
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    funnel.isActive ? 'text-blue-600' : 'text-gray-600'
                  } mb-2`}>
                    {funnel.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>ID: {funnel.id}</span>
                    <span>Modificado: {funnel.lastModified.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="ml-4">
                  {funnel.isActive ? (
                    <div className="text-blue-500 text-xl">🎯</div>
                  ) : (
                    <div className="text-gray-400 text-xl hover:text-blue-500 transition-colors">
                      👁️
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 💡 Dicas */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Como funciona o salvamento:</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• As alterações no editor são salvas automaticamente no Supabase</li>
          <li>• O funil ativo é identificado pelo parâmetro <code>?funnel=ID</code> na URL</li>
          <li>• Cada funil tem um ID único e mantém suas alterações separadamente</li>
          <li>• Clique em um funil para navegar para ele e começar a editar</li>
        </ul>
      </div>
    </div>
  );
};

export default FunnelManager;