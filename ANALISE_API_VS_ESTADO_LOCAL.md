# 🔌 ANÁLISE: API vs ESTADO LOCAL - PAINEL DE PROPRIEDADES

**Sprint 4 - Dia 4**  
**Data:** 11 de outubro de 2025  
**Análise:** Backend API vs Frontend State

---

## 🎯 RESPOSTA DIRETA

### **Uso de API seria mais preciso?**

**Depende do caso de uso:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUANDO USAR CADA ABORDAGEM                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🟢 ESTADO LOCAL (Atual)        vs    🔵 API/Backend           │
│  ─────────────────────────                ───────────────       │
│  ✅ Edição em tempo real              ✅ Multi-usuário          │
│  ✅ Performance instantânea           ✅ Dados sempre sincron.  │
│  ✅ Undo/Redo local                   ✅ Backup automático      │
│  ✅ Funciona offline                  ✅ Auditoria/histórico    │
│  ✅ Simples de implementar            ✅ Escalabilidade         │
│  ✅ Sem latência de rede              ✅ Validação server-side  │
│                                                                 │
│  ❌ Perde dados se não salvar         ❌ Latência de rede       │
│  ❌ Não sincroniza entre abas         ❌ Mais complexo          │
│  ❌ Histórico limitado                ❌ Requer backend         │
│  ❌ Sem validação server-side         ❌ Não funciona offline   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ ARQUITETURA ATUAL vs PROPOSTA COM API

### **Arquitetura Atual (Estado Local + Save Manual)**

```
┌─────────────────────────────────────────────────────────────────┐
│                       ARQUITETURA ATUAL                         │
└─────────────────────────────────────────────────────────────────┘

EDITOR (Frontend)
    │
    ├─► const [steps, setSteps] = useState([...])  ← Estado local
    │       │
    │       ├─► User edita → setSteps(new)
    │       │                     │
    │       │                     ├─► Undo/Redo (histórico local)
    │       │                     ├─► setIsDirty(true)
    │       │                     └─► Re-render instantâneo
    │       │
    │       └─► User clica "Salvar"
    │               │
    │               └─► POST /api/funnels/{id}
    │                       │
    │                       └─► Backend persiste
    │                               │
    │                               └─► Retorna sucesso
    │                                       │
    │                                       └─► setIsDirty(false)

VANTAGENS:
✅ Edição instantânea (0ms latency)
✅ Undo/Redo funciona offline
✅ Múltiplas edições antes de salvar
✅ Usuário controla quando salvar

DESVANTAGENS:
❌ Dados podem ser perdidos (crash, fechar aba)
❌ Não sincroniza entre abas
❌ Conflitos se múltiplos usuários editarem
```

---

### **Arquitetura com API Real-Time (Proposta)**

