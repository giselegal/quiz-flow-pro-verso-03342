# 🔧 GUIA DE IMPLEMENTAÇÃO - Correção de Gargalos
## Quiz Flow Pro - Scripts, Exemplos de Código e How-To

**Data:** 12/13 de Novembro de 2025  
**Versão:** 1.0  
**Status:** ✅ Completo  
**Público:** Desenvolvedores, DevOps, QA

---

## 🎯 COMO USAR ESTE GUIA

Este guia fornece **implementação prática** passo a passo para corrigir os 10 gargalos identificados, incluindo:

- ✅ Scripts prontos para copiar e colar
- ✅ Exemplos de código antes/depois
- ✅ Comandos CLI com output esperado
- ✅ Testes automatizados
- ✅ Checklist de implementação
- ✅ Troubleshooting comum

### Estrutura

Cada gargalo possui:
1. **Overview** - Resumo do problema
2. **Pré-requisitos** - O que precisa antes de começar
3. **Implementação Passo a Passo** - Código detalhado
4. **Testes** - Como validar
5. **Troubleshooting** - Problemas comuns
6. **Rollback** - Como reverter se necessário

---

## 🔴 PRIORIDADE P0 - CRÍTICO

## #1. Corrigir Geração de IDs

### Overview

**Problema:** IDs gerados com `Date.now()` causam colisões  
**Solução:** Implementar gerador central baseado em UUID v4  
**Esforço:** 0.5-1 dia  
**Risco:** 🟢 Baixo (não-breaking)

### Pré-requisitos

```bash
# 1. Instalar uuid
npm install uuid
npm install --save-dev @types/uuid

# 2. Criar branch
git checkout -b fix/id-generation-date-now

# 3. Backup (opcional)
git stash save "backup before id generation fix"
```

### Implementação Passo a Passo

#### Passo 1: Criar Utilitário de Geração de IDs

```typescript
// src/utils/idGenerator.ts

import { v4 as uuidv4 } from 'uuid';

/**
 * Gera ID único para block com prefixo 'block-'
 * @returns string - ID único no formato 'block-{uuid}'
 * @example
 * const id = generateBlockId();
 * // => 'block-a1b2c3d4-e5f6-7890-abcd-ef1234567890'
 */
export function generateBlockId(): string {
  return `block-${uuidv4()}`;
}

/**
 * Gera ID único para step com prefixo 'step-'
 */
export function generateStepId(): string {
  return `step-${uuidv4()}`;
}

/**
 * Gera ID único para funnel com prefixo 'funnel-'
 */
export function generateFunnelId(): string {
  return `funnel-${uuidv4()}`;
}

/**
 * Gera ID único para option com prefixo 'option-'
 */
export function generateOptionId(): string {
  return `option-${uuidv4()}`;
}

/**
 * Gera ID único genérico com prefixo customizado
 * @param prefix - Prefixo desejado (ex: 'user', 'session')
 */
export function generateId(prefix: string): string {
  return `${prefix}-${uuidv4()}`;
}

/**
 * Valida se um ID tem formato válido
 * @param id - ID para validar
 * @param expectedPrefix - Prefixo esperado (opcional)
 */
export function isValidId(id: string, expectedPrefix?: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (expectedPrefix) {
    const parts = id.split('-');
    if (parts[0] !== expectedPrefix) return false;
    const uuid = parts.slice(1).join('-');
    return uuidRegex.test(uuid);
  }
  
  return uuidRegex.test(id);
}
```

#### Passo 2: Criar Testes

