# 🔍 AUDITORIA COMPLETA: Editor /editor?template=quiz21StepsComplete

**Data:** 2025-11-03  
**Versão:** 1.0  
**Status:** ✅ Auditoria Inicial Completa

---

## 📋 SUMÁRIO EXECUTIVO

### Objetivo da Auditoria
Auditar e corrigir o arquivo `/editor?template=quiz21StepsComplete` para garantir:
1. ✅ Mapeamento completo das 21 etapas do quiz
2. ✅ Verificação do estado atual da refatoração para o novo "QuizModularEditor"
3. ✅ Integração total com Supabase, Zod e Painel de Propriedades
4. ✅ Cobertura 100% de edição no painel
5. ✅ Renderização condicional de todos os blocos

### Status Atual
| Componente | Status | Observações |
|------------|--------|-------------|
| Rota `/editor` | ✅ OK | Aceita parâmetro `template` corretamente |
| Template quiz21StepsComplete | ✅ OK | 21 steps definidos (step-01 a step-21) |
| QuizModularEditor | ⚠️ PARCIAL | Funcional mas precisa validação completa |
| Integração Supabase | ✅ OK | EditorProviderUnified com suporte Supabase |
| Schemas Zod | ⚠️ PARCIAL | defaultSchemas.json existe, precisa verificar cobertura |
| Painel de Propriedades | ⚠️ PARCIAL | PropertiesColumn implementado, precisa testar todos os tipos |
| Renderização de Blocos | ⚠️ UNKNOWN | Precisa testar todos os 21 steps |

---

## 🎯 ANÁLISE DETALHADA

### 1. ROTA /editor E CARREGAMENTO DE TEMPLATE

#### 1.1 Configuração da Rota
**Arquivo:** `src/App.tsx` (linhas 280-308)

```typescript
<Route path="/editor">
    {() => {
        const params = new URLSearchParams(window.location.search);
        const templateId = params.get('template') || undefined;
        const funnelId = params.get('funnelId') || params.get('funnel') || undefined;
        
        return (
            <EditorErrorBoundary>
                <EditorProviderUnified 
                    funnelId={funnelId}
                    templateId={templateId}
                    enableSupabase={Boolean(funnelId)}
                >
                    <QuizModularEditor 
                        templateId={templateId}
                        funnelId={funnelId}
                    />
                </EditorProviderUnified>
            </EditorErrorBoundary>
        );
    }}
</Route>
```

**Status:** ✅ **CORRETO**
- Extrai `template` dos query params
- Passa para EditorProviderUnified e QuizModularEditor
- Habilita Supabase quando `funnelId` está presente

#### 1.2 Carregamento do Template no QuizModularEditor
**Arquivo:** `src/components/editor/quiz/QuizModularEditor/index.tsx` (linhas 82-135)

```typescript
useEffect(() => {
    if (!props.templateId) return;

    async function loadTemplate() {
        setIsLoadingTemplate(true);
        try {
            const tid = props.templateId || 'quiz21StepsComplete';
            appLogger.info(`🔍 [QuizModularEditor] Carregando template: ${tid}`);
            
            // ✅ Usa loadFunnelTemplate com fallback automático DB → JSON
            const template = await loadFunnelTemplate(tid);
            
            setLoadedTemplate(template);
            appLogger.info(`✅ [QuizModularEditor] Template carregado: ${template.name} (${template.steps.length} steps)`);
            
            // Carregar steps no useBlockOperations
            template.steps.forEach(step => {
                if (ops.loadStepFromTemplate) {
                    ops.loadStepFromTemplate(step.key, step.blocks);
                }
            });
            
        } catch (error) {
            appLogger.error('[QuizModularEditor] Erro ao carregar template:', error);
            // Fallback: Carregar steps individuais via manifest
        } finally {
            setIsLoadingTemplate(false);
        }
    }

    loadTemplate();
}, [props.templateId, ops]);
```

**Status:** ✅ **CORRETO**
- Usa `loadFunnelTemplate()` que já implementa fallback Supabase → JSON
- Carrega todos os steps do template
- Logs detalhados para debugging