```
┌─────────────────────────────────────────────────────────────────┐
│                   ARQUITETURA COM API/BACKEND                   │
└─────────────────────────────────────────────────────────────────┘

OPÇÃO 1: API REST com Auto-Save
────────────────────────────────────

EDITOR (Frontend)
    │
    ├─► const [steps, setSteps] = useState([...])
    │       │
    │       └─► User edita → setSteps(new)
    │               │
    │               ├─► setState local (UI atualiza)
    │               │
    │               └─► useEffect com debounce (500ms)
    │                       │
    │                       └─► PATCH /api/funnels/{id}/blocks/{blockId}
    │                               │
    │                               ├─► Backend valida
    │                               ├─► Persiste no DB
    │                               └─► Retorna confirmação
    │                                       │
    │                                       └─► Sincroniza estado local

VANTAGENS:
✅ Auto-save (não perde dados)
✅ Validação server-side
✅ Backup contínuo

DESVANTAGENS:
❌ Latência de rede (100-500ms)
❌ Conflitos de estado durante save
❌ Requer conectividade constante


OPÇÃO 2: WebSocket Real-Time (Colaborativo)
────────────────────────────────────────────

EDITOR (Frontend)
    │
    ├─► WebSocket conectado ao Backend
    │       │
    │       ├─► User edita → setSteps(new)
    │       │       │
    │       │       ├─► UI atualiza (otimista)
    │       │       │
    │       │       └─► ws.send({ type: 'UPDATE_BLOCK', ... })
    │       │               │
    │       │               └─► Backend recebe
    │       │                       │
    │       │                       ├─► Valida
    │       │                       ├─► Persiste
    │       │                       └─► Broadcast para todos
    │       │
    │       └─► ws.on('BLOCK_UPDATED', (data) => {
    │               if (data.userId !== currentUser) {
    │                   mergeRemoteChanges(data)  // Outro usuário editou
    │               }
    │           })

VANTAGENS:
✅ Colaboração real-time (Google Docs style)
✅ Sincronização automática entre usuários
✅ Vê mudanças de outros em tempo real

DESVANTAGENS:
❌ Muito complexo
❌ Conflitos de merge (CRDTs, OT)
❌ Infraestrutura cara (WebSocket servers)
❌ Não funciona offline


OPÇÃO 3: API com Cache Local (Híbrido)
───────────────────────────────────────

EDITOR (Frontend)
    │
    ├─► React Query / SWR
    │       │
    │       ├─► GET /api/funnels/{id}
    │       │       │
    │       │       └─► Cache local (stale-while-revalidate)
    │       │
    │       ├─► User edita → setSteps(new)
    │       │       │
    │       │       ├─► Mutação otimista (UI instant)
    │       │       │
    │       │       └─► useMutation({
    │       │               onMutate: async (newData) => {
    │       │                   // Cancela queries em andamento
    │       │                   await queryClient.cancelQueries(['funnel', id])
    │       │                   
    │       │                   // Snapshot estado anterior
    │       │                   const previous = queryClient.getQueryData(['funnel', id])
    │       │                   
    │       │                   // Atualização otimista
    │       │                   queryClient.setQueryData(['funnel', id], newData)
    │       │                   
    │       │                   return { previous }
    │       │               },
    │       │               onError: (err, newData, context) => {
    │       │                   // Rollback se falhar
    │       │                   queryClient.setQueryData(['funnel', id], context.previous)
    │       │               },
    │       │               onSettled: () => {
    │       │                   // Revalida dados
    │       │                   queryClient.invalidateQueries(['funnel', id])
    │       │               }
    │       │           })
    │       │
    │       └─► Background revalidation (polling 30s)

VANTAGENS:
✅ Performance de estado local
✅ Sincronização automática
✅ Rollback automático em erros
✅ Cache inteligente
✅ Funciona offline (cache)

DESVANTAGENS:
❌ Mais complexo que estado puro
❌ Requer biblioteca (React Query/SWR)
❌ Curva de aprendizado
```

---

## 📊 COMPARAÇÃO DETALHADA

### **1. Performance**

| Operação | Estado Local | API REST | API + Cache | WebSocket |
|----------|--------------|----------|-------------|-----------|
| Leitura inicial | ⚡ 0ms | 🐢 200-500ms | ⚡ 0ms (cache) | 🐢 200-500ms |
| Edição (UI) | ⚡ 0ms | 🐢 100-300ms | ⚡ 0ms (otimista) | 🟡 50-100ms |
| Salvar | 🟡 Manual | 🐢 200-500ms | 🟡 200-500ms (bg) | ⚡ Real-time |
| Undo/Redo | ⚡ Instantâneo | ❌ Complexo | ❌ Complexo | ❌ Muito complexo |

---

### **2. Confiabilidade**

| Cenário | Estado Local | API REST | API + Cache | WebSocket |
|---------|--------------|----------|-------------|-----------|
| Perda de rede | ✅ Funciona | ❌ Para | ✅ Cache funciona | ❌ Desconecta |
| Crash/Refresh | ❌ Perde dados | ✅ Dados salvos | ✅ Cache persiste | ✅ Recupera do server |
| Multi-abas | ❌ Dessincronizado | 🟡 Manualmente | ✅ Sincroniza (polling) | ✅ Real-time |
| Multi-usuários | ❌ Conflitos | 🟡 Last-write-wins | 🟡 Conflitos possíveis | ✅ Merge inteligente |

---

### **3. Complexidade de Implementação**

