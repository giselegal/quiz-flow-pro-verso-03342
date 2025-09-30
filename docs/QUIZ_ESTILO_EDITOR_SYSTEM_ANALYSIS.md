# Análise Sistêmica: Funil /quiz-estilo e Edição no /editor

## 1. Estrutura do Funil `/quiz-estilo`
- Rota: `/quiz-estilo` → `QuizEstiloPessoalPage`
- Estado (exemplo `useQuizState`):
```ts
interface QuizState {
  currentStep: string;              // "step-1" ... "step-21"
  answers: Record<string, string[]>;
  scores: QuizScores;               // 8 estilos
  userProfile: UserProfile;
}
```
- Sequência de 21 etapas:
  1. Introdução + nome
  2–11. 10 questões pontuadas
  12. Transição
  13–18. 6 questões estratégicas (cálculo incremental)
  19. Transição para resultado
  20. Página de resultados (principal + secundários)
  21. Página de oferta
- Estilos (pontuação): Natural, Clássico, Contemporâneo, Elegante, Romântico, Sexy, Dramático, Criativo.

## 2. Estrutura do Editor Unificado `/editor`
- Rota: `/editor` (parâmetros: `?template=quiz21StepsComplete` ou funnel específico)
- Provider principal (desejado): `EditorProvider` (`src/components/editor/EditorProvider.tsx`)
- Estado central:
```ts
interface EditorState {
  stepBlocks: Record<string, Block[]>; // "step-1": [...]
  currentStep: number;                 // 1..21
  selectedBlockId: string | null;
  stepValidation: Record<number, boolean>;
  isSupabaseEnabled: boolean;
  databaseMode: 'local' | 'supabase';
  isLoading: boolean;
}
interface Block { id: string; type: BlockType; order: number; content: any; properties: any; }
```

## 3. Fluxo de Dados: Quiz → Editor
- Fonte primária: `QUIZ_STYLE_21_STEPS_TEMPLATE` (objeto steps → blocks)
- Conversão: flatten + enrich (stepId, stepNumber, order composto)
- Formato de destino: `stepBlocks` para o editor (mantém agrupamento por step)
- Diferença semântica atual: Quiz usa `currentStep` como string (`"step-7"`), Editor usa número (`7`).

## 4. Problemas Críticos
| Problema | Impacto | Causa | Observação |
|----------|---------|-------|------------|
| Duplicação de Providers | Alto | Adapter + Modern | Diverge estado e APIs |
| Navegação Fragmentada | Médio | Hooks múltiplos | Estados divergentes (string vs número) |
| Conversão Inconsistente | Médio | Falta de adaptador central | Lógica repetida em arquivo monolítico |
| Persistência Multifonte | Médio | LocalStorage + Supabase sem coordenação | Risco de drift |
| Monólito `ModernUnifiedEditor` | Alto | Muitas responsabilidades | Dificulta manutenção e testes |

## 5. Persistência
- Supabase (tabelas: `funnels`, `funnel_pages`, `components`).
- LocalStorage chaves observadas: `quiz-editor-state`, `funnel-{id}-data`, `quiz-answers-{sessionId}`.
- Necessidade: Normalizar fronteira (Editor <-> Backend) via serviço de sincronização.

## 6. Fluxo de Edição (Visão Consolidada)
1. Abertura `/editor?template=quiz21StepsComplete`
2. Carregamento template → conversão → `stepBlocks`
3. Usuário navega / altera blocos (editor state)
4. (Futuro) Sincronização incremental com Supabase
5. Exportação / Publicação → Funil refletido em `/quiz-estilo`

## 7. Plano Técnico de Consolidação
### 7.1 Providers
Fases:
1. Alias único (`provider-alias.ts`)
2. Migrar imports → alias
3. Marcar adapter como deprecated
4. Remover adapter + adicionar teste bloqueando novas referências
5. Documentar (`ARCH_EDITOR_PROVIDER.md`)

### 7.2 Navegação Unificada
- Criar util: `toStepKey(n: number) => step-${n}` e `toStepNumber(key: string) => number`.
- Internamente: somente número.
- Externo (render): converter quando necessário.
- Atualizar hooks dependentes.

### 7.3 Sincronização Quiz ↔ Editor
Criar `QuizEditorSyncService`:
```ts
interface QuizEditorSyncService {
  loadFromTemplate(templateId: string): Promise<void>;
  exportToQuizState(): QuizState; // Para reidratação de sessão
  applyAnswer(step: number, answerIds: string[]): void;
  computeScores(): QuizScores;
  persist(options?: { backend?: 'supabase' | 'local' }): Promise<void>;
}
```
- Centralizar transformação + persistência.
- Garantir idempotência da conversão.

### 7.4 Performance Inicial
- Debounce salvamento (≥500ms idle).
- Lazy load de steps > current ±1.
- Memoização de derivativos pesados.
- Preparar futura virtualização (lista de blocos grandes).

### 7.5 Refatoração Estrutural do Editor
Nova árvore:
```
src/pages/editor/modern/
  index.tsx
  hooks/
    useTemplateLifecycle.ts
    useFunnelSync.ts
    useEditorModes.ts
  logic/
    templateConversion.ts
    crudOperations.ts
  components/
    ModernToolbar.tsx
    StatusBar.tsx
    ModeSwitch.tsx
```
Objetivo: reduzir arquivo principal < 300 linhas.

### 7.6 Testes Prioritários
1. Conversão template → blocks (snapshot + invariantes: order, stepNumber)
2. Navegação: setCurrentStep propaga para hooks
3. Sync service: load/export round-trip
4. Provider único: nenhum fallback legacy usado

## 8. Roadmap (Macro)
| Semana | Entregas | Métricas |
|--------|----------|----------|
| 1 | Alias provider + extração conversores + util step mapping | Build sem adapter em novos arquivos |
| 2 | Refatorar editor + sync service skeleton + testes base | ModernUnifiedEditor < 300 linhas |
| 3 | Navegação unificada + persistência integrada + debounce | 1 fonte de verdade currentStep |
| 4 | Performance refinements + documentação completa | Latência conversão <100ms (local) |

## 9. Critérios de Sucesso
- 0 usos de `EditorProviderMigrationAdapter`. <!-- @allow-legacy-adapter: referência documental -->
- Tempo de bootstrap editor ≤ 1.2s em dev.
- Testes de navegação e conversão ≥ 90% passing (crit group).
- Editor sem warnings legacy no console.

## 10. Riscos e Mitigações
| Risco | Mitigação |
|-------|-----------|
| Regressão silenciosa navegação | Teste de snapshot + logs condicionais VITE_EDITOR_DEBUG |
| Drift de estado entre quiz/editor | Sync service como fronteira formal |
| Resistência a mudança (time) | Documentar antes/depois + cheatsheet import |
| Aumento de PR gigante | Merge incremental (Fase 1 = providers only) |

## 11. Próximos Passos Imediatos
1. Criar `provider-alias.ts` e mover imports.
2. Util `stepMapping.ts`.
3. Skeleton `QuizEditorSyncService`.
4. Deprecar adapter com aviso claro.
5. Teste simples vitest para validar step mapping.

---
Documento gerado automaticamente para guiar execução incremental.
