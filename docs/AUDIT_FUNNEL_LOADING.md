# Auditoria de Carregamento do Funil e Camadas de Edição

Este documento resume como o funil é carregado no `/editor`, como os blocos são renderizados no canvas e melhores práticas para fluidez e UX.

## Carregamento do Funil
- Origem: `src/templates/quiz21StepsComplete.json` (draft principal).
- Serviço: Template service normaliza `funnel` e `template` dos query params, carrega o JSON e popula o estado do editor.
- Estrutura: `metadata` + `steps` com arrays de blocos `{ id, type, order, properties, content }`.

## Renderização no Canvas
- Mapeamento: `BlockTypeRenderer.tsx` escolhe o componente por `type` (com aliases).
- Seleção/edição: via `SelectableBlock` com `isSelected`, `isEditable`, `onOpenProperties`.
- Fallback: `GenericBlock` exibe tipo desconhecido sem quebrar a UI.
- Performance: `React.memo` e comparação custom `arePropsEqual`; preferir virtualização para listas grandes.

## JSON Dinâmico e Reordenação
- O JSON é mutável em runtime via estado do editor; alterações podem ser persistidas.
- Mantém dados por `steps` para facilitar reordenação e drag-and-drop.
- Validação recomendada com JSON Schema (Ajv) antes de salvar.

## Melhores Práticas de UX e Fluidez
- Virtualização: usar `@tanstack/react-virtual` ou `react-window` para listas longas.
- Edição inline com preview imediato; autosave com debounce.
- DnD acessível (teclado + pointer) e indicadores de posição.
- Feedback: toasts, loading spinners, esqueleto enquanto carrega.
- A11Y: roles/aria, foco gerenciado, navegação por teclado.

## Auditoria Automatizada
- Comando: `npm run audit:funnel`.
- Verifica se todos os `type` do template têm suporte no `BlockTypeRenderer.tsx`.

## Próximos Passos
- Adicionar validação Ajv no pipeline de save.
- Instrumentar logs de carregamento e tempo de render.
- Criar testes e2e para `/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete`.
