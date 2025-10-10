# 📚 REFERÊNCIA DE API - SERVIÇOS PRINCIPAIS
**Quiz Quest Challenge Verse - Documentação de Serviços**  
**Data:** 10 de Outubro de 2025  
**Sprint 1 - Task 4:** Documentação de APIs

---

## 📋 SUMÁRIO

1. [FunnelUnifiedService](#funnelunifiedservice)
2. [UnifiedCRUDService](#unifiedcrudservice)
3. [UnifiedDataService](#unifieddataservice)
4. [ConsolidatedFunnelService](#consolidatedfunnelservice)
5. [IndexedDBService](#indexeddbservice)
6. [Tipos e Interfaces](#tipos-e-interfaces)
7. [Exemplos de Uso](#exemplos-de-uso)

---

## 🎯 FunnelUnifiedService

**Arquivo:** `src/services/FunnelUnifiedService.ts`  
**Tipo:** Singleton  
**Descrição:** Serviço único e centralizado para TODAS as operações de funis com cache inteligente, validação robusta e deep clone automático.

### Características Principais

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Deep clone automático para isolamento de instâncias
- ✅ Cache inteligente com invalidação automática
- ✅ Validação robusta integrada
- ✅ Sincronização entre contextos via eventos
- ✅ Fallbacks automáticos (Supabase → IndexedDB → LocalStorage)
- ✅ Sistema de permissões integrado

### Métodos Públicos

#### `createFunnel(options: CreateFunnelOptions): Promise<UnifiedFunnelData>`

Cria um novo funil com deep clone automático.

**Parâmetros:**
```typescript
interface CreateFunnelOptions {
  name: string;                    // Nome do funil (obrigatório)
  description?: string;             // Descrição do funil
  category?: string;                // Categoria ('quiz' | 'lead-capture' | 'outros')
  context?: FunnelContext;          // Contexto ('editor' | 'preview' | 'admin')
  userId?: string;                  // ID do usuário (obtido automaticamente se omitido)
  templateId?: string;              // ID do template a aplicar
  autoPublish?: boolean;            // Publicar automaticamente após criação
}
```

**Retorno:**
```typescript
interface UnifiedFunnelData {
  id: string;
  name: string;
  description: string;
  category: string;
  context?: FunnelContext;
  userId: string;
  settings: Record<string, any>;
  pages: any[];
  isPublished: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Exemplo:**
```typescript
const funnel = await funnelUnifiedService.createFunnel({
  name: 'Meu Quiz',
  description: 'Quiz de estilo pessoal',
  category: 'quiz',
  context: 'editor',
  templateId: 'quiz21StepsComplete'
});

console.log('Funil criado:', funnel.id);
```

**Comportamento:**
1. Gera ID único
2. Valida dados de entrada
3. Aplica template (se especificado)
4. Salva no Supabase
5. Salva no IndexedDB (cache)
6. Emite evento 'created'
7. Retorna funil com deep clone

**Erros:**
- `Error('Nome do funil é obrigatório')` - Se name vazio
- `Error('Template não encontrado')` - Se templateId inválido
- Erros do Supabase propagados

---

#### `getFunnel(id: string, userId?: string): Promise<UnifiedFunnelData | null>`

Obtém um funil por ID com cache inteligente.

**Parâmetros:**
- `id` (string): ID do funil
- `userId` (string, opcional): ID do usuário para validação de permissões

**Retorno:**
- `UnifiedFunnelData` se encontrado
- `null` se não encontrado

**Exemplo:**
```typescript
const funnel = await funnelUnifiedService.getFunnel('funnel-123');

if (funnel) {
  console.log('Funil encontrado:', funnel.name);
} else {
  console.log('Funil não encontrado');
}
```

**Comportamento:**
1. Verifica cache (TTL: 5 minutos)
2. Se não em cache, busca do Supabase
3. Se Supabase falhar, busca do IndexedDB
4. Se IndexedDB falhar, busca do LocalStorage
5. Valida permissões se userId fornecido
6. Retorna deep clone para isolamento

**Cache:**
- TTL padrão: 5 minutos
- Invalidação automática em updates/deletes
- Estratégia LRU (Least Recently Used)

---

#### `updateFunnel(id: string, updates: UpdateFunnelOptions, userId?: string): Promise<UnifiedFunnelData>`

Atualiza um funil existente.

**Parâmetros:**
```typescript
interface UpdateFunnelOptions {
  name?: string;
  description?: string;
  category?: string;
  settings?: Record<string, any>;
  pages?: any[];
  isPublished?: boolean;
}
```

**Retorno:** `UnifiedFunnelData` atualizado

**Exemplo:**
```typescript
const updated = await funnelUnifiedService.updateFunnel('funnel-123', {
  name: 'Novo Nome',
  isPublished: true,
  settings: {
    theme: 'dark',
    autoSave: true
  }
});

console.log('Funil atualizado:', updated.updatedAt);
```

**Comportamento:**
1. Carrega funil atual
2. Verifica permissões (canEdit)
3. Aplica updates com deep clone
4. Incrementa versão
5. Salva no Supabase
6. Invalida cache
7. Emite evento 'updated'
8. Retorna funil atualizado

**Erros:**
- `Error('Funil não encontrado')` - Se ID inválido
- `Error('Sem permissão para editar')` - Se sem permissão

---

#### `listFunnels(options?: ListFunnelOptions): Promise<UnifiedFunnelData[]>`

Lista funis com filtros e cache inteligente.

**Parâmetros:**
```typescript
interface ListFunnelOptions {
  context?: FunnelContext;          // Filtrar por contexto
  userId?: string;                  // Filtrar por usuário
  category?: string;                // Filtrar por categoria
  isPublished?: boolean;            // Filtrar por status publicação
  limit?: number;                   // Limitar resultados
  offset?: number;                  // Paginação
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}
```

**Retorno:** Array de `UnifiedFunnelData`

**Exemplo:**
```typescript
// Listar todos os quizzes publicados do usuário
const funnels = await funnelUnifiedService.listFunnels({
  userId: 'user-123',
  category: 'quiz',
  isPublished: true,
  sortBy: 'updatedAt',
  sortOrder: 'desc'
});

console.log(`Encontrados ${funnels.length} funis`);
```

**Comportamento:**
1. Monta query com filtros
2. Busca do Supabase
3. Fallback para IndexedDB se falhar
4. Ordena resultados
5. Aplica limit/offset
6. Retorna deep clones

---

#### `duplicateFunnel(id: string, newName?: string, userId?: string): Promise<UnifiedFunnelData>`

Duplica um funil com deep clone total.

**Parâmetros:**
- `id` (string): ID do funil original
- `newName` (string, opcional): Nome da cópia (padrão: "[Original] - Cópia")
- `userId` (string, opcional): ID do usuário

**Retorno:** `UnifiedFunnelData` duplicado

**Exemplo:**
```typescript
const duplicate = await funnelUnifiedService.duplicateFunnel(
  'funnel-123',
  'Minha Cópia Customizada'
);

console.log('Funil duplicado:', duplicate.id);
```

**Comportamento:**
1. Carrega funil original
2. Verifica permissões (canRead)
3. Cria deep clone completo
4. Gera novo ID
5. Define novo nome
6. Reseta timestamps
7. Salva como novo funil
8. Retorna cópia independente

---

#### `deleteFunnel(id: string, userId?: string): Promise<boolean>`

Remove um funil permanentemente.

**Parâmetros:**
- `id` (string): ID do funil
- `userId` (string, opcional): ID do usuário

**Retorno:** `true` se sucesso, `false` se falhou

**Exemplo:**
```typescript
const deleted = await funnelUnifiedService.deleteFunnel('funnel-123');

if (deleted) {
  console.log('Funil deletado com sucesso');
}
```

**Comportamento:**
1. Verifica permissões (canDelete)
2. Deleta do Supabase
3. Deleta do IndexedDB
4. Invalida todo cache relacionado
5. Emite evento 'deleted'
6. Remove referências de páginas

**⚠️ Atenção:** Esta operação é irreversível!

---

### Validação e Permissões

#### `validateFunnel(funnel: UnifiedFunnelData): ValidationResult`

Valida estrutura e dados do funil.

**Retorno:**
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

**Validações:**
- Nome não vazio
- ID único
- Estrutura de páginas válida
- Settings bem formados
- Timestamps válidos

---

#### `checkPermissions(funnelId: string, userId?: string): Promise<FunnelPermissions>`

Verifica permissões do usuário.

**Retorno:**
```typescript
interface FunnelPermissions {
  canRead: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isOwner: boolean;
}
```

---

### Sistema de Eventos

#### `on(event: FunnelEventType, callback: Function): void`

Registra listener para eventos.

**Eventos disponíveis:**
- `'created'` - Funil criado
- `'updated'` - Funil atualizado
- `'deleted'` - Funil deletado
- `'published'` - Funil publicado
- `'unpublished'` - Funil despublicado

**Exemplo:**
```typescript
funnelUnifiedService.on('created', (id, funnel) => {
  console.log('Novo funil criado:', id);
  analytics.track('funnel_created', { funnelId: id });
});
```

---

#### `off(event: FunnelEventType, callback: Function): void`

Remove listener de eventos.

---

### Cache Management

#### `clearCache(): void`

Limpa todo o cache de funis.

**Exemplo:**
```typescript
funnelUnifiedService.clearCache();
console.log('Cache limpo');
```

---

### Instância Singleton

```typescript
// Obter instância única
import { funnelUnifiedService } from '@/services/FunnelUnifiedService';

// Uso direto
const funnel = await funnelUnifiedService.getFunnel('id');

// Via hook (futuro)
const service = useFunnelUnified();
```

---

## 🔧 UnifiedCRUDService

**Arquivo:** `src/services/UnifiedCRUDService.ts`  
**Tipo:** Class  
**Descrição:** Serviço genérico de CRUD com validação, auto-save e histórico de operações.

### Características Principais

- ✅ CRUD genérico para Funnels e Stages
- ✅ Validação automática
- ✅ Auto-save configurável
- ✅ Histórico de operações (últimas 100)
- ✅ Cache em memória
- ✅ Persistência em localStorage

### Métodos de Funnel

#### `getFunnel(id: string): Promise<CRUDResult<UnifiedFunnel>>`

Obtém funil do cache.

**Retorno:**
```typescript
interface CRUDResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  performance?: {
    duration: number;
    cached: boolean;
  };
}
```

**Exemplo:**
```typescript
const result = await crudService.getFunnel('funnel-123');

if (result.success) {
  console.log('Funil:', result.data);
  console.log('Cached:', result.performance?.cached);
} else {
  console.error('Erro:', result.error);
}
```

---

#### `saveFunnel(funnel: UnifiedFunnel): Promise<CRUDResult<UnifiedFunnel>>`

Salva funil com validação automática.

**Comportamento:**
1. Valida e normaliza dados
2. Atualiza timestamp
3. Salva em cache
4. Persiste em localStorage
5. Registra operação
6. Configura auto-save (se habilitado)

**Exemplo:**
```typescript
const result = await crudService.saveFunnel({
  id: 'funnel-123',
  name: 'Meu Funil',
  stages: [],
  settings: { autoSave: true, interval: 30000 }
});
```

---

#### `deleteFunnel(id: string): Promise<CRUDResult<boolean>>`

Deleta funil do cache.

**Comportamento:**
1. Remove do cache
2. Limpa timeout de auto-save
3. Persiste mudanças
4. Registra operação

---

#### `duplicateFunnel(id: string, newName?: string): Promise<CRUDResult<UnifiedFunnel>>`

Duplica funil existente.

---

### Métodos de Stage

#### `addStage(funnelId: string, stage: Partial<UnifiedStage>): Promise<CRUDResult<UnifiedStage>>`

Adiciona stage a um funil.

---

#### `updateStage(funnelId: string, stageId: string, updates: Partial<UnifiedStage>): Promise<CRUDResult<UnifiedStage>>`

Atualiza stage existente.

---

#### `deleteStage(funnelId: string, stageId: string): Promise<CRUDResult<boolean>>`

Remove stage de um funil.

---

### Auto-Save

#### `configureAutoSave(enabled: boolean, interval?: number): void`

Configura auto-save global.

**Parâmetros:**
- `enabled` (boolean): Habilitar/desabilitar
- `interval` (number): Intervalo em ms (padrão: 30000 = 30s)

**Exemplo:**
```typescript
crudService.configureAutoSave(true, 60000); // Auto-save a cada 60s
```

---

### Histórico

#### `getOperationHistory(limit?: number): CRUDOperation[]`

Retorna histórico de operações.

**Retorno:**
```typescript
interface CRUDOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'funnel' | 'stage' | 'block';
  entityId: string;
  timestamp: Date;
  success: boolean;
}
```

---

## 💾 UnifiedDataService

**Arquivo:** `src/services/core/UnifiedDataService.ts`  
**Tipo:** Class Implementation  
**Descrição:** Serviço de dados unificado com integração Supabase.

### Métodos de Funnel

#### `getFunnel(id: string): Promise<UnifiedFunnel | null>`

Busca funil no Supabase.

---

#### `saveFunnel(funnel: Partial<UnifiedFunnel>): Promise<UnifiedFunnel>`

Salva funil no Supabase com upsert.

**Comportamento:**
1. Gera/mantém ID
2. Incrementa versão
3. Atualiza timestamp
4. Faz upsert no Supabase
5. Salva páginas relacionadas

**Exemplo:**
```typescript
const saved = await unifiedDataService.saveFunnel({
  name: 'Meu Funil',
  description: 'Descrição',
  user_id: 'user-123'
});
```

---

#### `deleteFunnel(id: string): Promise<boolean>`

Deleta funil do Supabase.

---

### Analytics & Metrics

#### `getDashboardMetrics(userId?: string): Promise<UnifiedMetrics>`

Obtém métricas do dashboard.

**Retorno:**
```typescript
interface UnifiedMetrics {
  totalFunnels: number;
  publishedFunnels: number;
  draftFunnels: number;
  totalViews: number;
  totalConversions: number;
  conversionRate: number;
}
```

---

#### `getFunnelAnalytics(funnelId: string): Promise<UnifiedAnalytics>`

Obtém analytics de um funil específico.

---

### User Management

#### `getCurrentUser(): Promise<UnifiedUser | null>`

Obtém usuário atual do Supabase Auth.

---

## 🏗️ ConsolidatedFunnelService

**Arquivo:** `src/services/core/ConsolidatedFunnelService.ts`  
**Tipo:** Class extending BaseUnifiedService  
**Descrição:** Serviço consolidado com métricas e health check.

### Funnel Operations

#### `getAllFunnels(): Promise<FunnelData[]>`

Lista todos os funis com cache.

**Cache:** 5 minutos

---

#### `getFunnelById(id: string): Promise<FunnelData | null>`

Busca funil por ID com cache.

---

#### `createFunnel(data: Omit<FunnelData, 'created_at' | 'updated_at'>): Promise<FunnelData>`

Cria funil e limpa cache.

---

### Metrics

#### `getFunnelMetrics(): Promise<FunnelMetrics[]>`

Obtém métricas de todos os funis.

**Retorno:**
```typescript
interface FunnelMetrics {
  funnel_id: string;
  views: number;
  completions: number;
  conversion_rate: number;
}
```

---

#### `getFunnelAnalytics(funnelId: string): Promise<FunnelAnalytics>`

Analytics detalhado de funil específico.

---

### System

#### `healthCheck(): Promise<boolean>`

Verifica saúde do serviço e conexão Supabase.

---

#### `getName(): string`

Retorna nome do serviço.

---

## 💽 IndexedDBService

**Arquivo:** `src/services/storage/IndexedDBService.ts`  
**Tipo:** Singleton  
**Descrição:** Serviço de armazenamento local com IndexedDB.

### Database Management

#### `initDB(): Promise<IDBDatabase>`

Inicializa database com object stores.

**Stores:**
- `funnels` - Armazena funis
- `cache` - Cache geral
- `configurations` - Configurações
- `sync_queue` - Fila de sincronização

---

### CRUD Operations

#### `saveFunnel(funnel: any): Promise<void>`

Salva funil no IndexedDB.

---

#### `getFunnel(id: string): Promise<any | null>`

Obtém funil do IndexedDB.

---

#### `listFunnels(filters?: any): Promise<any[]>`

Lista funis com filtros opcionais.

---

#### `deleteFunnel(id: string): Promise<void>`

Deleta funil do IndexedDB.

---

### Cache Operations

#### `setCache(key: string, value: any, ttl?: number): Promise<void>`

Armazena item em cache com TTL opcional.

---

#### `getCache(key: string): Promise<any | null>`

Obtém item do cache se não expirado.

---

#### `clearCache(): Promise<void>`

Limpa todo o cache.

---

## 📦 Tipos e Interfaces

### UnifiedFunnelData

```typescript
interface UnifiedFunnelData {
  // Identificação
  id: string;
  name: string;
  description: string;
  category: string;
  
  // Contexto e ownership
  context?: FunnelContext;
  userId: string;
  
  // Configurações e estrutura
  settings: Record<string, any>;
  pages: any[];
  
  // Estado
  isPublished: boolean;
  version: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

---

### UnifiedFunnel

```typescript
interface UnifiedFunnel {
  id: string;
  name: string;
  description: string;
  stages: UnifiedStage[];
  settings: FunnelSettings;
  status: 'draft' | 'published' | 'archived';
  version: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  metadata: FunnelMetadata;
}
```

---

### UnifiedStage

```typescript
interface UnifiedStage {
  id: string;
  title: string;
  type: string;
  order: number;
  blocks: UnifiedBlock[];
  settings: StageSettings;
}
```

---

### FunnelPermissions

```typescript
interface FunnelPermissions {
  canRead: boolean;    // Pode visualizar
  canEdit: boolean;    // Pode editar
  canDelete: boolean;  // Pode deletar
  isOwner: boolean;    // É o dono
}
```

---

## 📝 Exemplos de Uso

### Exemplo 1: Criar e Publicar Funil

```typescript
import { funnelUnifiedService } from '@/services/FunnelUnifiedService';

async function createAndPublishFunnel() {
  // 1. Criar funil
  const funnel = await funnelUnifiedService.createFunnel({
    name: 'Quiz de Estilo Pessoal',
    description: 'Descubra seu estilo único',
    category: 'quiz',
    templateId: 'quiz21StepsComplete',
    context: 'editor'
  });
  
  console.log('Funil criado:', funnel.id);
  
  // 2. Adicionar configurações
  const updated = await funnelUnifiedService.updateFunnel(funnel.id, {
    settings: {
      theme: 'modern',
      autoSave: true,
      saveInterval: 30000
    }
  });
  
  // 3. Publicar
  const published = await funnelUnifiedService.updateFunnel(funnel.id, {
    isPublished: true
  });
  
  console.log('Funil publicado:', published.isPublished);
}
```

---

### Exemplo 2: Listar Funis do Usuário

```typescript
async function listUserFunnels(userId: string) {
  const funnels = await funnelUnifiedService.listFunnels({
    userId,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });
  
  console.log(`Encontrados ${funnels.length} funis`);
  
  funnels.forEach(funnel => {
    console.log(`- ${funnel.name} (${funnel.category})`);
    console.log(`  Status: ${funnel.isPublished ? 'Publicado' : 'Rascunho'}`);
    console.log(`  Atualizado: ${funnel.updatedAt.toLocaleDateString()}`);
  });
}
```

---

### Exemplo 3: Duplicar e Modificar

```typescript
async function duplicateAndModify(originalId: string) {
  // 1. Duplicar
  const duplicate = await funnelUnifiedService.duplicateFunnel(
    originalId,
    'Cópia para Teste'
  );
  
  console.log('Duplicado:', duplicate.id);
  
  // 2. Modificar cópia
  const modified = await funnelUnifiedService.updateFunnel(duplicate.id, {
    description: 'Versão de teste',
    settings: {
      ...duplicate.settings,
      testMode: true
    }
  });
  
  return modified;
}
```

---

### Exemplo 4: Validação e Error Handling

```typescript
async function safeFunnelOperation() {
  try {
    const funnel = await funnelUnifiedService.createFunnel({
      name: '',  // ❌ Nome vazio - vai falhar
      category: 'quiz'
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro:', error.message);
      
      if (error.message.includes('obrigatório')) {
        // Tratar erro de validação
        console.log('Por favor, forneça um nome válido');
      }
    }
  }
}
```

---

### Exemplo 5: Eventos e Sincronização

```typescript
// Listener para sincronização entre abas
funnelUnifiedService.on('updated', (id, funnel) => {
  console.log('Funil atualizado externamente:', id);
  
  // Recarregar UI se for o funil atual
  if (currentFunnelId === id) {
    reloadFunnelData();
  }
});

// Listener para analytics
funnelUnifiedService.on('published', (id, funnel) => {
  analytics.track('funnel_published', {
    funnelId: id,
    funnelName: funnel.name,
    category: funnel.category
  });
});
```

---

### Exemplo 6: UnifiedCRUDService com Auto-Save

```typescript
import { UnifiedCRUDService } from '@/services/UnifiedCRUDService';

const crudService = new UnifiedCRUDService();

// Configurar auto-save
crudService.configureAutoSave(true, 60000); // 60 segundos

// Salvar funnel
const result = await crudService.saveFunnel({
  id: 'funnel-123',
  name: 'Meu Funil',
  stages: [],
  settings: { autoSave: true }
});

if (result.success) {
  console.log('Salvo com sucesso');
  console.log('Performance:', result.performance);
}

// Obter histórico
const history = crudService.getOperationHistory(10);
console.log('Últimas 10 operações:', history);
```

---

## 🔍 Troubleshooting

### Problema: Funil não encontrado

**Causa:** ID inválido ou funil deletado  
**Solução:**
```typescript
const funnel = await funnelUnifiedService.getFunnel(id);
if (!funnel) {
  console.error('Funil não existe');
  // Redirecionar para lista ou criar novo
}
```

---

### Problema: Erro de permissão

**Causa:** Usuário não tem permissão para operação  
**Solução:**
```typescript
const permissions = await funnelUnifiedService.checkPermissions(id, userId);
if (!permissions.canEdit) {
  console.error('Sem permissão para editar');
  // Mostrar mensagem ao usuário
}
```

---

### Problema: Cache desatualizado

**Causa:** Cache não invalidado após update externo  
**Solução:**
```typescript
// Forçar limpeza de cache
funnelUnifiedService.clearCache();

// Ou invalidar cache específico
const funnel = await funnelUnifiedService.getFunnel(id, undefined, {
  skipCache: true
});
```

---

## 📚 Recursos Adicionais

### Links Internos
- [Arquitetura Completa](../architecture/ARQUITETURA_COMPLETA_ANALISE_2025.md)
- [Guia de Integração](../guides/GUIA_SISTEMA_CONSOLIDADO.md)
- [Relatório Sprint 1](../reports/SPRINT1_STATUS_CONSOLIDADO.md)

### Código Fonte
- [FunnelUnifiedService.ts](../../src/services/FunnelUnifiedService.ts)
- [UnifiedCRUDService.ts](../../src/services/UnifiedCRUDService.ts)
- [IndexedDBService.ts](../../src/services/storage/IndexedDBService.ts)

---

**Documento gerado para Sprint 1 - Task 4**  
**Versão:** 1.0.0  
**Data:** 10 de Outubro de 2025
