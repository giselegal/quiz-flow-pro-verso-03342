# Camadas Técnicas do Sistema de Quiz Unificado

> Fonte única: `src/domain/quiz/quiz-definition.json` validada por Zod (`types.ts`). Todas as demais camadas devem consumir direta ou indiretamente esta fonte.

## Visão Geral das Camadas

| Camada | Responsabilidade Principal | Pode Depender de | Não Deve Depender de |
|--------|----------------------------|------------------|-----------------------|
| Domain | Esquema, validação, engines puras (scoring, offer) | - | UI, Hooks, Services externos |
| Runtime | Carregamento, cache imutável (hash), acesso singleton, projeções derivadas | Domain | UI direta |
| Event Bus | Publicação/assinatura de eventos de domínio e editor | Domain (tipos de eventos) | UI direta, Serviços (ciclo inverso) |
| Services | Analytics, Versionamento, Persistência, Telemetria | Runtime, Event Bus | UI (componentes), Adapters legacy |
| Hooks | Orquestração de estado React (useQuizState, useQuizEditing) | Runtime, Services, Event Bus | Domain direto (exceto tipos) |
| UI (Editor / Player) | Renderização e interação | Hooks | Domain/Runtime direto (salvo uso de tipos) |
| Adapters (Legacy) | Compatibilidade temporária (quizSteps adapter) | Runtime | Services futuros, Editor novo |

Fluxo de dependência (apenas para leitura →):

```
Domain → Runtime → (Event Bus ↔ Services) → Hooks → UI
                 ↘ Adapters (transitório)
```

## Contratos Principais (Interfaces)

### Domain

```ts
// src/domain/quiz/contracts.ts
export interface CanonicalQuizDefinition {
  version: string;
  hash: string; // SHA-256 ou similar
  steps: CanonicalQuizStep[];
  offerMapping: { strategicFinalStepId: string };
  progress: { countedStepIds: string[] };
}

export type CanonicalQuizStep =
  | { id: string; type: 'intro'; title: string; text?: string; buttonText?: string }
  | { id: string; type: 'question'; questionText: string; requiredSelections: number; options: { id: string; text: string; image?: string }[]; next: string }
  | { id: string; type: 'strategic-question'; questionText: string; options: { id: string; text: string }[]; next: string }
  | { id: string; type: 'transition' | 'transition-result'; title: string; text?: string; next: string }
  | { id: string; type: 'result'; title: string; next: string }
  | { id: string; type: 'offer'; image?: string; variants: { matchValue: string; title: string; description: string; buttonText: string; testimonial: { quote: string; author: string } }[] };

export interface ScoringResult { styleScores: Record<string, number>; dominantStyle: string; ordered: [string, number][] }
```

### Runtime

```ts
export interface IQuizRuntime {
  getDefinition(): CanonicalQuizDefinition;
  getStep(id: string): CanonicalQuizStep | undefined;
  listSteps(): CanonicalQuizStep[];
  getStepOrder(): string[];
  getCountedStepIds(): string[];
  computeScores(responses: Record<string, string[]>): ScoringResult; // usa scoringEngine
  resolveOffer(matchValue: string): OfferVariant | undefined; // usa offerEngine
}

export interface OfferVariant { matchValue: string; title: string; description: string; buttonText: string; testimonial: { quote: string; author: string } }
```

### Event Bus

```ts
export interface IEventBus {
  publish<T extends QuizEvent>(event: T): void;
  subscribe<T extends QuizEvent['type']>(type: T, handler: (e: Extract<QuizEvent, { type: T }>) => void): () => void;
}

type QuizEvent =
  | { type: 'quiz.step.viewed'; stepId: string; ts: number }
  | { type: 'quiz.step.answered'; stepId: string; answers: string[]; ts: number }
  | { type: 'quiz.progress.updated'; current: number; total: number; ts: number }
  | { type: 'quiz.result.computed'; dominantStyle: string; scores: Record<string, number>; ts: number }
  | { type: 'quiz.offer.shown'; matchValue: string; ts: number }
  | { type: 'quiz.definition.reload'; hash: string; ts: number }
  | { type: 'editor.step.modified'; stepId: string; field: string; ts: number }
  | { type: 'version.snapshot.created'; snapshotId: string; ts: number }
  | { type: 'version.published'; version: string; ts: number };
```

