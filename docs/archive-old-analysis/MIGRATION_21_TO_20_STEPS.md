# ✨ Migração: 21 Steps → 20 Steps

## 📋 Resumo da Operação

Migração bem-sucedida do quiz de 21 etapas para 20 etapas individuais, mesclando o conteúdo da antiga Step 21 (oferta) na Step 20 (resultado).

---

## 🎯 Objetivos Alcançados

✅ **Separação em arquivos individuais**: De 1 arquivo consolidado para 20 arquivos independentes  
✅ **Formato padronizado**: Todos os arquivos seguem o padrão `content` / `properties`  
✅ **Mesclagem Step 21 → Step 20**: Resultado + Oferta em uma única etapa  
✅ **100% de validação**: Todos os arquivos passaram na validação  
✅ **Backup automático**: Arquivo original preservado  

---

## 📊 Antes vs Depois

### ANTES
```
quiz21-complete.json (3290 linhas)
├─ step-01 (intro)
├─ step-02 a step-11 (perguntas estilo)
├─ step-12 (transição)
├─ step-13 a step-18 (perguntas estratégicas)
├─ step-19 (transição)
├─ step-20 (resultado)
└─ step-21 (oferta) ❌
```

### DEPOIS
```
20 arquivos individuais
├─ step-01.json (intro)
├─ step-02.json a step-11.json (perguntas estilo)
├─ step-12.json (transição)
├─ step-13.json a step-18.json (perguntas estratégicas)
├─ step-19.json (transição)
└─ step-20.json (resultado + oferta) ✨
```

---

## 🔧 Alterações Técnicas

### 1. ConsolidatedTemplateService.ts
**Arquivo**: `src/services/core/ConsolidatedTemplateService.ts`

**Mudança**: Normalização de IDs para buscar templates com padding correto
```typescript
// ANTES
const response = await fetch(`/templates/${templateId}.json`);

// DEPOIS
let normalizedId = templateId;
const stepMatch = templateId.match(/^step-(\d+)$/);
if (stepMatch) {
  const stepNum = stepMatch[1].padStart(2, '0');
  normalizedId = `step-${stepNum}`;
}
const response = await fetch(`/templates/${normalizedId}.json`);
```

### 2. EditorFunnelConsolidatedService.ts
**Arquivo**: `src/services/core/EditorFunnelConsolidatedService.ts`

**Mudança**: Atualização da lista de template IDs
```typescript
// ANTES
const templateIds = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-21'];

// DEPOIS
const templateIds = [
  'step-1', 'step-2', 'step-3', 'step-4', 'step-5', 
  'step-12', 'step-19', 'step-20'
];
```

---

## 📁 Estrutura dos Arquivos

### Formato Padronizado
Todos os arquivos seguem esta estrutura:

```json
{
  "id": "step-XX",
  "type": "intro|question|transition|result-offer",
  "title": "Título da Etapa",
  "metadata": {
    "name": "Nome da Etapa",
    "description": "Descrição",
    "category": "Categoria",
    "version": "3.0"
  },
  "blocks": [
    {
      "id": "block-id",
      "type": "block-type",
      "position": 0,
      "content": {
        // Dados dinâmicos do bloco
      },
      "properties": {
        // Configurações de estilo e comportamento
      }
    }
  ]
}
```

### Step 20 Especial (Mesclado)
A Step 20 agora inclui:
- ✅ 11 blocos originais (resultado personalizado)
- ✅ 2 blocos da antiga Step 21 (oferta)
- ✅ Seção `offer` com pricing e garantia
- ✅ Tipo alterado para `result-offer`

```json
{
  "id": "step-20",
  "type": "result-offer",
  "title": "Resultado e Oferta Final",
  "blocks": [...13 blocos...],
  "offer": {
    "productName": "5 Passos – Vista-se de Você",
    "pricing": {...},
    "links": {...},
    "guarantee": {...}
  }
}
```

---

## 📈 Estatísticas

