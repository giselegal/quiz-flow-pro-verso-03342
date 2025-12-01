# 📁 Templates - Estrutura Limpa V4

**Última atualização:** 1 de dezembro de 2025  
**Status:** ✅ Consolidado - Modelo único oficial

---

## 🎯 FILOSOFIA: SINGLE SOURCE OF TRUTH

Esta estrutura mantém **APENAS o modelo oficial V4**, eliminando duplicações e arquivos obsoletos.

---

## 📂 ESTRUTURA ATUAL

```
public/templates/
├── quiz21-v4-saas.json           # 🟢 MODELO OFICIAL - Template consolidado V4
├── quiz21Steps/                  # 🟢 ESTRUTURA MODULAR V4
│   ├── meta.json                 # Metadados globais
│   ├── README.md                 # Documentação da estrutura modular
│   ├── steps/                    # Steps individuais (fonte de verdade)
│   │   ├── step-01.json
│   │   ├── step-02.json
│   │   ├── ...
│   │   └── step-21.json
│   └── compiled/                 # Build artifacts (gerados automaticamente)
│       └── full.json             # Template consolidado para runtime
├── funnels/                      # Templates de funis específicos
│   ├── funil-emagrecimento.json
│   └── quiz21StepsComplete/      # Versão completa do Quiz 21
├── html/                         # Templates HTML
├── html-export/                  # Exportação HTML
├── steps-refs/                   # Referências de steps
└── .obsolete/                    # ⚠️ ARQUIVOS ANTIGOS (NÃO USAR)
    ├── quiz21-complete.json      # ❌ Substituído por quiz21-v4-saas.json
    ├── quiz21-v4.json            # ❌ Duplicata antiga
    ├── quiz21-v4-gold.json       # ❌ Variante obsoleta
    ├── blocks.json               # ❌ Não usado
    └── step-XX-v3.json (21 arquivos) # ❌ Versão V3 antiga
```

---

## 🟢 MODELO OFICIAL V4

### `quiz21-v4-saas.json` (123KB)

**Uso:** Template consolidado para carregamento rápido do quiz completo

**Características:**
- ✅ Estrutura V4 validada com Zod
- ✅ Todos os 21 steps consolidados
- ✅ Schema consistente: `properties` (layout), `content` (dados), `validation` (regras)
- ✅ Usado por `TemplateService.loadV4Template()`

**Quando usar:**
- Carregamento inicial do quiz completo
- Preview rápido sem necessidade de edição
- Produção (runtime otimizado)

---

### `quiz21Steps/` - Estrutura Modular

**Uso:** Edição granular por step individual

**Características:**
- ✅ Steps individuais editáveis (`steps/*.json`)
- ✅ Compilação automática para runtime (`compiled/full.json`)
- ✅ Metadados centralizados (`meta.json`)
- ✅ Ideal para desenvolvimento iterativo

**Quando usar:**
- Edição de steps individuais no editor
- Desenvolvimento e testes por step
- Geração de variantes personalizadas

**Comandos:**
```bash
# Compilar steps individuais em full.json
npm run build:templates

# Validar estrutura
npm run validate:templates
```

---

## ❌ ARQUIVOS OBSOLETOS (MOVIDOS PARA .obsolete/)

**NÃO USAR NENHUM DESTES:**

### Templates Duplicados
- ❌ `quiz21-complete.json` (121KB) - versão antiga, substituída por `quiz21-v4-saas.json`
- ❌ `quiz21-v4.json` (114KB) - duplicata obsoleta
- ❌ `quiz21-v4-gold.json` (96KB) - variante não oficial

### Arquivos V3 (21 arquivos)
- ❌ `step-01-v3.json` até `step-21-v3.json`
- **Motivo:** Versão V3 descontinuada, migrada para V4

### Outros
- ❌ `blocks.json` - não referenciado no código
- ❌ `quiz21-complete.json.backup-sections` - backup antigo

**Nota:** Estes arquivos foram movidos para `.obsolete/` para backup, mas **NÃO devem ser usados**. Serão deletados permanentemente em futuras limpezas.

---

## 📊 MIGRAÇÃO DE REFERÊNCIAS

### Antes (V3 e duplicatas)
```typescript
// ❌ NÃO FAZER
fetch('/templates/step-01-v3.json')
fetch('/templates/quiz21-complete.json')
fetch('/templates/quiz21-v4.json')
```