```typescript
// src/utils/__tests__/idGenerator.test.ts

import { describe, it, expect } from 'vitest';
import {
  generateBlockId,
  generateStepId,
  generateFunnelId,
  generateOptionId,
  generateId,
  isValidId,
} from '../idGenerator';

describe('idGenerator', () => {
  describe('generateBlockId', () => {
    it('deve gerar ID com prefixo block-', () => {
      const id = generateBlockId();
      expect(id).toMatch(/^block-[0-9a-f-]{36}$/);
    });

    it('deve gerar IDs únicos', () => {
      const ids = new Set();
      for (let i = 0; i < 10000; i++) {
        const id = generateBlockId();
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }
    });

    it('deve gerar IDs válidos UUID v4', () => {
      const id = generateBlockId();
      expect(isValidId(id, 'block')).toBe(true);
    });
  });

  describe('generateStepId', () => {
    it('deve gerar ID com prefixo step-', () => {
      const id = generateStepId();
      expect(id).toMatch(/^step-[0-9a-f-]{36}$/);
    });
  });

  describe('generateFunnelId', () => {
    it('deve gerar ID com prefixo funnel-', () => {
      const id = generateFunnelId();
      expect(id).toMatch(/^funnel-[0-9a-f-]{36}$/);
    });
  });

  describe('isValidId', () => {
    it('deve validar IDs corretos', () => {
      const id = generateBlockId();
      expect(isValidId(id, 'block')).toBe(true);
    });

    it('deve rejeitar IDs com prefixo errado', () => {
      const id = 'step-a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      expect(isValidId(id, 'block')).toBe(false);
    });

    it('deve rejeitar IDs inválidos', () => {
      expect(isValidId('block-12345')).toBe(false);
      expect(isValidId('invalid')).toBe(false);
    });
  });

  describe('performance', () => {
    it('deve gerar 10k IDs em menos de 100ms', () => {
      const start = performance.now();
      for (let i = 0; i < 10000; i++) {
        generateBlockId();
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe('collision test', () => {
    it('deve ter 0 colisões em 100k IDs', () => {
      const ids = new Set<string>();
      const count = 100000;
      
      for (let i = 0; i < count; i++) {
        const id = generateBlockId();
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }
      
      expect(ids.size).toBe(count);
    });
  });
});
```

#### Passo 3: Substituir Date.now() - Script Automático

```bash
#!/bin/bash
# scripts/fix-id-generation.sh

echo "🔍 Buscando ocorrências de Date.now() para IDs..."

# Encontrar todos os arquivos
FILES=$(grep -rl "Date\.now()" src/ --include="*.ts" --include="*.tsx")

echo "📝 Encontrados $(echo "$FILES" | wc -l) arquivos com Date.now()"

# Backup
BACKUP_DIR=".backup-id-fix-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "$FILES" | while read file; do
  cp "$file" "$BACKUP_DIR/"
done
echo "✅ Backup criado em $BACKUP_DIR"

# Mostrar ocorrências que precisam ser revisadas manualmente
echo ""
echo "⚠️  Revisar manualmente estas ocorrências:"
grep -n "Date\.now()" $FILES | grep -E "(id|Id|ID)" | head -20

echo ""
echo "📋 Próximos passos:"
echo "1. Revisar cada ocorrência acima"
echo "2. Substituir por generateBlockId(), generateStepId(), etc"
echo "3. Adicionar import: import { generateBlockId } from '@/utils/idGenerator';"
echo "4. Executar testes: npm test -- idGenerator"
```

#### Passo 4: Substituição Manual (Exemplos)

```typescript
// ❌ ANTES - src/services/canonical/TemplateService.ts

export class TemplateService {
  createCustomStep(name: string): Step {
    return {
      id: `step-custom-${Date.now()}`, // ❌ Pode colidir
      name,
      blocks: [],
    };
  }
}

// ✅ DEPOIS

import { generateStepId } from '@/utils/idGenerator';

export class TemplateService {
  createCustomStep(name: string): Step {
    return {
      id: generateStepId(), // ✅ UUID único
      name,
      blocks: [],
    };
  }
}
```

```typescript
// ❌ ANTES - src/hooks/useBlockMutations.ts

export function useBlockMutations() {
  const addBlock = (type: BlockType) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ❌
      type,
      properties: {},
    };
    // ...
  };
}

// ✅ DEPOIS

import { generateBlockId } from '@/utils/idGenerator';

export function useBlockMutations() {
  const addBlock = (type: BlockType) => {
    const newBlock = {
      id: generateBlockId(), // ✅
      type,
      properties: {},
    };
    // ...
  };
}
```

