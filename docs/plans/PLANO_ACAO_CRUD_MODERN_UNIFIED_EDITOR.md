# 🎯 PLANO DE AÇÃO DETALHADO: ESTRUTURA CRUD COMPLETA NO MODERN UNIFIED EDITOR

## 📋 RESUMO EXECUTIVO

Este plano implementa a estrutura CRUD completa no **ModernUnifiedEditor**, consolidando todas as funcionalidades identificadas na arquitetura em um editor unificado e moderno.

**Editor Escolhido:** `ModernUnifiedEditor` (/editor)  
**Justificativa:** Melhor balance funcionalidade/performance, IA integrada, interface moderna e arquitetura consolidada.

---

## 🎯 FASE 1: PREPARAÇÃO DA BASE ARQUITETURAL (Semana 1)

### 1.1 Auditoria e Limpeza da Estrutura Atual

#### **Ação 1.1.1: Mapeamento de Conflitos**
```bash
# 📝 TAREFAS
- Auditar conflitos entre editores existentes
- Identificar dependências cruzadas no ModernUnifiedEditor
- Mapear componentes duplicados ou conflitantes
- Criar inventário de hooks e providers ativos

# 📁 ARQUIVOS A REVISAR
src/pages/editor/ModernUnifiedEditor.tsx
src/components/editor/EditorProUnified.tsx
src/context/UnifiedFunnelContext.tsx
src/hooks/core/useUnifiedEditor.ts
```

#### **Ação 1.1.2: Consolidação de Providers**
```typescript
// 🎯 OBJETIVO: Provider único para CRUD no ModernUnifiedEditor
interface UnifiedCRUDProvider {
  // Estados CRUD centralizados
  funnelState: FunnelState;
  crudOperations: CRUDOperations;
  
  // Actions unificadas
  createFunnel: (data: CreateFunnelData) => Promise<FunnelState>;
  loadFunnel: (id: string) => Promise<FunnelState>;
  updateFunnel: (id: string, updates: UpdateFunnelData) => Promise<FunnelState>;
  deleteFunnel: (id: string, soft?: boolean) => Promise<boolean>;
  
  // Estados de UI
  isLoading: boolean;
  error: Error | null;
  lastSaved: Date | null;
}
```

#### **Ação 1.1.3: Integração de Serviços CRUD**
```typescript
// 🏗️ CRIAR: src/services/UnifiedCRUDService.ts
export class UnifiedCRUDService {
  // Consolidação de todos os serviços identificados
  private funnelUnifiedService = FunnelUnifiedService;
  private persistenceService = PersistenceService.getInstance();
  private publishingService = PublishingService.getInstance();
  private calculationEngine = UnifiedCalculationEngine;
  
  // Interface única para todas as operações CRUD
  async create(data: CreateFunnelInput): Promise<FunnelOutput>;
  async read(id: string, options?: ReadOptions): Promise<FunnelOutput | null>;
  async update(id: string, updates: UpdateFunnelInput): Promise<FunnelOutput>;
  async delete(id: string, options?: DeleteOptions): Promise<boolean>;
  
  // Operações avançadas
  async duplicate(id: string, newName?: string): Promise<FunnelOutput>;
  async publish(id: string, options?: PublishOptions): Promise<PublishResult>;
  async validate(data: FunnelData): Promise<ValidationResult>;
}
```

### 1.2 Modernização da Interface ModernUnifiedEditor