```
┌────────────────────────────────────────────────────────────┐
│                   COMPLEXIDADE (1-10)                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Estado Local:           ████ 4/10                        │
│  API REST (manual):      ██████ 6/10                      │
│  API + Auto-save:        ████████ 8/10                    │
│  API + Cache (RQ):       ██████████ 9/10                  │
│  WebSocket Real-time:    ████████████ 12/10 (muito!)     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### **4. Casos de Uso Ideais**

```
┌──────────────────────────────────────────────────────────────┐
│                    QUANDO USAR CADA UM                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🟢 ESTADO LOCAL (Atual)                                    │
│  ─────────────────────────                                  │
│  ✅ Editor single-user                                      │
│  ✅ Sessões curtas (< 30 min)                               │
│  ✅ Prototipagem rápida                                     │
│  ✅ MVP sem backend complexo                                │
│  ✅ Performance crítica                                     │
│                                                              │
│  🔵 API REST + Auto-Save                                    │
│  ────────────────────────                                   │
│  ✅ Multi-usuários (não simultâneo)                         │
│  ✅ Sessões longas (> 1 hora)                               │
│  ✅ Auditoria importante                                    │
│  ✅ Validação server-side necessária                        │
│  ✅ Backup/recuperação crítico                              │
│                                                              │
│  🟣 API + Cache (React Query)                               │
│  ──────────────────────────────                             │
│  ✅ Multi-abas do mesmo usuário                             │
│  ✅ Sincronização background                                │
│  ✅ Performance + confiabilidade                            │
│  ✅ Rollback automático                                     │
│  ✅ Offline-first com sync                                  │
│                                                              │
│  🔴 WebSocket Real-time                                     │
│  ───────────────────────                                    │
│  ✅ Google Docs style (colaboração real)                    │
│  ✅ Múltiplos usuários SIMULTÂNEOS                          │
│  ✅ Ver cursores/edições de outros                          │
│  ✅ Chat integrado                                          │
│  ✅ Notificações instantâneas                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 💡 RECOMENDAÇÃO PARA SEU CASO

### **Contexto Atual:**
- ✅ Editor de funis (quiz)
- ✅ Provavelmente single-user por sessão
- ✅ Já tem sistema de save manual
- ✅ Performance é crítica (edição real-time)
- ✅ Undo/Redo implementado

### **Solução Recomendada: HÍBRIDA (Estado Local + API + Auto-Save Inteligente)**

```typescript
// ============================================
// ARQUITETURA HÍBRIDA RECOMENDADA
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

function QuizEditor() {
    const queryClient = useQueryClient();
    const { funnelId } = useParams();
    
    // ============================================
    // 1. FETCH INICIAL (com cache)
    // ============================================
    const { data: initialFunnel, isLoading } = useQuery({
        queryKey: ['funnel', funnelId],
        queryFn: () => fetchFunnel(funnelId),
        staleTime: 5 * 60 * 1000,  // 5 minutos
        cacheTime: 30 * 60 * 1000, // 30 minutos
    });
    
    // ============================================
    // 2. ESTADO LOCAL (para edição instantânea)
    // ============================================
    const [steps, setSteps] = useState<Step[]>(initialFunnel?.steps || []);
    const [isDirty, setIsDirty] = useState(false);
    
    // Sincroniza quando dados chegam da API
    useEffect(() => {
        if (initialFunnel && !isDirty) {
            setSteps(initialFunnel.steps);
        }
    }, [initialFunnel, isDirty]);
    
    // ============================================
    // 3. MUTAÇÃO (save otimista)
    // ============================================
    const saveMutation = useMutation({
        mutationFn: (data: Partial<Funnel>) => 
            updateFunnel(funnelId, data),
        
        // Atualização otimista
        onMutate: async (newData) => {
            await queryClient.cancelQueries(['funnel', funnelId]);
            const previous = queryClient.getQueryData(['funnel', funnelId]);
            
            queryClient.setQueryData(['funnel', funnelId], (old: any) => ({
                ...old,
                ...newData
            }));
            
            return { previous };
        },
        
        // Rollback em erro
        onError: (err, newData, context) => {
            queryClient.setQueryData(['funnel', funnelId], context.previous);
            toast.error('Erro ao salvar. Mudanças revertidas.');
        },
        
        // Sucesso
        onSuccess: () => {
            setIsDirty(false);
            toast.success('Salvo automaticamente');
        },
        
        // Revalida após save
        onSettled: () => {
            queryClient.invalidateQueries(['funnel', funnelId]);
        }
    });
    
    // ============================================
    // 4. AUTO-SAVE DEBOUNCED (2 segundos)
    // ============================================
    const debouncedSave = useDebouncedCallback(
        (newSteps: Step[]) => {
            saveMutation.mutate({ steps: newSteps });
        },
        2000  // 2 segundos de delay
    );
    
    // ============================================
    // 5. UPDATE LOCAL + TRIGGER AUTO-SAVE
    // ============================================
    const updateSteps = useCallback((updater: (prev: Step[]) => Step[]) => {
        setSteps(prev => {
            const next = updater(prev);
            setIsDirty(true);
            
            // Trigger auto-save debounced
            debouncedSave(next);
            
            return next;
        });
    }, [debouncedSave]);
    
    // ============================================
    // 6. SAVE MANUAL (Ctrl+S)
    // ============================================
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                debouncedSave.flush();  // Força save imediato
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [debouncedSave]);
    
    // ============================================
    // 7. BEFORE UNLOAD WARNING
    // ============================================
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = 'Você tem alterações não salvas';
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);
    
    // ============================================
    // 8. BACKGROUND POLLING (sincronizar com server)
    // ============================================
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDirty) {  // Só revalida se não estiver editando
                queryClient.invalidateQueries(['funnel', funnelId]);
            }
        }, 30000);  // 30 segundos
        
        return () => clearInterval(interval);
    }, [funnelId, isDirty, queryClient]);
    
    return (
        <div>
            {/* Indicador de status */}
            <SaveIndicator 
                status={
                    saveMutation.isLoading ? 'saving' :
                    isDirty ? 'unsaved' :
                    'saved'
                }
            />
            
            <PropertiesPanel
                selectedBlock={selectedBlock}
                onBlockPatch={(patch) => {
                    updateSteps(prev => /* ... */);
                }}
            />
        </div>
    );
}

// ============================================
// COMPONENTE DE INDICADOR
// ============================================
function SaveIndicator({ status }: { status: 'saving' | 'unsaved' | 'saved' }) {
    const icons = {
        saving: '⏳ Salvando...',
        unsaved: '⚠️ Não salvo',
        saved: '✅ Salvo'
    };
    
    return (
        <div className="save-indicator">
            {icons[status]}
        </div>
    );
}
```

