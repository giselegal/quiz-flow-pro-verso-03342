# Modo JSON-first / JSON-only

Este guia mostra como ativar o caminho 100% baseado em JSON para os steps do editor e da preview.

## Prioridades de fonte (SSOT)

Quando `VITE_ENABLE_HIERARCHICAL_SOURCE=true` (padrão deste repo), a ordem de leitura é:

1. USER_EDIT (edições locais no editor)
2. ADMIN_OVERRIDE (Supabase/painel admin)
3. TEMPLATE_DEFAULT (arquivos JSON dinâmicos em `public/templates/...`)
4. FALLBACK (templates TS/registry) — DESABILITADO no modo JSON-only

Ao ativar `JSON-only`, o item 4 é desativado e o item 3 só usa arquivos JSON (não tenta registry).

## Como ativar

- Arquivo `.env.local` (padrão no repo):
  - `VITE_ENABLE_HIERARCHICAL_SOURCE=true`
  - `VITE_TEMPLATE_JSON_ONLY=false` (altere para `true` quando todos os steps tiverem JSON)

- Alternativa via navegador (DevTools):

  ```js
  localStorage.setItem('VITE_TEMPLATE_JSON_ONLY', 'true');
  // Para voltar:
  localStorage.removeItem('VITE_TEMPLATE_JSON_ONLY');
  ```

Recarregue a página após alterar.

## Estrutura dos JSONs de steps

Crie um arquivo por step em:

```
public/templates/quiz21-steps/step-XX.json
```

- `XX` é a chave do step (ex.: `intro`, `q1`, `result`, etc.).
- Formatos aceitos:
  - Somente array de blocos: `[{...}, {...}]`
  - Objeto com `blocks`: `{ "blocks": [{...}] }`

Exemplo mínimo:

```json
[
  {
    "id": "headline",
    "type": "intro",
    "content": {
      "title": "Bem-vindo ao Quiz!",
      "subtitle": "Isso é JSON-first."
    }
  }
]
```

## Validação e tolerância

- Os blocos passam por uma validação leve (Zod). Se algo vier inválido, o sistema tenta normalizar para não quebrar a UI.
- Renderização possui fallbacks por categoria (intro, question, transition, result, offer, generic).

## Hot reload

- Os JSONs são servidos pelo Vite (pasta `public/`), então salvar o arquivo atualiza o preview quase em tempo real.

## Troubleshooting

- Tela vazia no modo JSON-only:
  - Verifique se o arquivo `public/templates/quiz21-steps/step-<stepKey>.json` existe e é válido.
  - Cheque o console do navegador para erros de fetch/parse.
  - Desative temporariamente o JSON-only (`VITE_TEMPLATE_JSON_ONLY=false`) se precisar comparar com o fallback TS/registry.

- Cache desatualizado:
  - O editor já faz prefetch e invalidation. Se necessário, force reload com Ctrl+R.

## Notas de implementação

- `HierarchicalTemplateSource` respeita `VITE_TEMPLATE_JSON_ONLY` (env ou localStorage).
- Em JSON-only, `getFromTemplateDefault` NÃO consulta registry/TS se o arquivo JSON não existir — retorna `null`.
- `CanvasColumn` e `PreviewPanel` usam React Query e seguem a mesma fonte canônica.