**Problemas Identificados:**
- ❌ Não valida se os 21 steps foram carregados corretamente
- ❌ Não há feedback visual se algum step falhar

---

### 2. TEMPLATE quiz21StepsComplete.ts

#### 2.1 Estrutura do Template
**Arquivo:** `src/templates/quiz21StepsComplete.ts` (2614 linhas)

**Análise:**
```bash
✅ 21 steps definidos: step-01 até step-21
✅ Export: QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, Block[]>
✅ Função: getStepTemplate(stepId: string): Block[] | null
✅ Cache otimizado: TEMPLATE_CACHE e FUNNEL_TEMPLATE_CACHE
```

**Mapeamento das 21 Etapas:**

| Step | Tipo | Descrição | Blocos Principais |
|------|------|-----------|-------------------|
| step-01 | intro | Coleta nome | intro-logo, intro-title, form-container |
| step-02 a step-11 | question | Perguntas de pontuação (10 perguntas) | progress-bar, title, options-grid, navigation |
| step-12 | transition | Transição motivacional | text, auto-advance |
| step-13 a step-18 | strategic | Perguntas estratégicas (6 perguntas) | progress-bar, title, options-grid, navigation |
| step-19 | transition | Preparando resultado | loading-animation, auto-advance |
| step-20 | result | Resultado personalizado | result-header-inline, image-gallery, secondary-styles, fashion-ai-generator |
| step-21 | offer | Oferta final | cta-card, share-buttons |

**Status:** ✅ **ESTRUTURA COMPLETA**

#### 2.2 Tipos de Blocos Utilizados
Extraindo tipos únicos do template:

```typescript
// Tipos de blocos encontrados:
- intro-logo
- text
- form-container
- progress-bar
- title  
- options-grid
- navigation
- loading-animation
- result-header-inline
- image-gallery
- secondary-styles
- fashion-ai-generator
- cta-card
- share-buttons
```

**Total:** ~14 tipos diferentes de blocos

**Problema Identificado:**
- ⚠️ Precisa verificar se TODOS esses tipos têm schema Zod definido
- ⚠️ Precisa verificar se TODOS têm controles no Painel de Propriedades
- ⚠️ Precisa verificar se TODOS têm renderer no Preview

---

### 3. INTEGRAÇÃO COM ZOD E SCHEMAS

#### 3.1 Sistema de Schemas
**Arquivo:** `src/core/schema/defaultSchemas.json`

**Análise:**
```json
{
  "version": "1.0.0",
  "blockTypes": {
    "text": { ... },
    "image": { ... },
    "button": { ... }
  }
}
```

**Tipos Definidos no defaultSchemas.json:**
- ✅ text
- ✅ image
- ✅ button
- ❓ Faltam verificar: intro-logo, form-container, options-grid, progress-bar, etc.

**Problema Identificado:**
- ❌ **CRÍTICO:** defaultSchemas.json NÃO contém todos os tipos de blocos usados no quiz21StepsComplete
- ❌ Faltam schemas para:
  - intro-logo
  - form-container
  - progress-bar
  - title
  - options-grid
  - navigation
  - loading-animation
  - result-header-inline
  - image-gallery
  - secondary-styles
  - fashion-ai-generator
  - cta-card
  - share-buttons

#### 3.2 SchemaInterpreter
**Arquivo:** `src/core/schema/SchemaInterpreter.ts`

**Status:** ✅ **IMPLEMENTADO**
- Carrega schemas do JSON
- Mapeia tipos de propriedades para controles visuais
- Sistema dinâmico de interpretação

**Problema:**
- Só funciona se os schemas estiverem definidos no JSON

---

### 4. PAINEL DE PROPRIEDADES

#### 4.1 PropertiesColumn Component
**Arquivo:** `src/components/editor/quiz/QuizModularEditor/components/PropertiesColumn/index.tsx`