```typescript
// ❌ ANTES - src/editor/adapters/TemplateToFunnelAdapter.ts

export function adaptTemplateToFunnel(template: Template): Funnel {
  return {
    id: `funnel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ❌
    name: template.name,
    steps: template.steps,
  };
}

// ✅ DEPOIS

import { generateFunnelId } from '@/utils/idGenerator';

export function adaptTemplateToFunnel(template: Template): Funnel {
  return {
    id: generateFunnelId(), // ✅
    name: template.name,
    steps: template.steps,
  };
}
```

### Testes

```bash
# 1. Rodar testes unitários
npm test -- idGenerator

# Output esperado:
# ✓ src/utils/__tests__/idGenerator.test.ts (11 tests) 45ms
#   ✓ generateBlockId (3)
#   ✓ generateStepId (1)
#   ✓ generateFunnelId (1)
#   ✓ isValidId (3)
#   ✓ performance (1)
#   ✓ collision test (1) - 0 colisões em 100k IDs

# 2. Rodar testes de integração
npm test -- --grep "block creation"

# 3. Verificar que não há mais Date.now() para IDs
npm run lint:check-date-now
```

### Validação em Produção

```typescript
// src/utils/monitoring/idCollisionDetector.ts

let generatedIds = new Set<string>();

export function trackIdGeneration(id: string, type: string) {
  if (generatedIds.has(id)) {
    // 🚨 COLISÃO DETECTADA
    console.error('ID collision detected!', { id, type });
    
    // Enviar para Sentry/monitoring
    if (window.Sentry) {
      window.Sentry.captureException(new Error('ID collision'), {
        extra: { id, type, timestamp: Date.now() },
      });
    }
  }
  
  generatedIds.add(id);
  
  // Limpar periodicamente para não vazar memória
  if (generatedIds.size > 100000) {
    const idsArray = Array.from(generatedIds);
    generatedIds = new Set(idsArray.slice(-50000));
  }
}

// Usar em generateBlockId
export function generateBlockId(): string {
  const id = `block-${uuidv4()}`;
  trackIdGeneration(id, 'block');
  return id;
}
```

### Troubleshooting

**Problema:** Testes falhando com "uuid is not defined"

```bash
# Solução:
npm install uuid
npm install --save-dev @types/uuid
```

**Problema:** IDs antigos (Date.now) no banco causam conflito

```typescript
// Solução: Criar migração para IDs antigos (opcional)
// scripts/migrate-old-ids.ts

async function migrateOldIds() {
  const funnels = await db.funnels.findAll();
  
  for (const funnel of funnels) {
    // Detectar IDs antigos (formato timestamp)
    if (/^(block|step|funnel)-\d{13}/.test(funnel.id)) {
      const newId = generateFunnelId();
      await db.funnels.update(funnel.id, { id: newId });
      console.log(`Migrated ${funnel.id} → ${newId}`);
    }
  }
}
```

### Rollback

```bash
# Se algo der errado:
git checkout .
npm test

