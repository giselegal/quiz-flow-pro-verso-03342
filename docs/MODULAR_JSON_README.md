# Modular JSON (Zod schemas + converters)

Este diretório adiciona utilitários para trabalhar com o formato JSON modular do quiz:
- src/lib/modular-schema.ts — Zod schemas e tipos
- src/lib/modular-json.ts — validação e conversores (JSON <-> editor model)

Por que:
- Permite importar/exportar templates JSON validados.
- Facilita a edição modular no editor e a migração de componentes legados para templates JSON.
- Mantém validação (Zod) para evitar dados quebrados em runtime.

Instalação
- Adicione dependência se necessário:
  npm install zod --save
  ou
  yarn add zod

Uso no editor (exemplo)
```ts
import { modularJsonToEditorStepsSafe, editorStepsToModularJson } from '@/lib/modular-json';
import template from '/templates/quiz21-complete.json';

// Importar template (modo seguro)
const res = modularJsonToEditorStepsSafe(template);
if (!res.ok) {
  console.error('Erro ao importar template:', res.errors);
} else {
  const editorSteps = res.steps;
  // setSteps(editorSteps) — atualiza o estado do editor
}

// Exportar estado atual do editor para JSON modular
const modular = editorStepsToModularJson(currentEditorSteps, { title: 'Exported Quiz', exportedAt: new Date().toISOString() });
// salvar modular como arquivo JSON / enviar para API
```

Notas de implementação
- `modularJsonToEditorStepsSafe` retorna { ok: true, steps } ou { ok: false, errors } — ideal para uso no editor UI para exibir erros amigáveis.
- `modularJsonToEditorStepsStrict` lança exceção em caso de validação falha — útil em scripts de build ou migrations.
- `editorStepsToModularJson` produz um objeto serializável que pode ser salvo em `public/templates` ou enviado via API.

Boas práticas
- Use action keys (strings) em vez de funções no JSON (ex: "next-step:step-02", "submit-name").
- Mantenha `component` nos blocks para mapear ao registry (editor-bridge / EnhancedBlockRegistry).
- Versione templates com `meta.version` e escreva migrators quando precisar alterar schema.
