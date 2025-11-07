# Templates do Quiz (Fonte de Verdade e Artefatos)

Este diretório contém ARQUIVOS GERADOS automaticamente a partir dos JSONs em `public/templates/*`.

- Fonte de verdade: os JSONs em `public/templates/`
  - Ex.: `public/templates/quiz21-complete.json`, `public/templates/step-20-v3.json`
- Artefatos gerados: arquivos `.ts` tipados que exportam os templates
  - Ex.: `src/templates/quiz21StepsComplete.ts`, `src/templates/embedded.ts`

Por que gerar `.ts`?
- Tipagem: garante compatibilidade com `Block`, `BlockType` e `BlockContent` (TypeScript)
- Performance: permite tree-shaking e pré-empacotamento pelo Vite/Rollup
- Estabilidade: evita fetchs assíncronos de JSON durante o bootstrap do editor

Como atualizar os templates gerados
- Edite os JSONs em `public/templates/`
- Gere os artefatos `.ts`:

```bash
npm run build:templates
```

Observações importantes
- Não edite manualmente os arquivos `.ts` gerados; eles serão sobrescritos.
- Em desenvolvimento, para reduzir o bundle, o passo de pré-build de templates pode estar desativado (`prebuild:disabled`). Em produção, utilize `npm run prebuild:production` ou rode o `build:templates` antes do `build`.
- Se um bloco do JSON não tiver `content`, o gerador deve garantir `content: {}` para cumprir a interface `Block`. Caso note ausência, ajuste o JSON ou o gerador para adicionar o campo vazio.

Estratégia alternativa (opcional)
- Carregar JSONs direto em runtime (via `fetch`/import dinâmico) é possível, mas pode impactar chunking/preload. Mantemos a geração `.ts` como padrão para máxima previsibilidade de build.