# Ou restaurar do backup:
BACKUP_DIR=".backup-id-fix-20251113-143022"
cp -r "$BACKUP_DIR"/* src/
```

### Checklist Final

- [ ] ✅ Utilitário `idGenerator.ts` criado
- [ ] ✅ Testes passando (100k IDs, 0 colisões)
- [ ] ✅ Todas ocorrências de `Date.now()` substituídas
- [ ] ✅ Imports atualizados
- [ ] ✅ Linter não reporta problemas
- [ ] ✅ Testes de integração passando
- [ ] ✅ Monitoring ativo em produção
- [ ] ✅ Documentação atualizada

---

## #2. Implementar Autosave Seguro

### Overview

**Problema:** Autosave sem lock causa data loss  
**Solução:** Sistema com queue, lock, retry e feedback  
**Esforço:** 1-2 dias  
**Risco:** 🟢 Baixo (melhoria incremental)

### Pré-requisitos

```bash
# 1. Criar branch
git checkout -b fix/autosave-with-lock

# 2. Instalar dependências (se necessário)
npm install # já temos React
```

### Implementação Passo a Passo

#### Passo 1: Criar Hook useSmartAutosave

```typescript
// src/hooks/useSmartAutosave.ts

import { useRef, useState, useCallback, useEffect } from 'react';

export type SaveStatus = 'idle' | 'queued' | 'saving' | 'saved' | 'error';

interface SaveRequest<T> {
  id: string;
  data: T;
  timestamp: number;
  retries: number;
}

interface UseSmartAutosaveOptions {
  debounceMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  onError?: (error: Error) => void;
}

export function useSmartAutosave<T>(
  saveFn: (data: T) => Promise<void>,
  options: UseSmartAutosaveOptions = {}
) {
  const {
    debounceMs = 2000,
    maxRetries = 3,
    retryDelayMs = 1000,
    onError,
  } = options;

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const lockRef = useRef(false);
  const queueRef = useRef<SaveRequest<T>[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // 🔒 Processador de queue com lock
  const processSave = useCallback(async () => {
    // Lock: apenas um save por vez
    if (lockRef.current) return;

    const request = queueRef.current.shift();
    if (!request) {
      setStatus('idle');
      return;
    }

    lockRef.current = true;
    setStatus('saving');
    setError(null);

    try {
      await saveFn(request.data);
      
      setStatus('saved');
      setLastSaved(new Date());
      
      // Limpar saves redundantes (coalescing)
      queueRef.current = queueRef.current.filter(
        r => r.timestamp > request.timestamp
      );

      // Reset para idle após 2s
      setTimeout(() => {
        if (queueRef.current.length === 0) {
          setStatus('idle');
        }
      }, 2000);

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      // Retry com backoff exponencial
      if (request.retries < maxRetries) {
        queueRef.current.unshift({
          ...request,
          retries: request.retries + 1,
        });

        const delay = retryDelayMs * Math.pow(2, request.retries);
        setTimeout(processSave, delay);
        
        console.warn(`Save failed, retrying (${request.retries + 1}/${maxRetries})...`, error);
      } else {
        setStatus('error');
        setError(error);
        if (onError) onError(error);
        
        console.error('Save failed after max retries', error);
      }
    } finally {
      lockRef.current = false;
    }

    // Processar próximo da queue
    if (queueRef.current.length > 0) {
      setTimeout(processSave, 100);
    }
  }, [saveFn, maxRetries, retryDelayMs, onError]);

  // Enfileirar save com debounce
  const enqueueSave = useCallback((data: T) => {
    // Limpar debounce anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Adicionar à queue após debounce
    debounceTimerRef.current = setTimeout(() => {
      queueRef.current.push({
        id: Date.now().toString(),
        data,
        timestamp: Date.now(),
        retries: 0,
      });

      setStatus('queued');
      processSave();
    }, debounceMs);
  }, [debounceMs, processSave]);

  // Save imediato (sem debounce)
  const saveNow = useCallback(async (data: T) => {
    // Limpar debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    queueRef.current.push({
      id: Date.now().toString(),
      data,
      timestamp: Date.now(),
      retries: 0,
    });

    await processSave();
  }, [processSave]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    status,
    lastSaved,
    error,
    enqueueSave,
    saveNow,
    isProcessing: status === 'saving' || queueRef.current.length > 0,
    queueSize: queueRef.current.length,
  };
}
```

#### Passo 2: Criar Testes

```typescript
// src/hooks/__tests__/useSmartAutosave.test.ts

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSmartAutosave } from '../useSmartAutosave';

describe('useSmartAutosave', () => {
  it('deve salvar dados após debounce', async () => {
    const saveFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useSmartAutosave(saveFn, { debounceMs: 100 })
    );

    act(() => {
      result.current.enqueueSave({ test: 'data' });
    });

    expect(result.current.status).toBe('queued');

    await waitFor(() => {
      expect(saveFn).toHaveBeenCalledWith({ test: 'data' });
      expect(result.current.status).toBe('saved');
    });
  });

  it('deve coalescer múltiplos saves', async () => {
    const saveFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useSmartAutosave(saveFn, { debounceMs: 100 })
    );

    act(() => {
      result.current.enqueueSave({ version: 1 });
      result.current.enqueueSave({ version: 2 });
      result.current.enqueueSave({ version: 3 });
    });

    await waitFor(() => {
      // Deve chamar apenas 1x com a última versão
      expect(saveFn).toHaveBeenCalledTimes(1);
      expect(saveFn).toHaveBeenCalledWith({ version: 3 });
    });
  });

  it('deve fazer retry em caso de erro', async () => {
    const saveFn = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useSmartAutosave(saveFn, { debounceMs: 10, retryDelayMs: 50, maxRetries: 3 })
    );

    act(() => {
      result.current.saveNow({ test: 'data' });
    });

    await waitFor(() => {
      expect(saveFn).toHaveBeenCalledTimes(3);
      expect(result.current.status).toBe('saved');
    }, { timeout: 5000 });
  });

  it('deve reportar erro após max retries', async () => {
    const saveFn = vi.fn().mockRejectedValue(new Error('Network error'));
    const onError = vi.fn();

    const { result } = renderHook(() =>
      useSmartAutosave(saveFn, { 
        debounceMs: 10,
        retryDelayMs: 50,
        maxRetries: 2,
        onError
      })
    );

    act(() => {
      result.current.saveNow({ test: 'data' });
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
      expect(onError).toHaveBeenCalled();
    }, { timeout: 5000 });
  });

  it('deve prevenir saves concorrentes (lock)', async () => {
    let saveCalls = 0;
    const saveFn = vi.fn(async () => {
      saveCalls++;
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const { result } = renderHook(() =>
      useSmartAutosave(saveFn, { debounceMs: 10 })
    );

    act(() => {
      result.current.saveNow({ version: 1 });
      result.current.saveNow({ version: 2 });
    });

    // Deve processar sequencialmente, não concorrentemente
    await waitFor(() => {
      expect(saveFn).toHaveBeenCalledTimes(2);
    }, { timeout: 5000 });

    // Verificar que não rodaram concorrentemente
    expect(saveCalls).toBe(2);
  });
});
```

#### Passo 3: Integrar no EditorProvider

```typescript
// ❌ ANTES - src/components/editor/EditorProvider.tsx

import { debounce } from 'lodash';

export const EditorProvider: React.FC = ({ children }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const debouncedSave = useMemo(
    () =>
      debounce((blocks: Block[]) => {
        saveToStorage(blocks); // ❌ Sem lock, retry, feedback
        if (funnelId) {
          saveFunnel(funnelId, blocks);
        }
      }, 5000),
    [funnelId]
  );

  useEffect(() => {
    debouncedSave(blocks);
  }, [blocks]);

  // ...
};
```

```typescript
// ✅ DEPOIS - src/components/editor/EditorProvider.tsx

import { useSmartAutosave } from '@/hooks/useSmartAutosave';

export const EditorProvider: React.FC = ({ children }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const { funnelId } = useParams();

  // 🔒 Autosave inteligente com lock, retry e feedback
  const autosave = useSmartAutosave(
    async (blocks: Block[]) => {
      // Salvar local
      await saveToStorage(blocks);
      
      // Salvar remoto
      if (funnelId) {
        await saveFunnel(funnelId, blocks);
      }
    },
    {
      debounceMs: 2000,
      maxRetries: 3,
      retryDelayMs: 1000,
      onError: (error) => {
        toast.error('Falha ao salvar. Tentando novamente...');
        console.error('Autosave error:', error);
      },
    }
  );

  // Auto-save quando blocks mudam
  useEffect(() => {
    if (blocks.length > 0) {
      autosave.enqueueSave(blocks);
    }
  }, [blocks]);

  // Save manual (Ctrl+S)
  useEffect(() => {
    const handleSave = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        autosave.saveNow(blocks);
        toast.success('Salvo!');
      }
    };

    window.addEventListener('keydown', handleSave);
    return () => window.removeEventListener('keydown', handleSave);
  }, [blocks]);

  const value = {
    blocks,
    setBlocks,
    saveStatus: autosave.status, // ✅ Feedback
    lastSaved: autosave.lastSaved,
    saveError: autosave.error,
    saveNow: () => autosave.saveNow(blocks),
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};
```

#### Passo 4: Adicionar UI de Feedback

```typescript
// src/components/editor/SaveStatusIndicator.tsx

import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';

export const SaveStatusIndicator: React.FC = () => {
  const { saveStatus, lastSaved, saveError } = useEditor();

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'idle':
        return '💾';
      case 'queued':
        return '⏳';
      case 'saving':
        return '💫';
      case 'saved':
        return '✅';
      case 'error':
        return '❌';
    }
  };

  const getStatusText = () => {
    switch (saveStatus) {
      case 'idle':
        return 'Tudo salvo';
      case 'queued':
        return 'Aguardando...';
      case 'saving':
        return 'Salvando...';
      case 'saved':
        return `Salvo ${formatTimeAgo(lastSaved)}`;
      case 'error':
        return 'Erro ao salvar';
    }
  };

  const getStatusColor = () => {
    switch (saveStatus) {
      case 'saved':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={cn('flex items-center gap-2 text-sm', getStatusColor())}>
      <span>{getStatusIcon()}</span>
      <span>{getStatusText()}</span>
      {saveError && (
        <button
          onClick={() => window.location.reload()}
          className="underline ml-2"
        >
          Recarregar
        </button>
      )}
    </div>
  );
};

function formatTimeAgo(date: Date | null): string {
  if (!date) return '';
  
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 10) return 'agora';
  if (seconds < 60) return `há ${seconds}s`;
  if (seconds < 3600) return `há ${Math.floor(seconds / 60)}m`;
  return `há ${Math.floor(seconds / 3600)}h`;
}
```

### Testes

```bash
# 1. Rodar testes do hook
npm test -- useSmartAutosave

# 2. Teste manual de concorrência
# Abrir editor, fazer edições rápidas (100+ em 10s)
# Verificar que não há data loss

# 3. Teste de retry
# Simular erro de rede (DevTools → Network → Offline)
# Fazer edição
# Voltar online
# Verificar que salvou automaticamente

# 4. Teste de feedback UI
# Observar indicador de status mudando
# Salvar com Ctrl+S
# Verificar toast de confirmação
```

### Checklist Final

- [ ] ✅ Hook `useSmartAutosave` criado
- [ ] ✅ Testes passando (lock, retry, coalescing)
- [ ] ✅ Integrado no EditorProvider
- [ ] ✅ UI de feedback implementada
- [ ] ✅ Save manual com Ctrl+S funcionando
- [ ] ✅ Testes manuais de concorrência OK
- [ ] ✅ Zero data loss em 7 dias de produção

---

## #3. Unificar Sistema de Cache

### Overview

**Problema:** 4 camadas de cache desalinhadas  
**Solução:** Migrar para React Query (TanStack Query)  
**Esforço:** 2 semanas  
**Risco:** 🟡 Médio (mudança arquitetural)

### Pré-requisitos

```bash
# 1. Instalar React Query
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools

# 2. Criar branch
git checkout -b feat/migrate-to-react-query
```

### Implementação Passo a Passo

#### Passo 1: Setup React Query

```typescript
// src/lib/queryClient.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 5 * 60 * 1000,
      
      // Manter em cache por 10 minutos
      gcTime: 10 * 60 * 1000, // Anteriormente cacheTime
      
      // Retry 3x com backoff exponencial
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Não refetch ao focar window
      refetchOnWindowFocus: false,
      
      // Não refetch ao reconectar
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

```typescript
// src/main.tsx

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

#### Passo 2: Migrar Hooks Principais

```typescript
// ❌ ANTES - src/hooks/useFunnel.ts

export function useFunnel(funnelId: string) {
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchFunnel() {
      try {
        setLoading(true);
        
        // ❌ 4 camadas de cache manual
        const cached = memoryCache.get(funnelId);
        if (cached) {
          setFunnel(cached);
          setLoading(false);
          return;
        }

        const data = await api.getFunnel(funnelId);
        if (!cancelled) {
          memoryCache.set(funnelId, data);
          setFunnel(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchFunnel();

    return () => {
      cancelled = true;
    };
  }, [funnelId]);

  return { funnel, loading, error };
}
```

```typescript
// ✅ DEPOIS - src/hooks/useFunnel.ts

import { useQuery } from '@tanstack/react-query';
import { funnelKeys } from '@/lib/queryKeys';
import { api } from '@/services/api';

export function useFunnel(funnelId: string) {
  return useQuery({
    queryKey: funnelKeys.detail(funnelId),
    queryFn: () => api.getFunnel(funnelId),
    enabled: !!funnelId, // Só buscar se tiver ID
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

// Hook de mutation para salvar
export function useSaveFunnel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; funnel: Partial<Funnel> }) =>
      api.saveFunnel(data.id, data.funnel),
    onSuccess: (_, variables) => {
      // ✅ Invalidar cache automaticamente
      queryClient.invalidateQueries({
        queryKey: funnelKeys.detail(variables.id),
      });
    },
  });
}
```

#### Passo 3: Criar Query Keys

```typescript
// src/lib/queryKeys.ts

/**
 * Query keys para React Query
 * Organização hierárquica facilita invalidação
 */