### Services

```ts
export interface IAnalyticsSink {
  track(event: QuizEvent): Promise<void> | void;
  flush?(): Promise<void>;
}

export interface IVersioningService {
  createSnapshot(label?: string, meta?: Record<string, any>): Promise<VersionSnapshot>;
  listSnapshots(): Promise<VersionSnapshot[]>;
  getSnapshot(id: string): Promise<VersionSnapshot | undefined>;
  publish(snapshotId: string): Promise<PublishedVersion>;
  diff(aId: string, bId: string): Promise<VersionDiff>;
  rollback(versionId: string): Promise<boolean>;
}

export interface VersionSnapshot { id: string; createdAt: number; hash: string; label?: string; stepCount: number }
export interface PublishedVersion { id: string; version: string; hash: string; publishedAt: number }
export interface VersionDiff { added: string[]; removed: string[]; modified: string[] }
```

### Hooks

```ts
export interface UseQuizState {
  currentStepId: string;
  step: CanonicalQuizStep;
  progress: { current: number; total: number; percent: number };
  answers: Record<string, string[]>;
  selectOptions(stepId: string, optionIds: string[]): void;
  next(): void;
  prev(): void;
  result?: ScoringResult;
  offer?: OfferVariant;
}

export interface UseQuizEditingState {
  selectedStepId?: string;
  selectStep(id: string): void;
  updateStep(id: string, patch: Partial<CanonicalQuizStep>): void;
  validate(): ValidationReport;
  saveDraft(): Promise<void>;
}

export interface ValidationReport { errors: { stepId: string; field: string; message: string }[]; warnings: string[] }
```

## Regras de Dependência (Lint mental)

- Domain: zero imports internos de React ou browser APIs.
- Runtime: não emite side-effects fora de carregamento inicial; oferece hash de integridade.
- Event Bus: deve ser leve (observer pattern) e não depender de Services específicos.
- Services: podem subscrever Event Bus; não devem alterar estado interno do Runtime diretamente (usar APIs públicas ou disparar eventos para edição).
- Hooks: único lugar onde React state/refs convivem com Domain/Runtime.
- UI: conversa apenas com Hooks (exceto tipos).
- Adapters: só leem Runtime e produzem formato legacy até sua remoção.

## Carregamento & Cache

1. Loader lê JSON → valida → calcula hash se placeholder.
2. Runtime guarda instância congelada (`Object.freeze`).
3. Event `quiz.definition.reload` emitido caso detectado novo hash (futuro hot reload / edição).

## Estratégia de Edição (preview futura)

- Edição cria uma working copy imutável clonada do runtime.
- Patches aplicados são validados incrementalmente (schema parcial) antes de commit.
- Ao salvar: recalcula hash, grava snapshot (versioning), emite `version.snapshot.created`.
- Publicar: marca snapshot ativo e emite `version.published`.

## Telemetria & Métricas

Eventos mínimos para KPI:
- TTFQ: diferença `page.load` (fora escopo aqui) e primeiro `quiz.step.viewed`.
- Completude: última emissão `quiz.result.computed` / contagem de iniciações.
- Oferta: taxa `quiz.offer.shown` sobre `quiz.result.computed`.

## Próximos Artefatos (fora deste commit)

- Implementação concreta `eventBus` simples in-memory.
- Stubs `versioningService` (write-once snapshots) + `analyticsSink` (fila batelada).
- Hook `useQuizState` migrado para usar somente `IQuizRuntime`.

---
_Arquivo gerado automaticamente como base de arquitetura. Atualize conforme evolução._