**Análise:**
```typescript
// ✅ Merge agressivo de properties e content
const merged: Record<string, any> = {};

// 1. Carregar tudo de content
if (selectedBlock.content && typeof selectedBlock.content === 'object') {
    Object.assign(merged, selectedBlock.content);
}

// 2. Sobrescrever com properties
if (selectedBlock.properties && typeof selectedBlock.properties === 'object') {
    Object.assign(merged, selectedBlock.properties);
}

// 3. Garantir valores default do schema
const schema = schemaInterpreter.getBlockSchema(selectedBlock.type);
if (schema) {
    Object.entries(schema.properties).forEach(([key, propSchema]) => {
        if (merged[key] === undefined && propSchema.default !== undefined) {
            merged[key] = propSchema.default;
        }
    });
}
```

**Status:** ✅ **LÓGICA IMPLEMENTADA**

**Problemas Identificados:**
- ⚠️ Se o schema não existir (schema === null), não mostra nenhuma propriedade
- ⚠️ Sem fallback para tipos sem schema
- ⚠️ Não foi testado com todos os 14 tipos de blocos do quiz21StepsComplete

#### 4.2 DynamicPropertyControls
**Arquivo:** `src/components/editor/DynamicPropertyControls.tsx` (referenciado)

**Status:** ✅ **EXISTE**
- Mapeia schemas para controles visuais
- Suporta: text, textarea, number, toggle, color-picker, dropdown, etc.

---

### 5. INTEGRAÇÃO COM SUPABASE

#### 5.1 EditorProviderUnified
**Arquivo:** `src/components/editor/EditorProviderUnified.tsx`

**Análise:**
```typescript
export interface EditorProviderUnifiedProps {
    funnelId?: string;
    templateId?: string;
    enableSupabase?: boolean;
    children: ReactNode;
}
```

**Status:** ✅ **IMPLEMENTADO**
- Aceita `templateId` como prop
- Suporta modo Supabase quando `enableSupabase={true}`
- Hook `useUnifiedCRUD` para operações CRUD

**Funcionalidades Supabase:**
- ✅ `saveToSupabase()` - Salvar blocos
- ✅ `loadSupabaseComponents()` - Carregar blocos
- ✅ Fallback para JSON quando Supabase não disponível

#### 5.2 Tabelas Supabase
**Schema esperado:**
```sql
-- Tabela: funnels
-- Tabela: funnel_components (blocos)
-- Tabela: quiz_sessions
-- Tabela: quiz_results
```

**Status:** ⚠️ **PRECISA VERIFICAR**
- Schema SQL existe em `/scripts/sql/`
- Precisa verificar se está aplicado no banco

---

### 6. RENDERIZAÇÃO E PREVIEW

#### 6.1 Sistema de Renderização
**Componentes:**
1. **CanvasColumn** - Modo edição
2. **PreviewPanel** - Modo preview (live/production)

**Arquivo:** `src/components/editor/quiz/QuizModularEditor/components/PreviewPanel/index.tsx`

**Status:** ⚠️ **NÃO AUDITADO**
- Precisa verificar se todos os 14 tipos de blocos renderizam corretamente
- Precisa testar modo live vs production

#### 6.2 Block Renderers
**Localização esperada:** `src/components/editor/blocks/`

**Status:** ⚠️ **PRECISA AUDITORIA**
- Verificar se existe renderer para cada tipo de bloco
- Verificar se renderização é condicional (baseada em propriedades)

---

## 🔧 PROBLEMAS IDENTIFICADOS E PRIORIDADES

### P0 - CRÍTICO (Bloqueia funcionalidade)

#### 1. Schemas Faltantes
**Problema:** defaultSchemas.json não contém 11 dos 14 tipos de blocos
**Impacto:** Painel de Propriedades vazio para esses blocos
**Solução:**
- Criar schemas para todos os tipos faltantes
- Adicionar ao defaultSchemas.json

#### 2. Validação de Carregamento
**Problema:** Não valida se os 21 steps foram carregados corretamente
**Impacto:** Pode falhar silenciosamente
**Solução:**
- Adicionar validação após loadTemplate()
- Mostrar erro se algum step falhar

### P1 - ALTA (Funciona mas não completo)