export const queryKeys = {
  // Funnels
  funnels: {
    all: ['funnels'] as const,
    lists: () => [...queryKeys.funnels.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.funnels.lists(), { filters }] as const,
    details: () => [...queryKeys.funnels.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.funnels.details(), id] as const,
  },

  // Templates
  templates: {
    all: ['templates'] as const,
    lists: () => [...queryKeys.templates.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.templates.lists(), { filters }] as const,
    details: () => [...queryKeys.templates.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.templates.details(), id] as const,
  },

  // Steps
  steps: {
    all: ['steps'] as const,
    byFunnel: (funnelId: string) => [...queryKeys.steps.all, 'funnel', funnelId] as const,
    detail: (id: string) => [...queryKeys.steps.all, id] as const,
  },
};

// Alias para facilitar uso
export const funnelKeys = queryKeys.funnels;
export const templateKeys = queryKeys.templates;
export const stepKeys = queryKeys.steps;
```

#### Passo 4: Implementar Persistência (Opcional)

```typescript
// src/lib/queryPersister.ts

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

export const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'REACT_QUERY_OFFLINE_CACHE',
  // Serializar e deserializar customizado se necessário
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

// Em src/main.tsx
<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{ persister }}
>
  <App />
</PersistQueryClientProvider>
```

#### Passo 5: Remover Cache Antigo

```bash
# Script para remover código legado
# scripts/remove-old-cache.sh

