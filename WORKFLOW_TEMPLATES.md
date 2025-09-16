# Workflow de Templates do Quiz Quest Challenge Verse

Este documento descreve o fluxo completo de trabalho (workflow) para criação, edição, publicação e empacotamento de templates de funil (quiz) no sistema.

---

## 1. Escolha do Template
- O usuário acessa `/admin/funis` e visualiza todos os templates disponíveis (sem duplicidade).
- Os templates são carregados a partir do registro central (`unifiedTemplatesRegistry.ts`) e mapeados para arquivos JSON em `/public/templates/step-XX-template.json`.
- O sistema utiliza sempre a versão mais atualizada do template (ex: `step-01-template.json` v2.1).

## 2. Duplicidade e Renomeação
- Caso o usuário queira criar um novo funil baseado em um template existente:
  - O template é **duplicado** (cópia do arquivo JSON de steps).
  - O usuário pode **renomear** o novo funil/template diretamente na interface do editor.
  - O novo template recebe um novo `id` e `name` no campo `metadata`.

## 3. Edição no Editor
- O editor carrega o template selecionado usando o `HeadlessEditorProvider`.
- O usuário pode editar:
  - Blocos (blocks)
  - Layout, design, lógica, validação, etc.
  - Campos de metadados (nome, descrição, tags)
- As alterações são mantidas em memória até o usuário salvar.

## 4. Salvamento do Template Editado
- Ao salvar, o editor:
  - Gera um novo arquivo JSON (ou sobrescreve o existente) em `/public/templates/step-XX-template.json`.
  - O caminho pode variar se for um funil customizado (ex: `/public/templates/custom/step-XX-template.json`).
  - O `EditorDataService` gerencia o salvamento e atualização do cache.

## 5. Empacotamento para Publicação
- Para publicar um funil/template:
  - O sistema empacota todos os arquivos JSON de steps do funil selecionado.
  - Gera um bundle (zip ou pasta) contendo todos os arquivos necessários para deploy.
  - Inclui metadados, assets e configurações de SEO/branding.
  - O bundle pode ser enviado para produção, Netlify, Vercel, etc.

## 6. Caminho do Template Editado
- **Edição local:** `/public/templates/step-XX-template.json` (ou `/custom/` para funis personalizados)
- **Publicação:** bundle com todos os steps + assets + metadados
- **Reuso:** qualquer template pode ser duplicado e editado novamente, criando novas variações.

---

## Resumo Visual

1. Escolha do template → 2. Duplicar/renomear → 3. Editar no editor → 4. Salvar (JSON) → 5. Empacotar/publicar (bundle)

---

**Dúvidas ou sugestões? Edite este arquivo ou abra uma issue!**
