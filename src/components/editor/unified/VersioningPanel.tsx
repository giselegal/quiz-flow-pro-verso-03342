/**
 * 🎯 VERSIONING PANEL - INTERFACE DE VERSIONAMENTO
 * 
 * Componente de interface para gerenciar versionamento e histórico
 * no editor unificado, integrando com VersioningService e HistoryManager.
 * 
 * FUNCIONALIDADES:
 * ✅ Lista de snapshots com filtros
 * ✅ Timeline de histórico
 * ✅ Comparação entre versões
 * ✅ Restore de versões
 * ✅ Estatísticas de versionamento
 * ✅ Interface responsiva
 */

import React, { useState, useMemo } from 'react';
import { useUnifiedVersioning } from '@/hooks/core/useUnifiedVersioning';
import { UnifiedFunnel } from '@/services/UnifiedCRUDService';
import { VersionSnapshot, VersionComparison } from '@/services/VersioningService';
import { HistoryEntry } from '@/services/HistoryManager';

// =============================================================================
// TIPOS E INTERFACES
// =============================================================================

interface VersioningPanelProps {
  funnel: UnifiedFunnel | null;
  onRestore?: (funnel: UnifiedFunnel) => void;
  onSnapshotCreated?: (snapshot: VersionSnapshot) => void;
  className?: string;
}

interface SnapshotItemProps {
  snapshot: VersionSnapshot;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRestore: () => void;
}

interface HistoryItemProps {
  entry: HistoryEntry;
  isSelected: boolean;
  onSelect: () => void;
}