#### **Ação 1.2.1: Upgrade da Toolbar Neural**
```tsx
// 🎨 MELHORIAS NA TOOLBAR
interface EnhancedToolbarState {
  // Estados CRUD visíveis
  currentOperation: 'create' | 'read' | 'update' | 'delete' | 'idle';
  saveStatus: 'saved' | 'saving' | 'error' | 'draft';
  
  // Indicadores visuais
  hasUnsavedChanges: boolean;
  lastAutoSave: Date | null;
  
  // Actions CRUD
  onQuickSave: () => void;
  onPublish: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

// Adicionar botões CRUD na toolbar
<div className="toolbar-crud-actions">
  <Button variant="outline" onClick={onQuickSave}>
    <Save className="w-4 h-4" />
    {saveStatus === 'saving' ? 'Salvando...' : 'Salvar'}
  </Button>
  <Button variant="secondary" onClick={onDuplicate}>
    <Copy className="w-4 h-4" />
    Duplicar
  </Button>
  <Button variant="destructive" onClick={onDelete}>
    <Trash2 className="w-4 h-4" />
    Excluir
  </Button>
</div>
```

#### **Ação 1.2.2: Status Bar com Indicadores CRUD**
```tsx
// 📊 STATUS BAR APRIMORADO
<div className="status-bar-crud">
  <div className="crud-indicators">
    <Badge variant={saveStatus === 'saved' ? 'success' : 'secondary'}>
      {saveStatus === 'saved' && <CheckCircle className="w-3 h-3" />}
      {saveStatus === 'saving' && <Loader className="w-3 h-3 animate-spin" />}
      {saveStatus === 'error' && <AlertCircle className="w-3 h-3" />}
      {formatSaveStatus(saveStatus)}
    </Badge>
    
    <span className="text-xs text-muted-foreground">
      Última modificação: {formatLastModified(lastSaved)}
    </span>
    
    <Badge variant="outline" className="text-xs">
      Funnel ID: {funnelId}
    </Badge>
  </div>
</div>
```

---

## 🔨 FASE 2: IMPLEMENTAÇÃO DO CRUD CORE (Semanas 2-3)

### 2.1 Sistema de Criação (CREATE)

