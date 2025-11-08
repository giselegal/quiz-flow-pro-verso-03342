# 📝 README - Estrutura de Templates v3.1

## ✅ Formato Oficial Ativo

**Versão:** 3.1 (Individual por Step)  
**Localização:** `/public/templates/funnels/quiz21StepsComplete/`

### Estrutura de Arquivos

```
public/templates/funnels/quiz21StepsComplete/
├── master.v3.json           # Índice com referências aos steps
└── steps/
    ├── step-01.json         # Step 1 (intro)
    ├── step-02.json         # Step 2 (Q1: Tipo de Roupa)
    ├── step-03.json         # Step 3 (Q2: Personalidade)
    └── ...                  # Steps 4-21
    └── step-21.json         # Step 21 (resultado)
```

### Formato do Arquivo Individual (step-XX.json)

```json
{
  "templateVersion": "3.1",
  "metadata": {
    "id": "step-01",
    "name": "Intro (Blocos)",
    "description": "Etapa inicial com hero e formulário de nome",
    "category": "intro",
    "tags": ["intro", "form"]
  },
  "theme": {
    "colors": {
      "primary": "#B89B7A",
      "secondary": "#432818",
      "background": "#fffaf7",
      "text": "#432818"
    }
  },
  "blocks": [
    {
      "id": "hero-1",
      "type": "hero-block",
      "config": { ... },
      "properties": { ... }
    },
    {
      "id": "welcome-form-1",
      "type": "welcome-form-block",
      "config": { ... }
    }
  ]
}
```

## 🔄 Como Regenerar Templates

### Fonte de Verdade
```
src/templates/fashionStyle21PtBR.ts
```

### Script de Geração
```bash
node --loader ts-node/esm scripts/generate-quiz21-jsons.ts
```

Isso irá:
1. Ler `fashionStyle21PtBR.ts`
2. Gerar 21 arquivos individuais em `steps/`
3. Atualizar `master.v3.json` com índice

## 📦 Arquivos Deprecados

Arquivos v3.0 (legado) foram movidos para:
```
public/templates/.deprecated/v3.0-legacy/
├── quiz21-complete.json     # v3.0 monolítico (3.956 linhas)
└── step-XX-v3.json          # v3.0 individual (21 arquivos)
```

⚠️ **NÃO USAR MAIS** - Apenas para referência histórica

## 🎯 Carregamento no Sistema

### Prioridade de Caminhos (jsonStepLoader)

1. **`/templates/funnels/quiz21StepsComplete/steps/${stepId}.json`** ← v3.1 (USAR)
2. `/templates/${stepId}-v3.json` ← v3.0 fallback (deprecado)
3. `/templates/blocks/${stepId}.json` ← fallback
4. `/templates/quiz21-steps/${stepId}.json` ← fallback legado
5. `/templates/${stepId}-template.json` ← fallback
6. `/templates/quiz21-complete.json` ← v3.0 monolítico (deprecado)

### Serviços Atualizados

- ✅ `HierarchicalTemplateSource` - Prioriza v3.1
- ✅ `jsonStepLoader` - Path v3.1 como prioridade #1
- ✅ `EditorDataService` - Carrega de v3.1
- ✅ `editor-json-templates` - Usa formato v3.1

### Tipos Atualizados

- ✅ `TemplateVersion` = '1.0' | '2.0' | '2.1' | '3.0' | '3.1'
- ✅ `CanonicalTemplateVersion` = '3.0' | '3.1'
- ✅ Validação aceita ambos 3.0 e 3.1

## 📊 Comparação de Formatos

| Aspecto | v3.0 Monolítico | v3.0 Individual | v3.1 Individual |
|---------|-----------------|-----------------|-----------------|
| **Arquivo** | 1 arquivo | 21 arquivos | master + 21 |
| **Tamanho** | 3.956 linhas | ~3.885 linhas | ~1.407 linhas |
| **Blocos/step** | 5 blocos | 5 blocos | 2 blocos |
| **Performance** | ❌ Carrega tudo | ⚠️ Média | ✅ Rápida |
| **Manutenção** | ❌ Difícil | ⚠️ Média | ✅ Fácil |
| **Status** | Deprecado | Deprecado | **ATIVO** |

## 🔧 Troubleshooting

### Editor não carrega steps

1. Verificar se arquivos v3.1 existem:
```bash
ls -la public/templates/funnels/quiz21StepsComplete/steps/
```

2. Verificar console do navegador:
```
Deve aparecer: "Carregando de /templates/funnels/quiz21StepsComplete/steps/step-01.json"
```

3. Verificar que arquivos v3.0 foram movidos:
```bash
ls public/templates/*.json
# Não deve mostrar quiz21-complete.json nem step-XX-v3.json
```

### Regenerar templates

Se houver problemas com os JSONs:
```bash
# Regenerar do source TypeScript
node --loader ts-node/esm scripts/generate-quiz21-jsons.ts
```

## 📚 Documentação Relacionada

- `AUDITORIA_JSONS_QUIZ21_2025-11-08.md` - Auditoria completa
- `src/templates/fashionStyle21PtBR.ts` - Fonte de verdade
- `scripts/generate-quiz21-jsons.ts` - Script de geração

---

**Última atualização:** 2025-11-08  
**Versão ativa:** v3.1 Individual  
**Status:** ✅ Produção
