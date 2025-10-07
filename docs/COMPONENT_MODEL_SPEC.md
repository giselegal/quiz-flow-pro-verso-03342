# Especificação do Modelo de Componentes

## Objetivo
Evoluir do pacote monolítico `legacyBlocksBundle` para uma hierarquia de componentes tipados, versionáveis e reutilizáveis, permitindo edição granular, validação específica e futuras renderizações heterogêneas.

## Princípios
1. Coesão: Cada componente tem responsabilidade funcional clara (ex: `QuestionMultiSelect`).
2. Composição: Stages referenciam `componentIds` (já existente) – agora cada id aponta para um componente tipado.
3. Imutabilidade lógica: Alterações relevantes geram nova versão (futuro: histórico).
4. Serialização Estável: Schema JSON claro para persistir/exportar.
5. Derivação Legacy: Adapter faz mapping determinístico bloco → componente.

## Estrutura Base
```ts
interface BaseComponent {
  id: string;
  kind: ComponentKind; // enum central
  version: string; // semantic component version (ex: '1.0.0')
  createdAt: string;
  updatedAt: string;
  props: Record<string, any>; // Especializado por kind
  meta?: { source?: 'legacy' | 'native'; legacyBlockId?: string; tags?: string[] };
}
```

## Enum `ComponentKind`
- `Header`
- `Navigation`
- `QuestionSingle`
- `QuestionMulti`
- `Transition`
- `ResultPlaceholder`
- `LayoutGroup` (futuro)
- `RawLegacyBundle` (modo transicional)

## Tipagens Específicas (Props)
```ts
interface HeaderProps { title: string; subtitle?: string; description?: string; showProgress?: boolean; }
interface NavigationProps { showNext: boolean; showPrevious: boolean; nextButtonText?: string; }
interface QuestionOption { id: string; label: string; description?: string; value?: string; points?: number; category?: string; }
interface QuestionBaseProps { title: string; subtitle?: string; required?: boolean; }
interface QuestionSingleProps extends QuestionBaseProps { options: QuestionOption[]; }
interface QuestionMultiProps extends QuestionBaseProps { options: QuestionOption[]; maxSelections?: number; }
interface TransitionProps { message: string; variant?: 'info' | 'success' | 'warning'; showDivider?: boolean; showButton?: boolean; buttonText?: string; }
interface ResultPlaceholderProps { template: string; }
```

## Normalização Legacy → Novo Modelo
| Legacy Block Type | Novo ComponentKind | Estratégia Mapping |
|-------------------|--------------------|--------------------|
| `QuizHeaderBlock` | `Header` | Extrair `properties.title/subtitle/description/showProgress` |
| `QuizNavigationIntegration` | `Navigation` | `properties.showNext/showPrevious/nextButtonText` |
| `QuizContentIntegration` (question single) | `QuestionSingle` | `multiSelect=false` + options |
| `QuizContentIntegration` (question multi) | `QuestionMulti` | `multiSelect=true` + `maxSelections` |
| `QuizTransition` | `Transition` | Copy propriedades + variant |
| (outcome placeholder) | `ResultPlaceholder` | Template fixo ou dynamic |
| Pacote Agrupado Atual | `RawLegacyBundle` | Contêiner transicional até migração completa |

## Regras de Validação Futuras
- `QuestionSingle`: `options.length >= 2`, nenhuma opção duplicada por id.
- `QuestionMulti`: `maxSelections` >= 2 e <= `options.length`.
- `Header`: `title` obrigatório.
- `Navigation`: se `showNext=true` então `nextButtonText` não vazio.
- `Transition`: `message` obrigatório.

## Evolução do Draft
Hoje: `components: { id: { type: 'legacyBlocksBundle', props: { blocks: [...] } } }`
Futuro imediato: coexistência
```json
{
  "components": {
    "cmp1": { "kind": "RawLegacyBundle", ... },
    "cmp2": { "kind": "QuestionMulti", "props": { "title": "...", "options": [...] } }
  }
}
```
Validador aceitará ambos enquanto `RawLegacyBundle` existir.

## Versionamento
- Cada componente tem `version` (independente do `schemaVersion` global).
- Quebra de compatibilidade em props → bump major.
- Adição retrocompatível → bump minor.

## Identificadores
- `genId('cmp')` reutilizado; prefixos específicos opcionais no futuro (`cmp_q_`, `cmp_hd_`).

## Estratégia de Migração Incremental
1. Introduzir enum + tipos base (mantendo legacy bundle).
2. Implementar creator functions `createHeader(props)`, etc.
3. Adapter: detectar block tipo question/header/navigation → gerar componente tipado ao invés de inserir no bundle bruto (flag `ADAPTER_COMPONENT_SPLIT`?).
4. Fase híbrida: stages mistos (alguns apontando para `RawLegacyBundle`, outros para componentes tipados).
5. Remover `RawLegacyBundle` quando 100% convertido.

## Telemetria / Métricas
Adicionar contadores: `componentCreatedByKind`, `legacyBundleStillPresentCount` para acompanhar progresso de decomposição.

## Próximos Passos Técnicos
- Implementar tipos e guards.
- Repositório in-memory para CRUD.
- Testes unitários (guards + criação). 
- Adaptar validação global para aplicar regras específicas por `kind`.

_Atualizado em: 2025-10-07_