#### **Ação 2.1.1: Modal de Criação Avançado**
```tsx
// 🆕 CRIAR: src/components/editor/modals/CreateFunnelModal.tsx
export const CreateFunnelModal: React.FC = () => {
  return (
    <Dialog>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>🚀 Criar Novo Funil</DialogTitle>
        </DialogHeader>
        
        <div className="create-funnel-options">
          {/* Template Selection */}
          <div className="template-grid">
            <TemplateCard
              id="quiz-21-steps"
              name="Quiz 21 Etapas Completo"
              description="Template completo com cálculo de pontuação"
              features={['Cálculo Automático', 'Design Responsivo', '8 Estilos']}
            />
            <TemplateCard
              id="simple-form"
              name="Formulário Simples"
              description="Funil básico para captura de leads"
            />
            <TemplateCard
              id="blank"
              name="Começar do Zero"
              description="Canvas em branco para criação livre"
            />
          </div>
          
          {/* Configuration Form */}
          <div className="funnel-config-form">
            <Input placeholder="Nome do Funil" />
            <Textarea placeholder="Descrição (opcional)" />
            <Select placeholder="Categoria">
              <SelectItem value="quiz">Quiz Interativo</SelectItem>
              <SelectItem value="form">Formulário</SelectItem>
              <SelectItem value="survey">Pesquisa</SelectItem>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleCreateFunnel}>
            Criar Funil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

#### **Ação 2.1.2: Integração com Template System**
```typescript
// 🔧 IMPLEMENTAR: Hook de criação com templates
const useCreateFunnel = () => {
  const crudService = useUnifiedCRUDService();
  
  const createFromTemplate = async (
    templateId: string,
    config: FunnelConfig
  ): Promise<FunnelState> => {
    const templateData = await templateService.getTemplate(templateId);
    const funnelData = await crudService.create({
      ...config,
      template: templateData,
      steps: templateData.steps, // quiz21StepsComplete se aplicável
      calculationEngine: templateData.calculationEngine
    });
    
    return funnelData;
  };
  
  const createFromScratch = async (config: FunnelConfig): Promise<FunnelState> => {
    return crudService.create({
      ...config,
      steps: [{ id: '1', type: 'intro', name: 'Introdução' }]
    });
  };
  
  return { createFromTemplate, createFromScratch };
};
```

### 2.2 Sistema de Leitura (READ)

#### **Ação 2.2.1: Carregamento Otimizado**
```tsx
// 🔍 IMPLEMENTAR: Sistema de loading inteligente
const useFunnelLoader = (funnelId?: string) => {
  const [funnelState, setFunnelState] = useState<FunnelState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const crudService = useUnifiedCRUDService();
  
  const loadFunnel = useCallback(async (id: string, force = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Tentar cache primeiro
      if (!force) {
        const cached = await crudService.getFromCache(id);
        if (cached && crudService.isCacheValid(cached)) {
          setFunnelState(cached);
          setLoading(false);
          return cached;
        }
      }
      
      // Carregar do banco
      const funnel = await crudService.read(id);
      
      if (!funnel) {
        throw new Error('Funil não encontrado');
      }
      
      setFunnelState(funnel);
      return funnel;
      
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [crudService]);
  
  // Auto-load se funnelId fornecido
  useEffect(() => {
    if (funnelId) {
      loadFunnel(funnelId);
    }
  }, [funnelId, loadFunnel]);
  
  return { funnelState, loading, error, loadFunnel, reloadFunnel: () => loadFunnel(funnelId!, true) };
};
```

#### **Ação 2.2.2: Painel de Funis Recentes**
```tsx
// 📂 CRIAR: src/components/editor/panels/RecentFunnelsPanel.tsx
export const RecentFunnelsPanel: React.FC = () => {
  const { funnels, loading } = useRecentFunnels();
  
  return (
    <div className="recent-funnels-panel">
      <h3>Funis Recentes</h3>
      
      {loading ? (
        <FunnelsSkeleton />
      ) : (
        <div className="funnels-grid">
          {funnels.map(funnel => (
            <FunnelCard
              key={funnel.id}
              funnel={funnel}
              onOpen={() => router.push(`/editor/${funnel.id}`)}
              onDuplicate={() => handleDuplicate(funnel.id)}
              onDelete={() => handleDelete(funnel.id)}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

### 2.3 Sistema de Atualização (UPDATE)

#### **Ação 2.3.1: Auto-Save Inteligente**
```typescript
// 💾 IMPLEMENTAR: Auto-save robusto
const useAutoSave = (funnelId: string, funnelState: FunnelState) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const crudService = useUnifiedCRUDService();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  
  const saveChanges = useCallback(async () => {
    if (!funnelId || saveStatus === 'saving') return;
    
    setSaveStatus('saving');
    
    try {
      await crudService.update(funnelId, funnelState);
      setSaveStatus('saved');
      setLastSaved(new Date());
    } catch (error) {
      setSaveStatus('error');
      console.error('Erro ao salvar:', error);
    }
  }, [funnelId, funnelState, crudService, saveStatus]);
  
  // Auto-save com debounce
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    setSaveStatus('draft');
    
    saveTimeoutRef.current = setTimeout(() => {
      saveChanges();
    }, 2000); // 2s de delay
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [funnelState, saveChanges]);
  
  return { 
    saveStatus, 
    lastSaved, 
    forceSave: saveChanges,
    hasUnsavedChanges: saveStatus === 'draft'
  };
};
```

#### **Ação 2.3.2: Sistema de Histórico (Undo/Redo)**
```typescript
// ↶ IMPLEMENTAR: Controle de histórico
const useUndoRedo = (initialState: FunnelState) => {
  const [history, setHistory] = useState<FunnelState[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const addToHistory = useCallback((newState: FunnelState) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newState);
      
      // Limitar histórico a 50 estados
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, 49));
  }, [currentIndex]);
  
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);
  
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);
  
  return {
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    undo,
    redo,
    addToHistory,
    currentState: history[currentIndex]
  };
};
```

### 2.4 Sistema de Exclusão (DELETE)

#### **Ação 2.4.1: Modal de Confirmação Inteligente**
```tsx
// 🗑️ CRIAR: src/components/editor/modals/DeleteFunnelModal.tsx
export const DeleteFunnelModal: React.FC<DeleteFunnelModalProps> = ({
  funnel,
  onConfirm,
  onCancel
}) => {
  const [deleteType, setDeleteType] = useState<'soft' | 'hard'>('soft');
  const [confirmText, setConfirmText] = useState('');
  
  const isConfirmed = confirmText === funnel.name;
  
  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            ⚠️ Excluir Funil
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. O funil "{funnel.name}" será removido permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="delete-options">
          <RadioGroup value={deleteType} onValueChange={setDeleteType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="soft" id="soft" />
              <Label htmlFor="soft">
                Mover para lixeira (pode ser restaurado em 30 dias)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard" className="text-red-600">
                Excluir permanentemente (sem possibilidade de restauração)
              </Label>
            </div>
          </RadioGroup>
          
          {deleteType === 'hard' && (
            <div className="confirmation-input">
              <Label>Digite o nome do funil para confirmar:</Label>
              <Input 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={funnel.name}
              />
            </div>
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => onConfirm(deleteType)}
            disabled={deleteType === 'hard' && !isConfirmed}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteType === 'soft' ? 'Mover para Lixeira' : 'Excluir Permanentemente'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
```

#### **Ação 2.4.2: Sistema de Lixeira**
```typescript
// 🗂️ IMPLEMENTAR: Gerenciamento de lixeira
const useTrashSystem = () => {
  const crudService = useUnifiedCRUDService();
  
  const moveToTrash = async (funnelId: string): Promise<boolean> => {
    return crudService.delete(funnelId, { soft: true });
  };
  
  const permanentDelete = async (funnelId: string): Promise<boolean> => {
    return crudService.delete(funnelId, { soft: false });
  };
  
  const restoreFromTrash = async (funnelId: string): Promise<FunnelState> => {
    return crudService.restore(funnelId);
  };
  
  const getTrashItems = async (): Promise<TrashItem[]> => {
    return crudService.getTrash();
  };
  
  const emptyTrash = async (): Promise<boolean> => {
    return crudService.emptyTrash();
  };
  
  return {
    moveToTrash,
    permanentDelete,
    restoreFromTrash,
    getTrashItems,
    emptyTrash
  };
};
```

---

## 🎨 FASE 3: INTEGRAÇÃO COM PAINÉIS DE PROPRIEDADES (Semana 4)

### 3.1 Painel de Propriedades CRUD-Aware

#### **Ação 3.1.1: Properties Panel Integrado**
```tsx
// 🎛️ APRIMORAR: src/components/editor/properties/CRUDAwarePropertiesPanel.tsx
export const CRUDAwarePropertiesPanel: React.FC = ({
  selectedBlock,
  onUpdate,
  onDelete,
  funnelState,
  crudOperations
}) => {
  return (
    <div className="crud-aware-properties-panel">
      {/* Header com ações CRUD */}
      <div className="properties-header">
        <div className="block-info">
          <h3>{selectedBlock?.type || 'Nenhum bloco selecionado'}</h3>
          <Badge variant="outline">{selectedBlock?.id}</Badge>
        </div>
        
        <div className="block-actions">
          <Button variant="outline" size="sm" onClick={() => handleDuplicate(selectedBlock)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteBlock(selectedBlock)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Properties Editor */}
      {selectedBlock && (
        <div className="properties-editor">
          <PropertyEditorRegistry 
            block={selectedBlock}
            onUpdate={(updates) => {
              // Atualizar bloco localmente
              onUpdate(selectedBlock.id, updates);
              
              // Trigger auto-save do funil
              crudOperations.scheduleAutoSave();
            }}
            onValidate={(isValid) => {
              crudOperations.updateValidationStatus(selectedBlock.id, isValid);
            }}
          />
        </div>
      )}
      
      {/* Save Status */}
      <div className="properties-footer">
        <SaveStatusIndicator 
          status={crudOperations.saveStatus}
          lastSaved={crudOperations.lastSaved}
        />
      </div>
    </div>
  );
};
```

#### **Ação 3.1.2: Live Validation com CRUD**
```typescript
// ✅ IMPLEMENTAR: Validação em tempo real
const useBlockValidation = (block: Block, crudOperations: CRUDOperations) => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: true,
    errors: [],
    warnings: []
  });
  
  const validateBlock = useCallback(async (blockData: Block) => {
    const validation = await crudOperations.validateBlock(blockData);
    setValidationState(validation);
    
    // Se válido, permitir auto-save
    if (validation.isValid) {
      crudOperations.scheduleAutoSave();
    }
    
    return validation;
  }, [crudOperations]);
  
  // Validar sempre que o bloco mudar
  useEffect(() => {
    if (block) {
      validateBlock(block);
    }
  }, [block, validateBlock]);
  
  return {
    ...validationState,
    revalidate: () => validateBlock(block)
  };
};
```

---

## 🚀 FASE 4: FUNCIONALIDADES AVANÇADAS (Semana 5)

### 4.1 Sistema de Versionamento

#### **Ação 4.1.1: Version Control**
```typescript
// 📦 IMPLEMENTAR: Controle de versões
interface FunnelVersion {
  id: string;
  funnelId: string;
  version: string;
  name: string;
  description?: string;
  createdAt: Date;
  createdBy: string;
  data: FunnelState;
  tags: string[];
}

const useVersionControl = (funnelId: string) => {
  const [versions, setVersions] = useState<FunnelVersion[]>([]);
  const crudService = useUnifiedCRUDService();
  
  const createVersion = async (name: string, description?: string): Promise<FunnelVersion> => {
    const currentState = await crudService.read(funnelId);
    if (!currentState) throw new Error('Funil não encontrado');
    
    const version: FunnelVersion = {
      id: generateId(),
      funnelId,
      version: generateVersionNumber(versions),
      name,
      description,
      createdAt: new Date(),
      createdBy: getCurrentUserId(),
      data: currentState,
      tags: []
    };
    
    await crudService.saveVersion(version);
    setVersions(prev => [version, ...prev]);
    
    return version;
  };
  
  const restoreVersion = async (versionId: string): Promise<FunnelState> => {
    const version = versions.find(v => v.id === versionId);
    if (!version) throw new Error('Versão não encontrada');
    
    const restoredState = await crudService.update(funnelId, version.data);
    return restoredState;
  };
  
  return {
    versions,
    createVersion,
    restoreVersion,
    loadVersions: () => crudService.getVersions(funnelId)
  };
};
```

### 4.2 Colaboração em Tempo Real

#### **Ação 4.2.1: Real-time Sync**
```typescript
// 🔄 IMPLEMENTAR: Colaboração real-time
const useRealtimeCollaboration = (funnelId: string) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  
  const crudService = useUnifiedCRUDService();
  
  useEffect(() => {
    // Conectar ao WebSocket ou Supabase Realtime
    const subscription = crudService.subscribeToChanges(funnelId, {
      onUpdate: (changes) => {
        // Aplicar mudanças remotas
        handleRemoteChanges(changes);
      },
      onUserJoin: (user) => {
        setCollaborators(prev => [...prev, user]);
      },
      onUserLeave: (userId) => {
        setCollaborators(prev => prev.filter(c => c.id !== userId));
      },
      onConflict: (conflict) => {
        setConflicts(prev => [...prev, conflict]);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [funnelId, crudService]);
  
  const handleRemoteChanges = (changes: RemoteChange[]) => {
    // Implementar merge de mudanças
    // Detectar e resolver conflitos
    // Atualizar UI com indicadores visuais
  };
  
  return {
    collaborators,
    conflicts,
    resolveConflict: (conflictId: string, resolution: ConflictResolution) => {
      // Resolver conflito
    }
  };
};
```

---

## ⚡ FASE 5: PERFORMANCE E OTIMIZAÇÃO (Semana 6)

### 5.1 Otimizações de Performance

#### **Ação 5.1.1: Lazy Loading Avançado**
```typescript
// 🔄 IMPLEMENTAR: Carregamento sob demanda
const useLazyComponents = () => {
  // Lazy load de editores de propriedades pesados
  const QuestionPropertyEditor = lazy(() => import('./editors/QuestionPropertyEditor'));
  const HeaderPropertyEditor = lazy(() => import('./editors/HeaderPropertyEditor'));
  const AdvancedCalculationEditor = lazy(() => import('./editors/AdvancedCalculationEditor'));
  
  // Cache de componentes carregados
  const componentCache = useMemo(() => new Map(), []);
  
  const getPropertyEditor = (blockType: string) => {
    if (componentCache.has(blockType)) {
      return componentCache.get(blockType);
    }
    
    const editor = getEditorForType(blockType);
    componentCache.set(blockType, editor);
    
    return editor;
  };
  
  return { getPropertyEditor };
};
```

#### **Ação 5.1.2: Caching Inteligente**
```typescript
// 💾 IMPLEMENTAR: Sistema de cache híbrido
class HybridCacheSystem {
  private memoryCache = new Map<string, CacheItem>();
  private indexedDBCache: IDBDatabase;
  
  // Cache em memória para dados frequentemente acessados
  setMemoryCache(key: string, data: any, ttl = 300000): void {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  // Cache persistente para dados maiores
  async setIndexedDBCache(key: string, data: any): Promise<void> {
    // Implementar storage no IndexedDB
  }
  
  // Estratégia de cache inteligente
  async get(key: string): Promise<any> {
    // 1. Tentar cache em memória primeiro
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && !this.isExpired(memoryItem)) {
      return memoryItem.data;
    }
    
    // 2. Tentar IndexedDB
    const indexedDBItem = await this.getFromIndexedDB(key);
    if (indexedDBItem) {
      // Promover para cache em memória
      this.setMemoryCache(key, indexedDBItem);
      return indexedDBItem;
    }
    
    return null;
  }
}
```

---

## 📊 FASE 6: MONITORAMENTO E ANALYTICS (Semana 7)

### 6.1 Dashboard de Performance

#### **Ação 6.1.1: Métricas CRUD**
```tsx
// 📈 CRIAR: src/components/editor/analytics/CRUDAnalyticsDashboard.tsx
export const CRUDAnalyticsDashboard: React.FC = () => {
  const { metrics } = useCRUDMetrics();
  
  return (
    <div className="crud-analytics-dashboard">
      <div className="metrics-grid">
        <MetricCard
          title="Operações por Minuto"
          value={metrics.operationsPerMinute}
          trend={metrics.operationsTrend}
        />
        <MetricCard
          title="Tempo Médio de Save"
          value={`${metrics.avgSaveTime}ms`}
          trend={metrics.saveTimeTrend}
        />
        <MetricCard
          title="Cache Hit Rate"
          value={`${metrics.cacheHitRate}%`}
          trend={metrics.cacheHitTrend}
        />
        <MetricCard
          title="Erros por Hora"
          value={metrics.errorsPerHour}
          trend={metrics.errorsTrend}
        />
      </div>
      
      <div className="detailed-charts">
        <CRUDOperationsChart data={metrics.operationHistory} />
        <PerformanceChart data={metrics.performanceHistory} />
        <ErrorLogChart data={metrics.errorHistory} />
      </div>
    </div>
  );
};
```

#### **Ação 6.1.2: Monitoramento em Tempo Real**
```typescript
// 📊 IMPLEMENTAR: Sistema de monitoramento
const useCRUDMonitoring = () => {
  const [metrics, setMetrics] = useState<CRUDMetrics>();
  
  useEffect(() => {
    // Coletar métricas de performance
    const performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name.includes('crud-operation')) {
          trackCRUDOperation(entry);
        }
      });
    });
    
    performanceObserver.observe({ entryTypes: ['measure'] });
    
    // Monitorar erros
    window.addEventListener('error', trackError);
    window.addEventListener('unhandledrejection', trackPromiseRejection);
    
    return () => {
      performanceObserver.disconnect();
      window.removeEventListener('error', trackError);
      window.removeEventListener('unhandledrejection', trackPromiseRejection);
    };
  }, []);
  
  const trackCRUDOperation = (entry: PerformanceEntry) => {
    // Rastrear operações CRUD
    analytics.track('crud_operation', {
      operation: extractOperationType(entry.name),
      duration: entry.duration,
      timestamp: Date.now()
    });
  };
  
  return { metrics };
};
```

---

## 🧪 FASE 7: TESTES E VALIDAÇÃO (Semana 8)

### 7.1 Testes Automatizados

#### **Ação 7.1.1: Testes CRUD End-to-End**
```typescript
// 🧪 CRIAR: tests/crud/crud-operations.test.ts
describe('CRUD Operations in ModernUnifiedEditor', () => {
  let editor: ModernUnifiedEditor;
  
  beforeEach(async () => {
    editor = await createTestEditor();
  });
  
  test('Should create funnel from template', async () => {
    const createModal = await editor.openCreateModal();
    await createModal.selectTemplate('quiz-21-steps');
    await createModal.fillForm({
      name: 'Test Quiz',
      description: 'Test description'
    });
    
    const funnel = await createModal.submit();
    
    expect(funnel).toBeDefined();
    expect(funnel.name).toBe('Test Quiz');
    expect(funnel.steps).toHaveLength(21);
  });
  
  test('Should auto-save changes', async () => {
    const funnel = await editor.loadFunnel('test-funnel-id');
    
    // Modificar bloco
    const block = await editor.selectBlock('header-1');
    await block.updateProperty('title', 'New Title');
    
    // Aguardar auto-save
    await waitFor(() => {
      expect(editor.getSaveStatus()).toBe('saved');
    });
    
    // Verificar se foi salvo
    const reloadedFunnel = await editor.reloadFunnel();
    const reloadedBlock = reloadedFunnel.getBlock('header-1');
    expect(reloadedBlock.properties.title).toBe('New Title');
  });
  
  test('Should handle soft delete and restore', async () => {
    const funnel = await editor.loadFunnel('test-funnel-id');
    
    // Soft delete
    await editor.deleteFunnel({ soft: true });
    
    // Verificar se está na lixeira
    const trashItems = await editor.getTrashItems();
    expect(trashItems).toContainEqual(
      expect.objectContaining({ id: 'test-funnel-id' })
    );
    
    // Restaurar
    await editor.restoreFromTrash('test-funnel-id');
    
    // Verificar se foi restaurado
    const restoredFunnel = await editor.loadFunnel('test-funnel-id');
    expect(restoredFunnel).toBeDefined();
  });
});
```

#### **Ação 7.1.2: Testes de Performance**
```typescript
// ⚡ CRIAR: tests/performance/crud-performance.test.ts
describe('CRUD Performance Tests', () => {
  test('Should load large funnel under 2 seconds', async () => {
    const startTime = performance.now();
    
    const largeFunnel = await createLargeFunnel(1000); // 1000 blocos
    await editor.loadFunnel(largeFunnel.id);
    
    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });
  
  test('Should handle concurrent operations', async () => {
    const promises = Array.from({ length: 10 }, (_, i) => 
      editor.updateBlock(`block-${i}`, { title: `Title ${i}` })
    );
    
    await expect(Promise.all(promises)).resolves.toBeDefined();
    
    // Verificar se todas as mudanças foram aplicadas
    for (let i = 0; i < 10; i++) {
      const block = editor.getBlock(`block-${i}`);
      expect(block.properties.title).toBe(`Title ${i}`);
    }
  });
  
  test('Should maintain cache efficiency', async () => {
    // Carregar mesmo funil múltiplas vezes
    const funnelId = 'cache-test-funnel';
    
    await editor.loadFunnel(funnelId);
    const secondLoad = await measureTime(() => editor.loadFunnel(funnelId));
    const thirdLoad = await measureTime(() => editor.loadFunnel(funnelId));
    
    // Segunda e terceira carregadas devem ser mais rápidas (cache)
    expect(secondLoad).toBeLessThan(100);
    expect(thirdLoad).toBeLessThan(100);
  });
});
```

---

## 📋 CHECKLIST DE ENTREGA

### ✅ ENTREGÁVEIS TÉCNICOS

#### **Semana 1**
- [ ] Auditoria completa de conflitos
- [ ] UnifiedCRUDProvider implementado
- [ ] UnifiedCRUDService criado
- [ ] Toolbar Neural atualizada
- [ ] Status Bar com indicadores CRUD

#### **Semana 2-3**
- [ ] CreateFunnelModal implementado
- [ ] Sistema de templates integrado
- [ ] Carregamento otimizado funcionando
- [ ] Auto-save inteligente ativo
- [ ] Sistema de histórico (undo/redo)
- [ ] DeleteFunnelModal com soft/hard delete
- [ ] Sistema de lixeira funcional

#### **Semana 4**
- [ ] CRUDAwarePropertiesPanel implementado
- [ ] Live validation funcionando
- [ ] Integração com Property Editors existentes
- [ ] Performance otimizada dos painéis

#### **Semana 5**
- [ ] Sistema de versionamento
- [ ] Colaboração em tempo real (básico)
- [ ] Controle de conflitos

#### **Semana 6**
- [ ] Lazy loading avançado
- [ ] Sistema de cache híbrido
- [ ] Otimizações de performance implementadas

#### **Semana 7**
- [ ] Dashboard de analytics CRUD
- [ ] Monitoramento em tempo real
- [ ] Métricas de performance coletadas

#### **Semana 8**
- [ ] Testes automatizados completos
- [ ] Testes de performance validados
- [ ] Documentação técnica atualizada
- [ ] Guia de uso para desenvolvedores

### 📊 MÉTRICAS DE SUCESSO

#### **Performance**
- [ ] Tempo de carregamento < 2s para funis grandes
- [ ] Auto-save em < 500ms
- [ ] Cache hit rate > 80%
- [ ] Memory usage < 100MB para editor completo

#### **Funcionalidade**
- [ ] 100% das operações CRUD funcionando
- [ ] 0 bugs críticos em produção
- [ ] Compatibilidade com todos os Property Editors existentes
- [ ] Suporte a colaboração básica

#### **UX**
- [ ] Interface intuitiva para todas as operações
- [ ] Feedback visual imediato para todas as ações
- [ ] Sistema de confirmação para operações destrutivas
- [ ] Recuperação automática em caso de erros

---

## 🚀 CONCLUSÃO

Este plano implementa uma estrutura CRUD completa e robusta no ModernUnifiedEditor, transformando-o em uma solução definitiva que consolida todas as funcionalidades identificadas na arquitetura do sistema.

**Principais Diferenciais:**
- ✅ **CRUD Unificado** - Uma interface para todas as operações
- ✅ **Performance Otimizada** - Cache inteligente e lazy loading
- ✅ **Colaboração Real-time** - Múltiplos usuários simultâneos
- ✅ **Monitoramento Avançado** - Analytics e métricas em tempo real
- ✅ **Recuperação Robusta** - Sistema de versionamento e backup
- ✅ **Interface Moderna** - UX intuitiva e responsiva

**Resultado Final:** Um editor profissional pronto para produção que rivaliza com soluções enterprise como Typeform, Leadpages e ClickFunnels, mantendo a flexibilidade e poder do sistema Quiz Quest Challenge Verse existente.