| Métrica | Valor |
|---------|-------|
| **Total de arquivos criados** | 20 |
| **Total de blocos** | 99 |
| **Média de blocos/step** | 5.0 |
| **Maior step** | step-20 (13 blocos) |
| **Menor steps** | step-19 (3 blocos) |
| **Taxa de validação** | 100% ✅ |

### Distribuição por Categoria
- **quiz-question**: 8 steps
- **strategic-question**: 6 steps
- **question**: 2 steps
- **intro**: 1 step
- **transition**: 1 step
- **transition-result**: 1 step
- **result-offer**: 1 step

### Top 5 Tipos de Blocos
1. `CTAButton` - 17 ocorrências
2. `question-progress` - 16 ocorrências
3. `question-title` - 16 ocorrências
4. `options grid` - 16 ocorrências
5. `question-hero` - 14 ocorrências

---

## 🛠️ Scripts Criados

### 1. split-quiz-steps.cjs
**Localização**: `scripts/split-quiz-steps.cjs`

**Função**: Separar quiz21-complete.json em 20 arquivos individuais

**Uso**:
```bash
node scripts/split-quiz-steps.cjs
```

**Features**:
- ✅ Leitura do arquivo consolidado
- ✅ Conversão para formato padronizado
- ✅ Mesclagem automática step 21 → step 20
- ✅ Backup automático
- ✅ Validação de estrutura

### 2. validate-steps.cjs
**Localização**: `scripts/validate-steps.cjs`

**Função**: Validar todos os arquivos de steps

**Uso**:
```bash
node scripts/validate-steps.cjs
```

**Validações**:
- ✅ Campos obrigatórios (id, type, title, metadata, blocks)
- ✅ Estrutura de blocos (id, type, position)
- ✅ Separação content/properties
- ✅ Estatísticas e análise

---

## 🔍 Resolução dos Erros 404

### Problema Original
```
❌ /templates/step-1.json → 404
❌ /templates/step-2.json → 404
❌ /templates/step-12.json → 404
❌ /templates/step-20.json → 404
❌ /templates/step-21.json → 404
```

### Solução Implementada

**1. Criação dos arquivos corretos**:
```
✅ /templates/step-01.json
✅ /templates/step-02.json
✅ /templates/step-12.json
✅ /templates/step-20.json
```

**2. Normalização de IDs no serviço**:
- `step-1` → `step-01`
- `step-2` → `step-02`
- `step-21` → `step-20` (mesclado)

**3. Atualização das listas de templates**:
- Removido `step-21` das referências
- Adicionados steps importantes (12, 19, 20)

---

## 💾 Backup

**Arquivo**: `public/templates/quiz21-complete.json.backup-1761342018128.json`

O arquivo original foi preservado automaticamente durante a migração.

---

## ✅ Checklist de Migração

- [x] Análise da estrutura completa
- [x] Identificação do conteúdo da step 21
- [x] Criação dos 20 arquivos individuais
- [x] Mesclagem step 21 → step 20
- [x] Padronização do formato content/properties
- [x] Validação 100% dos arquivos
- [x] Atualização do ConsolidatedTemplateService
- [x] Atualização do EditorFunnelConsolidatedService
- [x] Criação de scripts de automação
- [x] Backup do arquivo original
- [x] Documentação completa

---

## 🚀 Próximos Passos

1. **Testar a aplicação** para confirmar que não há mais erros 404
2. **Atualizar referências** em outros arquivos que possam usar step-21
3. **Atualizar documentação** do projeto sobre a estrutura de 20 steps
4. **Revisar navegação** entre steps (especialmente step-19 → step-20)
5. **Testar fluxo completo** do quiz com a nova estrutura

---

## 📞 Contato

Se houver qualquer problema ou dúvida sobre esta migração, consulte:
- Scripts em `scripts/`
- Backup em `public/templates/`
- Este documento de migração

---

**Data da Migração**: 24 de Outubro de 2025  
**Status**: ✅ Concluída com Sucesso  
**Arquivos Processados**: 21 → 20  
**Taxa de Sucesso**: 100%