---

## 🎯 BENEFÍCIOS DA SOLUÇÃO HÍBRIDA

### **1. Performance**
```
✅ Edição instantânea (estado local)
✅ UI nunca trava (mutação otimista)
✅ Rollback automático em erros
```

### **2. Confiabilidade**
```
✅ Auto-save a cada 2 segundos
✅ Ctrl+S para save manual imediato
✅ Warning antes de fechar aba
✅ Backup contínuo no servidor
```

### **3. Sincronização**
```
✅ Polling a cada 30s (quando idle)
✅ Revalidação após mutation
✅ Cache local (funciona offline temporariamente)
```

### **4. UX**
```
✅ Indicador visual de status
✅ Toast de confirmação/erro
✅ Não interrompe fluxo de trabalho
```

---

## 📋 COMPARAÇÃO FINAL

| Critério | Estado Atual | Híbrida Recomendada | WebSocket Real-time |
|----------|--------------|---------------------|---------------------|
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Confiabilidade** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Simplicidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| **Multi-usuário** | ❌ | 🟡 (polling) | ⭐⭐⭐⭐⭐ |
| **Offline** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| **Custo** | $ | $$ | $$$$ |
| **Complexidade** | Baixa | Média | Alta |

---

## 🚀 PLANO DE IMPLEMENTAÇÃO

### **Fase 1: Preparação (1 dia)**
```bash
# Instalar React Query
npm install @tanstack/react-query

# Instalar hook de debounce
npm install use-debounce

# Configurar QueryClient
```

### **Fase 2: API Endpoints (1 dia)**
```typescript
// Backend - criar endpoints granulares
GET    /api/funnels/:id
PATCH  /api/funnels/:id/steps/:stepId/blocks/:blockId
POST   /api/funnels/:id/auto-save
```

### **Fase 3: Migração Gradual (2 dias)**
```
1. Adicionar React Query (não quebra nada)
2. Adicionar auto-save debounced
3. Manter save manual como fallback
4. Testar com usuários beta
```

### **Fase 4: Monitoramento (contínuo)**
```
1. Adicionar analytics:
   - Taxa de auto-save vs manual
   - Tempo médio entre saves
   - Erros de save
2. Ajustar debounce se necessário
```

---

## 🎯 CONCLUSÃO

### **Resposta Final: "API seria mais preciso?"**

✅ **SIM, mas não substituir completamente o estado local**

**Solução ideal:**
```
Estado Local (UI instantânea)
      +
Auto-Save API (backup contínuo)
      +
Cache Inteligente (sincronização)
      =
🏆 MELHOR DOS DOIS MUNDOS
```

### **Próximos Passos Recomendados:**

1. ✅ **Manter** arquitetura atual para edição
2. ✅ **Adicionar** React Query para cache
3. ✅ **Implementar** auto-save debounced (2s)
4. ✅ **Manter** save manual como fallback
5. ❌ **NÃO implementar** WebSocket (overkill para o caso)

---

**Documento gerado automaticamente**  
**Sprint 4 - Dia 4**  
**Data:** 11/out/2025 05:45  
**Status:** ✅ **ANÁLISE ARQUITETURAL COMPLETA**