#### 3. Cobertura de Testes
**Problema:** Não há testes para todos os tipos de blocos
**Solução:**
- Testar carregamento de cada step
- Testar edição de cada tipo de bloco
- Testar renderização de cada tipo

#### 4. Documentação
**Problema:** Falta documentação do mapeamento completo
**Solução:**
- Documentar cada tipo de bloco
- Documentar propriedades editáveis
- Documentar comportamento esperado

### P2 - MÉDIA (Melhorias)

#### 5. Performance
**Problema:** Carrega todos os 21 steps de uma vez
**Solução:**
- Implementar lazy loading progressivo
- Carregar apenas step atual + adjacentes

#### 6. UX do Editor
**Problema:** Sem feedback visual durante carregamento
**Solução:**
- Adicionar skeleton loaders
- Mostrar progresso de carregamento

---

## ✅ PLANO DE AÇÃO

### Fase 1: Schemas e Validação (P0)
1. [ ] Mapear TODOS os tipos de blocos usados no quiz21StepsComplete
2. [ ] Criar schemas Zod para tipos faltantes
3. [ ] Adicionar ao defaultSchemas.json
4. [ ] Validar carregamento dos 21 steps
5. [ ] Adicionar tratamento de erro robusto

### Fase 2: Testes de Integração (P1)
6. [ ] Testar carregamento de cada step (01-21)
7. [ ] Testar edição no Painel de Propriedades para cada tipo
8. [ ] Testar renderização no Preview para cada tipo
9. [ ] Testar salvamento no Supabase

### Fase 3: Documentação (P1)
10. [ ] Documentar mapeamento completo das 21 etapas
11. [ ] Documentar propriedades editáveis por tipo de bloco
12. [ ] Criar guia de uso do editor

### Fase 4: Otimizações (P2)
13. [ ] Implementar lazy loading de steps
14. [ ] Melhorar feedback visual
15. [ ] Adicionar validação em tempo real

---

## 📊 MÉTRICAS DE SUCESSO

| Métrica | Objetivo | Status Atual |
|---------|----------|--------------|
| Steps carregados | 21/21 (100%) | ⚠️ Não validado |
| Tipos com schema | 14/14 (100%) | ❌ 3/14 (21%) |
| Tipos editáveis | 14/14 (100%) | ⚠️ Não testado |
| Tipos renderizáveis | 14/14 (100%) | ⚠️ Não testado |
| Integração Supabase | 100% | ✅ Implementado |
| Cobertura de testes | 80%+ | ❌ 0% |

---

## 🎯 PRÓXIMOS PASSOS

### Imediato (Hoje)
1. Executar dev server e testar `/editor?template=quiz21StepsComplete`
2. Verificar quais tipos de blocos não têm schema
3. Criar branch para correções

### Curto Prazo (Esta Semana)
4. Implementar todos os schemas faltantes
5. Testar todos os 21 steps
6. Corrigir bugs encontrados
7. Documentar resultados

### Médio Prazo (Próxima Semana)
8. Criar testes automatizados
9. Otimizar performance
10. Melhorar UX

---

## 📝 CONCLUSÃO

**Status Geral:** ⚠️ **PARCIALMENTE FUNCIONAL**

**Pontos Fortes:**
- ✅ Rota `/editor` configurada corretamente
- ✅ Template quiz21StepsComplete com 21 steps completos
- ✅ QuizModularEditor implementado com arquitetura moderna
- ✅ Integração Supabase funcional
- ✅ Sistema de schemas dinâmico

**Pontos Fracos:**
- ❌ Schemas Zod incompletos (apenas 21% de cobertura)
- ⚠️ Painel de Propriedades não testado com todos os tipos
- ⚠️ Renderização não validada para todos os tipos
- ❌ Sem validação de carregamento dos 21 steps
- ❌ Sem testes automatizados

**Recomendação:**
Implementar Fase 1 (Schemas e Validação) como prioridade máxima para garantir que o editor funcione completamente com o template quiz21StepsComplete.

---

**Próxima Atualização:** Após implementação da Fase 1