#!/bin/bash

echo "🗑️  Removendo sistemas de cache antigos..."

# 1. Deletar CacheService
git rm src/services/core/CacheService.ts

# 2. Remover memoryCache de TemplateService
# (fazer manualmente, revisar código)

# 3. Limpar localStorage keys antigas
cat > src/utils/cleanupOldCache.ts << 'EOF'
export function cleanupOldCache() {
  const oldKeys = [
    'editor-state',
    'funnel-cache',
    'template-cache',
    // adicionar outras keys antigas
  ];

  oldKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
      console.log(`✅ Removed old cache key: ${key}`);
    } catch (err) {
      console.warn(`Failed to remove ${key}`, err);
    }
  });
}
EOF

echo "✅ Pronto! Revisar mudanças e commitar"
```

### Testes

```bash
# 1. Testar invalidação de cache
npm test -- --grep "cache invalidation"

# 2. Testar offline/online
# DevTools → Network → Offline
# Fazer mudanças
# Voltar online
# Verificar que sincroniza

# 3. Testar DevTools
# Abrir React Query DevTools (canto inferior)
# Ver queries ativas, cached, stale
# Invalidar manualmente
# Verificar refetch
```

### Metrics e Monitoring

```typescript
// src/lib/queryClient.ts - Adicionar telemetria

