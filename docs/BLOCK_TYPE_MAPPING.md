# Block Type Mapping (v3 templates → editor)

Este documento descreve como tipos de bloco vindos de templates v3 (sections) são mapeados para tipos reconhecidos pelo editor.

## Visão Geral

- Templates v3 definem steps como objetos com `sections`, onde cada section possui `type`, `content`, `style/animation` etc.
- O editor renderiza blocos via EnhancedBlockRegistry usando um `type` conhecido.
- Alguns tipos de section do template v3 não existem no registry; para evitar “blocos invisíveis”, mapeamos esses tipos para equivalentes existentes.

## Onde fica o mapeamento

- Arquivo: `src/utils/blockTypeMapper.ts`
- Funções:
  - `mapBlockType(templateType: string): string` retorna o tipo mapeado.
  - `isCustomBlockType(type: string): boolean` indica se o tipo possui mapeamento explícito.
- Uso: aplicado em `src/utils/templateConverter.ts` dentro de `convertTemplateToBlocks()` quando converte `sections` → `BlockComponent[]`.

## Mapa inicial

```ts
export const BLOCK_TYPE_MAP: Record<string, string> = {
  // Intro
  'intro-hero': 'container',
  'welcome-form': 'form-container',

  // Question
  'question-hero': 'quiz-question-header',
  'options-grid': 'options-grid',

  // Transition
  'transition-hero': 'transition-hero',
  'transition-content': 'text',

  // Result
  'result-header': 'result-header',
  'result-content': 'text',
  'result-card': 'result-card',

  // Offer
  'offer-hero': 'offer-hero',
  'offer-cta': 'button',
};
```

Observações:
- Mantemos `transition-hero`, `offer-hero`, `result-header`, `options-grid` pois já existem no registry.
- `intro-hero` → `container` e `welcome-form` → `form-container` garantem renderização com blocos básicos.

## Como estender

1. Adicione o novo mapeamento em `BLOCK_TYPE_MAP`.
2. Se necessário, crie/registre um componente correspondente no `EnhancedBlockRegistry`.
3. Teste abrindo `/editor?template=...` e verificando se os blocos aparecem e são editáveis.

## Debug

- Durante a conversão, se um tipo for mapeado, é logado no console: `Mapeando tipo de bloco: X → Y`.
- O EnhancedBlockRegistry também loga quando um tipo não é encontrado e aplica fallbacks.

## Roadmap

- Opcional: criar componentes especializados para `intro-hero` e `welcome-form` para reproduzir 100% a estética original do template.
- Adicionar testes de snapshot para a conversão de sections → blocks.