### Depois (V4 oficial)
```typescript
// ✅ CORRETO
fetch('/templates/quiz21-v4-saas.json')              // Template completo
fetch('/templates/quiz21Steps/steps/step-01.json')  // Step individual
```

---

## 🔧 SERVICES ATUALIZADOS

### `TemplateService.ts`
```typescript
// ✅ Agora usa apenas quiz21-v4-saas.json
async loadV4Template() {
  const response = await fetch('/templates/quiz21-v4-saas.json');
  // ...
}

private async detectTemplateSteps(templateId: string) {
  const masterPath = `/templates/quiz21-v4-saas.json`;
  // ...
}
```

---

## 🧪 TESTES ATUALIZADOS

### Testes Mantidos (atualizados)
- ✅ `tests/integration/json-loading-flow.test.ts` - usa `quiz21-v4-saas.json`
- ✅ `tests/perf/json-load-benchmark.test.ts` - usa estrutura V4 modular
- ✅ `tests/e2e/health-check.spec.ts` - valida `quiz21Steps/steps/step-01.json`

### Testes Movidos (obsoletos)
- ⚠️ `tests/e2e/.obsolete/editor-jsonv3-smoke.spec.ts` - dependia de V3
- ⚠️ `tests/e2e/.obsolete/editor-jsonv3-editing.spec.ts` - dependia de V3

---

## 📜 SCRIPTS ATUALIZADOS

### Scripts Movidos (obsoletos)
- ⚠️ `scripts/.obsolete/normalize-quiz21-complete.ts` - dependia de `quiz21-complete.json`
- ⚠️ `scripts/.obsolete/generate-quiz21-jsons.ts` - dependia de `quiz21-complete.json`
- ⚠️ `scripts/.obsolete/generate-blocks-from-master.ts` - dependia de arquivo antigo
- ⚠️ `scripts/.obsolete/fix-atomic-blocks.ts` - dependia de arquivo antigo

### Scripts Mantidos (atualizados)
- ✅ `scripts/validate-template-completeness.ts` - valida `quiz21-v4-saas.json`

---

## 📋 CHECKLIST DE VALIDAÇÃO

Ao trabalhar com templates, garanta:

- [ ] **NUNCA** referenciar arquivos em `.obsolete/`
- [ ] Usar `quiz21-v4-saas.json` para templates consolidados
- [ ] Usar `quiz21Steps/steps/*.json` para edição individual
- [ ] Validar schema V4 com Zod antes de salvar
- [ ] Executar `npm run validate:templates` após mudanças
- [ ] Não criar novos arquivos `step-XX-v3.json` (use V4)

---

## 🎓 BENEFÍCIOS DA CONSOLIDAÇÃO

### Antes da limpeza
- ❌ 26 arquivos obsoletos duplicados
- ❌ Múltiplas "fontes de verdade" conflitantes
- ❌ Confusão entre V3 e V4
- ❌ Scripts e testes quebrados
- ❌ 350KB+ de arquivos duplicados

### Depois da limpeza
- ✅ **1 modelo oficial:** `quiz21-v4-saas.json` (123KB)
- ✅ **1 estrutura modular:** `quiz21Steps/` (editável)
- ✅ Código e testes atualizados
- ✅ Single source of truth clara
- ✅ ~60% redução no tamanho de templates

---

## 🚀 PRÓXIMOS PASSOS

1. **Fase 2.1** - Validar todos os steps V4 com Zod
2. **Fase 2.2** - Gerar `compiled/full.json` automaticamente em CI/CD
3. **Fase 3** - Implementar versionamento de templates (v4.1, v4.2, etc)
4. **Fase 4** - Criar ferramenta de migração V3 → V4 para usuários com drafts antigos

---

## 📞 SUPORTE

**Dúvidas sobre qual arquivo usar?**

| Cenário | Arquivo |
|---------|---------|
| Carregar quiz completo | `quiz21-v4-saas.json` |
| Editar step individual | `quiz21Steps/steps/step-XX.json` |
| Preview rápido | `quiz21-v4-saas.json` |
| Desenvolvimento | `quiz21Steps/` (modular) |
| Testes | `quiz21Steps/steps/step-01.json` (exemplo) |
| **NUNCA USAR** | `.obsolete/*` ❌ |

---

**Última revisão:** Sistema de templates consolidado após Fase 1 (Consolidação de Services)  
**Próximo:** Fase 2 - Validação Zod e build automatizado