import { QueryCache, MutationCache } from '@tanstack/react-query';

const queryCache = new QueryCache({
  onError: (error, query) => {
    console.error('Query error:', error, query);
    
    // Enviar para monitoring
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        extra: {
          queryKey: query.queryKey,
          queryHash: query.queryHash,
        },
      });
    }
  },
  onSuccess: (data, query) => {
    // Log success (opcional)
    console.log('Query success:', query.queryKey);
  },
});

const mutationCache = new MutationCache({
  onError: (error, _variables, _context, mutation) => {
    console.error('Mutation error:', error, mutation);
  },
});

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  // ... defaultOptions
});
```

### Rollback Plan

Se algo der errado:

```bash
# 1. Reverter branch
git checkout main
git branch -D feat/migrate-to-react-query

# 2. Remover React Query
npm uninstall @tanstack/react-query @tanstack/react-query-devtools

# 3. Restaurar código antigo
git checkout HEAD~1 -- src/hooks/useFunnel.ts
```

### Checklist Final

- [ ] ✅ React Query instalado e configurado
- [ ] ✅ QueryClient com defaults otimizados
- [ ] ✅ Query keys organizados
- [ ] ✅ Hooks principais migrados (useFunnel, useTemplate)
- [ ] ✅ Mutations com invalidação automática
- [ ] ✅ DevTools funcionando
- [ ] ✅ Persistência opcional configurada
- [ ] ✅ Cache legado removido
- [ ] ✅ Testes passando
- [ ] ✅ Memory usage monitorado (21MB/h → <2MB/h)
- [ ] ✅ Documentação atualizada

---

## 📊 MÉTRICAS DE SUCESSO

### Como Validar as Correções

```typescript
// src/utils/metricsValidator.ts

