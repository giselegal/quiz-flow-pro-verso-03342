# Templates Arquivados - Estrutura com "Sections"

**Data de Arquivamento:** 2024-01-XX  
**Motivo:** Migração para estrutura baseada em "blocks" atômicos

## Contexto

Estes arquivos `step-XX-v3.json` foram arquivados como parte da refatoração da arquitetura de templates.

### Por que foram arquivados?

1. **Estrutura Obsoleta:** Usavam `sections[]` em vez da estrutura moderna `blocks[]`
2. **Duplicação:** Causavam inconsistências com o arquivo master `quiz21-complete.json`
3. **Single Source of Truth:** O projeto migrou para usar apenas `quiz21-complete.json` como fonte única

### Nova Arquitetura

```
quiz21-complete.json (master)
  ↓
scripts/build-templates-from-master.ts
  ↓
src/templates/quiz21StepsComplete.ts (67.98 KB)
src/templates/embedded.ts (69.72 KB)
```

### Estrutura Antiga vs. Nova

**Antiga (sections):**
```json
{
  "sections": [
    {
      "type": "heading-inline",
      "id": "intro-title",
      "content": { "title": "..." },
      "style": { "padding": 16 },
      "animation": { "type": "fade" }
    }
  ]
}
```

**Nova (blocks):**
```json
{
  "blocks": [
    {
      "id": "intro-title",
      "type": "heading-inline",
      "order": 0,
      "properties": {
        "padding": 16,
        "type": "fade",
        "duration": 300
      },
      "content": { "title": "..." },
      "parentId": null
    }
  ]
}
```

### Como Restaurar (se necessário)

Se precisar reverter para a estrutura antiga:

```bash
# Copiar arquivos de volta
cp .archived/templates-sections/step-*-v3.json public/templates/

# Reverter script de build no package.json
npm pkg set scripts.build:templates="tsx scripts/build-templates.ts"
```

### Arquivos Arquivados

- `step-01-v3.json` a `step-21-v3.json` (21 arquivos)
- Total: ~180 KB
- Backup da estrutura com sections preservado aqui

## Referências

- **Normalização:** `scripts/normalize-quiz21-complete.ts`
- **Build Master:** `scripts/build-templates-from-master.ts`
- **Documentação:** `docs/PROBLEMA_SECTIONS_VS_BLOCKS.md`
