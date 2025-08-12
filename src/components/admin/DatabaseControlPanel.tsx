/**
 * 🎛️ PAINEL DE CONTROLE DO SISTEMA DE COMPONENTES REUTILIZÁVEIS
 * Interface para gerenciar modo banco/local e migração
 */

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';

interface DatabaseControlPanelProps {
  className?: string;
}

export const DatabaseControlPanel: React.FC<DatabaseControlPanelProps> = ({ className = '' }) => {
  const { databaseMode } = useEditor();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<
    'idle' | 'migrating' | 'success' | 'error'
  >('idle');

  // ============================================================================
  // CARREGAR ESTATÍSTICAS
  // ============================================================================

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await databaseMode.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [databaseMode.isEnabled]);

  // ============================================================================
  // FUNÇÕES DE CONTROLE
  // ============================================================================

  const handleToggleMode = () => {
    databaseMode.setDatabaseMode(!databaseMode.isEnabled);
  };

  const handleMigration = async () => {
    setMigrationStatus('migrating');
    try {
      const success = await databaseMode.migrateToDatabase();
      setMigrationStatus(success ? 'success' : 'error');
      if (success) {
        await loadStats();
      }
    } catch (error) {
      console.error('Erro na migração:', error);
      setMigrationStatus('error');
    }
  };

  const handleQuizIdChange = (newQuizId: string) => {
    if (newQuizId.trim()) {
      databaseMode.setQuizId(newQuizId.trim());
    }
  };

  // ============================================================================
  // RENDERIZAÇÃO
  // ============================================================================

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 style={{ color: '#432818' }}>Sistema de Componentes</h3>
          <p style={{ color: '#8B7355' }}>Gerenciar modo banco/local e migração</p>
        </div>

        {/* Status Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            databaseMode.isEnabled ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-700'
          }`}
        >
          {databaseMode.isEnabled ? '🔗 Banco Ativo' : '📁 Modo Local'}
        </div>
      </div>

      {/* Quiz ID Control */}
      <div className="mb-6">
        <label style={{ color: '#6B4F43' }}>Quiz ID</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={databaseMode.quizId}
            onChange={e => handleQuizIdChange(e.target.value)}
            style={{ borderColor: '#E5DDD5' }}
            placeholder="ex: quiz-demo-id"
          />
          <button
            onClick={() => databaseMode.setQuizId(`quiz-${Date.now()}`)}
            style={{ color: '#6B4F43' }}
          >
            🎲 Gerar
          </button>
        </div>
        <p style={{ color: '#8B7355' }}>ID único do quiz no banco de dados</p>
      </div>

      {/* Mode Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 style={{ color: '#432818' }}>Modo de Operação</h4>
            <p style={{ color: '#8B7355' }}>
              {databaseMode.isEnabled
                ? 'Componentes salvos no banco de dados'
                : 'Componentes carregados de templates locais'}
            </p>
          </div>

          <button
            onClick={handleToggleMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              databaseMode.isEnabled ? 'bg-[#B89B7A]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                databaseMode.isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Migration Section */}
      {!databaseMode.isEnabled && (
        <div className="mb-6 p-4 bg-[#B89B7A]/10 border border-[#B89B7A]/30 rounded-md">
          <h4 className="text-sm font-medium text-[#432818] mb-2">🚀 Migrar para Banco de Dados</h4>
          <p className="text-xs text-[#A38A69] mb-3">
            Converta seus templates locais para o sistema de componentes reutilizáveis no banco
          </p>

          <button
            onClick={handleMigration}
            disabled={migrationStatus === 'migrating'}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              migrationStatus === 'migrating'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : migrationStatus === 'success'
                  ? 'bg-green-600 text-white'
                  : migrationStatus === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-[#B89B7A] text-white hover:bg-[#A38A69]'
            }`}
          >
            {migrationStatus === 'migrating' && '⏳ Migrando...'}
            {migrationStatus === 'success' && '✅ Migrado'}
            {migrationStatus === 'error' && '❌ Erro'}
            {migrationStatus === 'idle' && '🚀 Iniciar Migração'}
          </button>

          {migrationStatus === 'success' && (
            <p style={{ color: '#6B4F43' }}>
              ✅ Migração concluída! Modo banco ativado automaticamente.
            </p>
          )}

          {migrationStatus === 'error' && (
            <p className="text-xs text-red-700 mt-2">
              ❌ Erro na migração. Verifique a conexão com o banco.
            </p>
          )}
        </div>
      )}

      {/* Statistics */}
      <div className="space-y-4">
        <h4 style={{ color: '#432818' }}>Estatísticas</h4>

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B89B7A] mx-auto"></div>
            <p style={{ color: '#8B7355' }}>Carregando...</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-4">
            {/* Total Components */}
            <div style={{ backgroundColor: '#FAF9F7' }}>
              <div style={{ color: '#432818' }}>{stats.totalComponents || 0}</div>
              <div style={{ color: '#8B7355' }}>Componentes</div>
            </div>

            {/* Total Steps */}
            <div style={{ backgroundColor: '#FAF9F7' }}>
              <div style={{ color: '#432818' }}>{stats.totalSteps || 0}</div>
              <div style={{ color: '#8B7355' }}>Etapas</div>
            </div>

            {/* Components by Type */}
            {stats.componentsByType && Object.keys(stats.componentsByType).length > 0 && (
              <div className="col-span-2">
                <h5 style={{ color: '#6B4F43' }}>Por Tipo:</h5>
                <div className="space-y-1">
                  {Object.entries(stats.componentsByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-xs">
                      <span style={{ color: '#6B4F43' }}>{type}</span>
                      <span className="font-medium">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mode Info */}
            <div style={{ backgroundColor: '#FAF9F7' }}>
              <div style={{ color: '#6B4F43' }}>
                <strong>Modo:</strong> {stats.mode || 'local'}
              </div>
              {stats.error && (
                <div style={{ color: '#432818' }}>
                  <strong>Erro:</strong> {stats.error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ color: '#8B7355' }}>Nenhuma estatística disponível</div>
        )}

        {/* Refresh Button */}
        <button onClick={loadStats} disabled={loading} style={{ borderColor: '#E5DDD5' }}>
          {loading ? '⏳ Carregando...' : '🔄 Atualizar Estatísticas'}
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ borderColor: '#E5DDD5' }}>
        <h4 style={{ color: '#432818' }}>Ações Rápidas</h4>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => window.open('/editor', '_blank')}
            className="px-3 py-2 text-xs bg-[#B89B7A]/20 text-[#A38A69] rounded-md hover:bg-[#B89B7A]/30"
          >
            🎨 Abrir Editor
          </button>

          <button
            onClick={() => console.log('Debug:', { databaseMode, stats })}
            style={{ color: '#6B4F43' }}
          >
            🐛 Debug Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseControlPanel;