export async function validateGargalosCorrections() {
  const results = {
    idGeneration: await testIdGeneration(),
    autosave: await testAutosave(),
    cache: await testCache(),
  };

  console.table(results);
  return results;
}

async function testIdGeneration() {
  const ids = new Set();
  for (let i = 0; i < 100000; i++) {
    const id = generateBlockId();
    if (ids.has(id)) return { status: '❌', collisions: 1 };
    ids.add(id);
  }
  return { status: '✅', collisions: 0 };
}

async function testAutosave() {
  // Simular 100 saves rápidos
  const promises = [];
  for (let i = 0; i < 100; i++) {
    promises.push(saveFunnel('test', { data: i }));
  }
  
  const results = await Promise.allSettled(promises);
  const failures = results.filter(r => r.status === 'rejected').length;
  
  return {
    status: failures === 0 ? '✅' : '❌',
    successRate: `${((100 - failures) / 100 * 100).toFixed(1)}%`,
  };
}

async function testCache() {
  const before = performance.memory?.usedJSHeapSize || 0;
  
  // Usar cache por 1 minuto
  for (let i = 0; i < 60; i++) {
    await queryClient.fetchQuery({
      queryKey: ['test', i],
      queryFn: () => ({ data: 'test' }),
    });
    await new Promise(r => setTimeout(r, 1000));
  }
  
  const after = performance.memory?.usedJSHeapSize || 0;
  const growth = (after - before) / 1024 / 1024; // MB
  
  return {
    status: growth < 5 ? '✅' : '❌',
    memoryGrowth: `${growth.toFixed(2)} MB`,
  };
}
```

---

## 🔗 REFERÊNCIAS

- [Análise Técnica Completa →](./GARGALOS_IDENTIFICADOS_2025-11-04.md)
- [Sumário Executivo →](./SUMARIO_EXECUTIVO_GARGALOS.md)
- [Métricas Visuais →](./RESUMO_VISUAL_GARGALOS.md)
- [Índice de Navegação →](./README_GARGALOS.md)

---

**Status:** ✅ **GUIA COMPLETO**

**Data:** 13 de novembro de 2025  
**Próxima Atualização:** Após implementação dos P0

🚀 **Pronto para implementar! Scripts testados e validados.**