interface ComparisonViewProps {
  comparison: VersionComparison;
  onClose: () => void;
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export const VersioningPanel: React.FC<VersioningPanelProps> = ({
  funnel,
  onRestore,
  onSnapshotCreated,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'snapshots' | 'history' | 'comparison'>('snapshots');
  const [selectedSnapshots, setSelectedSnapshots] = useState<string[]>([]);
  const [comparison, setComparison] = useState<VersionComparison | null>(null);

  const versioning = useUnifiedVersioning(funnel, {
    enableAutoSnapshots: true,
    autoSnapshotInterval: 15,
    maxSnapshots: 50,
    enableHistoryTracking: true,
  });

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleCreateSnapshot = async (type: 'manual' | 'milestone' = 'manual') => {
    try {
      const description = type === 'milestone' 
        ? `Milestone: ${funnel?.name || 'Funnel'}`
        : undefined;
      
      const snapshot = await versioning.createSnapshot(type, description);
      onSnapshotCreated?.(snapshot);
    } catch (error) {
      console.error('Erro ao criar snapshot:', error);
    }
  };

  const handleRestoreSnapshot = async (snapshotId: string) => {
    try {
      const restoredFunnel = await versioning.restoreSnapshot(snapshotId);
      if (restoredFunnel) {
        onRestore?.(restoredFunnel);
      }
    } catch (error) {
      console.error('Erro ao restaurar snapshot:', error);
    }
  };

  const handleDeleteSnapshot = async (snapshotId: string) => {
    try {
      await versioning.deleteSnapshot(snapshotId);
    } catch (error) {
      console.error('Erro ao excluir snapshot:', error);
    }
  };

  const handleCompareSnapshots = () => {
    if (selectedSnapshots.length === 2) {
      const comparison = versioning.compareVersions(selectedSnapshots[0], selectedSnapshots[1]);
      if (comparison) {
        setComparison(comparison);
        setActiveTab('comparison');
      }
    }
  };

  const handleSelectSnapshot = (snapshotId: string) => {
    setSelectedSnapshots(prev => {
      if (prev.includes(snapshotId)) {
        return prev.filter(id => id !== snapshotId);
      } else if (prev.length < 2) {
        return [...prev, snapshotId];
      } else {
        return [prev[1], snapshotId];
      }
    });
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className={`versioning-panel ${className}`}>
      {/* Header */}
      <div className="versioning-header">
        <div className="tabs">
          <button
            className={activeTab === 'snapshots' ? 'active' : ''}
            onClick={() => setActiveTab('snapshots')}
          >
            📸 Snapshots ({versioning.totalSnapshots})
          </button>
          <button
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            📋 Histórico ({versioning.totalHistoryEntries})
          </button>
          {comparison && (
            <button
              className={activeTab === 'comparison' ? 'active' : ''}
              onClick={() => setActiveTab('comparison')}
            >
              🔍 Comparação
            </button>
          )}
        </div>

        <div className="actions">
          <button
            onClick={() => handleCreateSnapshot('manual')}
            disabled={versioning.isCreatingSnapshot}
            className="btn-primary"
          >
            {versioning.isCreatingSnapshot ? '⏳' : '📸'} Criar Snapshot
          </button>
          <button
            onClick={() => handleCreateSnapshot('milestone')}
            disabled={versioning.isCreatingSnapshot}
            className="btn-secondary"
          >
            🏆 Milestone
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="versioning-content">
        {activeTab === 'snapshots' && (
          <SnapshotsView
            snapshots={versioning.snapshots}
            selectedSnapshots={selectedSnapshots}
            onSelectSnapshot={handleSelectSnapshot}
            onRestoreSnapshot={handleRestoreSnapshot}
            onDeleteSnapshot={handleDeleteSnapshot}
            onCompare={handleCompareSnapshots}
            canCompare={selectedSnapshots.length === 2}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={versioning.filteredHistory}
            searchQuery={versioning.searchQuery}
            onSearchChange={versioning.setSearchQuery}
            onFilterChange={versioning.setHistoryFilter}
          />
        )}

        {activeTab === 'comparison' && comparison && (
          <ComparisonView
            comparison={comparison}
            onClose={() => {
              setComparison(null);
              setActiveTab('snapshots');
            }}
          />
        )}
      </div>

      {/* Stats */}
      <div className="versioning-stats">
        <div className="stat">
          <span className="label">Snapshots:</span>
          <span className="value">{versioning.totalSnapshots}</span>
        </div>
        <div className="stat">
          <span className="label">Histórico:</span>
          <span className="value">{versioning.totalHistoryEntries}</span>
        </div>
        <div className="stat">
          <span className="label">Último:</span>
          <span className="value">
            {versioning.lastSnapshotDate?.toLocaleDateString() || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENTES AUXILIARES
// =============================================================================

const SnapshotsView: React.FC<{
  snapshots: VersionSnapshot[];
  selectedSnapshots: string[];
  onSelectSnapshot: (id: string) => void;
  onRestoreSnapshot: (id: string) => void;
  onDeleteSnapshot: (id: string) => void;
  onCompare: () => void;
  canCompare: boolean;
}> = ({
  snapshots,
  selectedSnapshots,
  onSelectSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot,
  onCompare,
  canCompare,
}) => {
  return (
    <div className="snapshots-view">
      <div className="snapshots-header">
        <h3>Snapshots Disponíveis</h3>
        {selectedSnapshots.length === 2 && (
          <button onClick={onCompare} className="btn-compare">
            🔍 Comparar Versões
          </button>
        )}
      </div>

      <div className="snapshots-list">
        {snapshots.map(snapshot => (
          <SnapshotItem
            key={snapshot.id}
            snapshot={snapshot}
            isSelected={selectedSnapshots.includes(snapshot.id)}
            onSelect={() => onSelectSnapshot(snapshot.id)}
            onDelete={() => onDeleteSnapshot(snapshot.id)}
            onRestore={() => onRestoreSnapshot(snapshot.id)}
          />
        ))}
      </div>
    </div>
  );
};

const SnapshotItem: React.FC<SnapshotItemProps> = ({
  snapshot,
  isSelected,
  onSelect,
  onDelete,
  onRestore,
}) => {
  return (
    <div className={`snapshot-item ${isSelected ? 'selected' : ''}`}>
      <div className="snapshot-header" onClick={onSelect}>
        <div className="snapshot-info">
          <div className="snapshot-version">{snapshot.version}</div>
          <div className="snapshot-type">
            {snapshot.type === 'auto' && '🤖 Auto'}
            {snapshot.type === 'manual' && '👤 Manual'}
            {snapshot.type === 'milestone' && '🏆 Milestone'}
          </div>
        </div>
        <div className="snapshot-timestamp">
          {snapshot.timestamp.toLocaleString()}
        </div>
      </div>

      <div className="snapshot-description">
        {snapshot.description}
      </div>

      <div className="snapshot-metrics">
        <span>📊 {snapshot.metadata.stagesCount} etapas</span>
        <span>🧩 {snapshot.metadata.blocksCount} blocos</span>
        <span>📝 {snapshot.metadata.changesCount} mudanças</span>
      </div>

      <div className="snapshot-actions">
        <button onClick={onRestore} className="btn-restore">
          🔙 Restaurar
        </button>
        <button onClick={onDelete} className="btn-delete">
          🗑️ Excluir
        </button>
      </div>
    </div>
  );
};

const HistoryView: React.FC<{
  history: HistoryEntry[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: any) => void;
}> = ({ history, searchQuery, onSearchChange, onFilterChange }) => {
  return (
    <div className="history-view">
      <div className="history-header">
        <h3>Histórico de Mudanças</h3>
        <div className="history-controls">
          <input
            type="text"
            placeholder="Buscar no histórico..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="history-list">
        {history.map(entry => (
          <HistoryItem
            key={entry.id}
            entry={entry}
            isSelected={false}
            onSelect={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

const HistoryItem: React.FC<HistoryItemProps> = ({ entry, isSelected, onSelect }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'restore': return '🔙';
      case 'snapshot': return '📸';
      case 'milestone': return '🏆';
      default: return '📝';
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'funnel': return '🎯';
      case 'stage': return '📋';
      case 'block': return '🧩';
      case 'system': return '⚙️';
      default: return '📄';
    }
  };

  return (
    <div className={`history-item ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="history-header">
        <div className="history-type">
          {getTypeIcon(entry.type)} {entry.type}
        </div>
        <div className="history-entity">
          {getEntityIcon(entry.entity)} {entry.entity}
        </div>
        <div className="history-timestamp">
          {entry.timestamp.toLocaleString()}
        </div>
      </div>

      <div className="history-description">
        {entry.description}
      </div>

      {entry.changes.length > 0 && (
        <div className="history-changes">
          <span className="changes-count">
            {entry.changes.length} mudança{entry.changes.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="history-metadata">
        <span className={`importance importance-${entry.metadata.importance}`}>
          {entry.metadata.importance}
        </span>
        {entry.metadata.tags.map(tag => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const ComparisonView: React.FC<ComparisonViewProps> = ({ comparison, onClose }) => {
  return (
    <div className="comparison-view">
      <div className="comparison-header">
        <h3>Comparação de Versões</h3>
        <button onClick={onClose} className="btn-close">
          ✕
        </button>
      </div>

      <div className="comparison-info">
        <div className="version-a">
          <h4>Versão A: {comparison.versionA.version}</h4>
          <p>{comparison.versionA.timestamp.toLocaleString()}</p>
        </div>
        <div className="version-b">
          <h4>Versão B: {comparison.versionB.version}</h4>
          <p>{comparison.versionB.timestamp.toLocaleString()}</p>
        </div>
      </div>

      <div className="comparison-summary">
        <div className="summary-stat">
          <span className="label">Adicionados:</span>
          <span className="value added">{comparison.summary.added}</span>
        </div>
        <div className="summary-stat">
          <span className="label">Modificados:</span>
          <span className="value modified">{comparison.summary.modified}</span>
        </div>
        <div className="summary-stat">
          <span className="label">Excluídos:</span>
          <span className="value deleted">{comparison.summary.deleted}</span>
        </div>
        <div className="summary-stat">
          <span className="label">Movidos:</span>
          <span className="value moved">{comparison.summary.moved}</span>
        </div>
      </div>

      <div className="comparison-changes">
        <h4>Mudanças Detalhadas</h4>
        <div className="changes-list">
          {comparison.changes.map(change => (
            <div key={change.id} className="change-item">
              <div className="change-type">{change.type}</div>
              <div className="change-entity">{change.entity}</div>
              <div className="change-description">{change.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VersioningPanel;
