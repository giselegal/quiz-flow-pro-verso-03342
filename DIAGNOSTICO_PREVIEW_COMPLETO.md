# 🔍 DIAGNÓSTICO COMPLETO - PREVIEW DO EDITOR

**Data:** 15 de outubro de 2025  
**Status:** ✅ Código estruturalmente correto, possível problema de dados/estado

---

## 📊 Resumo Executivo

### ✅ O Que Está Funcionando:

1. **Arquitetura dos Componentes**
   - ✅ `LivePreviewContainer` e `LiveRuntimePreview` definidos inline no editor
   - ✅ Imports corretos de `QuizRuntimeRegistryProvider`, `useQuizRuntimeRegistry`, `QuizAppConnected`
   - ✅ Função `editorStepsToRuntimeMap` encontrada e usada

2. **Proteções Contra Loop**
   - ✅ Proteção por hash (compara keys do runtimeMap)
   - ✅ Debounce de 400ms para steps
   - ✅ Detector de loop (limite de 10 updates)
   - ✅ Usa `useMemo` (12 vezes) e `React.memo` (2 vezes)

3. **Correções Aplicadas**
   - ✅ `useComponentConfiguration` tem `definitionLoadedRef`
   - ✅ `componentDefinition` NÃO está nas dependências do useCallback
   - ✅ Normalização de cores (#rrggbbaa → #rrggbb)

### ⚠️ Possíveis Causas do Problema:

1. **Múltiplos Hooks de Configuração**
   - `QuizAppConnected` usa **4x** `useComponentConfiguration`
   - Isso pode causar muitos fetches simultâneos
   - **Solução:** Consolidar ou cachear melhor

2. **Dados do Runtime**
   - Se `editorStepsToRuntimeMap` retornar dados vazios/incorretos, o preview ficará em branco
   - **Solução:** Verificar logs e estrutura dos dados

3. **Estado Inicial**
   - Se os `steps` iniciais estiverem vazios, o preview não renderiza
   - **Solução:** Garantir que steps são carregados antes do preview

---

## 🧪 Testes Executados

| Teste | Resultado | Detalhes |
|-------|-----------|----------|
| Arquivos críticos | ✅ PASSOU | Todos os arquivos encontrados |
| Imports/Exports | ✅ PASSOU | Todos corretos |
| QuizRuntimeRegistry | ✅ PASSOU | Providers exportados |
| QuizAppConnected | ⚠️ AVISO | 4x useComponentConfiguration |
| Proteção contra loop | ✅ PASSOU | Hash, debounce, limite |
| Memoização | ✅ PASSOU | useMemo e React.memo usados |
| editorStepsToRuntimeMap | ✅ PASSOU | Função encontrada |

---

## 🔍 Diagnóstico Detalhado

### 1. Estrutura do Preview

```
QuizModularProductionEditor
  └─ LivePreviewContainer (inline, React.memo)
      ├─ Modo Production
      │   └─ QuizProductionPreview
      └─ Modo Live
          └─ QuizRuntimeRegistryProvider
              └─ LiveRuntimePreview (inline, React.memo)
                  └─ QuizAppConnected
                      ├─ useComponentConfiguration (quiz-global-config)
                      ├─ useComponentConfiguration (quiz-theme-config)
                      ├─ useComponentConfiguration (quiz-step-X) [2x]
                      └─ QuizApp (renderização final)
```

### 2. Fluxo de Dados

```
Editor State (steps)
  ↓ (debounce 400ms)
debouncedSteps
  ↓ (useMemo)
runtimeMap (via editorStepsToRuntimeMap)
  ↓ (useEffect com hash check)
setSteps(runtimeMap) → QuizRuntimeRegistry
  ↓
QuizAppConnected
  ↓ (4x useComponentConfiguration)
ConfigurationAPI.getConfiguration()
  ↓
Preview renderizado
```

### 3. Proteções Implementadas

**A. Hash Protection (LiveRuntimePreview)**
```typescript
const currentHash = JSON.stringify(Object.keys(runtimeMap).sort());
if (currentHash !== lastUpdateRef.current) {
    // Só atualiza se mudou
    setSteps(runtimeMap);
}
```

**B. Loop Detector**
```typescript
if (updateCountRef.current > 10) {
    console.error('❌ LOOP DETECTADO! Abortando.');
    return;
}
```

**C. Debounce de Steps**
```typescript
React.useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSteps(steps), 400);
    return () => window.clearTimeout(timeout);
}, [steps]);
```

**D. Memoização**
```typescript
const runtimeMap = React.useMemo(() => {
    return editorStepsToRuntimeMap(steps);
}, [steps]);
```

---

## 🐛 Possíveis Problemas e Soluções

### Problema 1: Preview em Branco

**Sintomas:**
- Coluna de preview aparece, mas está vazia
- Nenhum erro no console
- Logs mostram "Recalculando runtimeMap" mas nada renderiza

**Causas Possíveis:**
1. `editorStepsToRuntimeMap` retorna objeto vazio
2. `QuizAppConnected` não consegue carregar as configurações
3. Steps iniciais estão vazios ou em formato incorreto

**Como Diagnosticar:**
```javascript
// No console do navegador:
console.log('Steps:', steps);
console.log('RuntimeMap:', runtimeMap);
console.log('Registry:', QuizRuntimeRegistry.getSteps());
```

**Soluções:**
- Verificar se `steps` têm dados válidos
- Verificar se `editorStepsToRuntimeMap` mapeia corretamente
- Verificar se `ConfigurationAPI` retorna configurações válidas

---

### Problema 2: Loop Infinito Retornou

**Sintomas:**
- Logs "🔄 Recalculando runtimeMap" repetem indefinidamente
- CPU alta
- Navegador trava

**Causas Possíveis:**
1. `runtimeMap` muda a cada render (sem memoização)
2. `setSteps` causa rerender que muda `steps` que muda `runtimeMap`
3. `useComponentConfiguration` ainda tem loop

**Como Diagnosticar:**
```javascript
// Procurar no console:
// - Contador de renders subindo indefinidamente
// - Hash mudando a cada check
```

**Soluções:**
- Verificar se `useMemo` de `runtimeMap` está funcionando
- Verificar se `definitionLoadedRef` está resetando corretamente
- Adicionar mais logs para identificar onde o loop começa

---

### Problema 3: Múltiplos Fetches de Configuração

**Sintomas:**
- Logs "📥 GET Configuration" aparecem muitas vezes
- Lentidão no carregamento
- CPU média/alta

**Causas Possíveis:**
- `QuizAppConnected` usa 4x `useComponentConfiguration`
- Cada hook faz fetch independente
- Cache não está funcionando adequadamente

**Como Diagnosticar:**
```javascript
// Contar logs no console:
// - Quantos "Loading configuration" aparecem?
// - Eles aparecem de forma repetida ou apenas no início?
```

**Soluções:**
1. **Consolidar hooks** - Criar um único hook que carrega todas as configs
2. **Melhorar cache** - `ConfigurationAPI` deve cachear mais agressivamente
3. **Lazy loading** - Carregar configs apenas quando necessário

---

## 🔧 Scripts de Teste Criados

### 1. `/scripts/diagnose-preview-error.sh`
- Testa arquivos críticos
- Verifica imports/exports
- Procura erros comuns
- Verifica servidor

**Uso:**
```bash
./scripts/diagnose-preview-error.sh
```

### 2. `/scripts/diagnose-preview-detailed.cjs`
- Análise profunda do código
- Verifica padrões problemáticos
- Conta useEffect/useState
- Procura objetos inline

**Uso:**
```bash
node scripts/diagnose-preview-detailed.cjs
```

### 3. `/scripts/test-preview-specific.sh`
- Testa componentes inline
- Verifica proteções contra loop
- Analisa QuizAppConnected
- Verifica logs de debug

**Uso:**
```bash
./scripts/test-preview-specific.sh
```

---

## 📋 Checklist de Debug Manual

### Passo 1: Verificar Servidor
- [ ] Servidor rodando em http://localhost:5173
- [ ] Rota `/editor` retorna 200 OK
- [ ] Sem erros de build no terminal

### Passo 2: Abrir o Editor
- [ ] Navegar para http://localhost:5173/editor
- [ ] Ou http://localhost:5173/editor/quiz21StepsComplete-[funnelId]
- [ ] Página carrega sem erros

### Passo 3: Abrir Console do Navegador (F12)
- [ ] Sem erros em vermelho
- [ ] Procurar por logs:
  - `🔄 Recalculando runtimeMap` (deve aparecer 1-2x)
  - `✅ Atualizando Live preview registry` (deve aparecer 1-2x)
  - `🔄 Loading configuration` (1-2x por componente)

### Passo 4: Verificar Preview Visualmente
- [ ] Coluna de preview aparece
- [ ] Preview mostra conteúdo (não está em branco)
- [ ] Preview atualiza quando você edita no canvas
- [ ] Sem lentidão ou travamentos

### Passo 5: Testar Interações
- [ ] Selecionar outro step
- [ ] Preview atualiza para o step selecionado
- [ ] Editar um bloco
- [ ] Preview atualiza após debounce (~400ms)

### Passo 6: Verificar Estado no Console
```javascript
// Copie e cole no console do navegador:

// Verificar steps
console.log('Steps no editor:', window.__QUIZ_EDITOR_STEPS__);

// Verificar runtimeMap
console.log('Runtime registry:', QuizRuntimeRegistry?.getSteps?.());

// Verificar configurações
console.log('Configurações:', ConfigurationAPI?.getInstance?.());
```

---

## 💡 Recomendações de Melhorias

### Curto Prazo (Correções Imediatas):

1. **Consolidar Hooks de Configuração**
   ```typescript
   // Em vez de 4x useComponentConfiguration no QuizAppConnected,
   // criar um único hook que carrega todas as configs de uma vez
   const { globalConfig, themeConfig, stepConfig } = useQuizConfigurations({
       funnelId,
       stepId
   });
   ```

2. **Melhorar Cache da ConfigurationAPI**
   ```typescript
   // Implementar TTL e memoização mais agressiva
   private cache = new Map<string, { data: any, timestamp: number }>();
   private TTL = 5000; // 5 segundos
   ```

3. **Adicionar Logs de Debug Condicionais**
   ```typescript
   const DEBUG = import.meta.env.DEV && window.__QUIZ_DEBUG__;
   if (DEBUG) {
       console.log('🔄 Recalculando runtimeMap...');
   }
   ```

### Médio Prazo (Otimizações):

1. **Lazy Loading de Configurações**
   - Carregar configs apenas quando necessário
   - Não carregar todas as steps de uma vez

2. **Virtual Scrolling no Preview**
   - Se há muitas steps, renderizar apenas as visíveis

3. **Web Workers para editorStepsToRuntimeMap**
   - Processar conversão em background thread

### Longo Prazo (Refatoração):

1. **Migrar para Zustand/Jotai**
   - Estado mais previsível e performático
   - Menos rerenders

2. **Implementar React Server Components**
   - SSR do preview para melhor performance

3. **Criar Sistema de Eventos**
   - Pub/sub para atualizações do preview
   - Desacoplar editor de preview

---

## ✅ Conclusão

**Status Atual:** ✅ **Código Estruturalmente Correto**

O código do preview está bem arquitetado com:
- ✅ Proteções contra loop (hash, debounce, limite)
- ✅ Memoização adequada (useMemo, React.memo)
- ✅ Correções aplicadas (definitionLoadedRef, normalização de cores)

**Próximos Passos:**

1. **Teste Manual** - Abrir o editor e verificar console
2. **Verificar Dados** - Garantir que `steps` e `runtimeMap` têm dados
3. **Otimizar Fetches** - Consolidar `useComponentConfiguration`

Se o preview ainda não funcionar, o problema está provavelmente em:
- Dados iniciais vazios ou incorretos
- ConfigurationAPI não retornando dados
- editorStepsToRuntimeMap mapeando incorretamente

---

**Documentos Relacionados:**
- `CORREÇÕES_APLICADAS.md` - Correções do loop de configuração
- `GUIA_DE_TESTE.md` - Guia de testes manuais
- `CORREÇÕES_SUCESSO.md` - Resumo executivo das correções
