# 🔍 RASTREAMENTO: Origem do JSON com `blocks: []`

## 📍 FONTE IDENTIFICADA

O JSON que você está vendo vem do **useTemplateLoader** que foi criado nas correções, especificamente da função `loadFromMasterJSON()`.

## 🗂️ ESTRUTURA DO PROBLEMA

### 1. **Master JSON Público** (`/public/templates/quiz21-complete.json`)

**Estrutura atual:**
```json
{
  "steps": {
    "step-01": {
      "templateVersion": "3.0",
      "metadata": { ... },
      "theme": { ... },
      "blocks": [
        {
          "id": "intro-logo",
          "type": "intro-logo",
          "order": 0,
          "properties": { ... },
          "content": { ... }
        },
        // ... mais 8 blocos
      ],
      "behavior": { ... },
      "navigation": { ... }
    }
  }
}
```

**✅ BLOCOS EXISTEM** no master JSON em `steps[stepId].blocks[]`

---

### 2. **Hook useTemplateLoader** (Linha 163-200)

```typescript
async function loadFromMasterJSON(funnelId?: string): Promise<EditableQuizStep[] | null> {
    const master = await resp.json();
    const steps: EditableQuizStep[] = [];

    for (let i = 0; i < 21; i++) {
        const stepId = `step-${String(i + 1).padStart(2, '0')}`;
        const stepConf = master?.steps?.[stepId];
        
        // 🔴 PROBLEMA: Hidrata sections, mas IGNORA master.steps[stepId].blocks
        const sections = hydrateSectionsWithQuizSteps(stepId, stepConf?.sections);
        
        // Tenta template modular
        let blocks: any[] = [];
        try {
            const staticBlocks = loadStepTemplate(stepId);
            if (Array.isArray(staticBlocks) && staticBlocks.length > 0) {
                blocks = blocksToBlockComponents(staticBlocks as any);
            }
        } catch {
            // 🔴 Fallback converte sections, mas não pega blocks do master
            blocks = convertTemplateToBlocks({ [stepId]: { sections } });
        }

        steps.push({
            id: stepId,
            type: getStepType(i),
            order: i + 1,
            blocks,  // ← Vazio porque sections não existe no master
            nextStep: i < 20 ? `step-${String(i + 2).padStart(2, '0')}` : undefined,
            metadata: stepConf?.metadata || {},
        });
    }
}
```

---

## 🐛 CAUSA RAIZ

O **master JSON não tem `sections`**, ele tem **`blocks`** diretamente!

**Fluxo errado atual:**
```
1. Busca master.steps[stepId].sections ← ❌ NÃO EXISTE
2. Tenta loadStepTemplate(stepId) ← ❌ Pode não ter todos os steps
3. Fallback: convertTemplateToBlocks(sections) ← ❌ sections é undefined/empty
4. Resultado: blocks = []
```

**Fluxo correto deveria ser:**
```
1. Busca master.steps[stepId].blocks ← ✅ EXISTE
2. Usa direto os blocos do master
3. Resultado: blocks = master.steps[stepId].blocks
```

---

## ✅ SOLUÇÃO

### Arquivo: `src/components/editor/quiz/hooks/useTemplateLoader.ts`

**Linha 163-195 - Função `loadFromMasterJSON`**

```typescript
async function loadFromMasterJSON(funnelId?: string): Promise<EditableQuizStep[] | null> {
    try {
        appLogger.debug('📦 Carregando master JSON...');
        const resp = await fetch('/templates/quiz21-complete.json');
        
        if (!resp.ok) {
            appLogger.warn('⚠️ Master JSON não encontrado:', resp.status);
            return null;
        }

        const master = await resp.json();
        const steps: EditableQuizStep[] = [];

        for (let i = 0; i < 21; i++) {
            const stepId = `step-${String(i + 1).padStart(2, '0')}`;
            const stepConf = master?.steps?.[stepId];
            
            // ✅ CORREÇÃO: Usar blocos diretamente do master JSON
            let blocks: any[] = [];
            
            // 1. Primeiro: tentar blocos do master JSON (fonte primária)
            if (stepConf?.blocks && Array.isArray(stepConf.blocks) && stepConf.blocks.length > 0) {
                blocks = stepConf.blocks.map((block: any, idx: number) => ({
                    id: block.id || `${stepId}-block-${idx}`,
                    type: block.type,
                    order: block.order ?? idx,
                    properties: block.properties || {},
                    content: block.content || {},
                    parentId: block.parentId || null,
                }));
                appLogger.debug(`✅ Blocos do master JSON: ${stepId} (${blocks.length} blocos)`);
            } else {
                // 2. Fallback: tentar template modular
                try {
                    const staticBlocks = loadStepTemplate(stepId);
                    if (Array.isArray(staticBlocks) && staticBlocks.length > 0) {
                        blocks = blocksToBlockComponents(staticBlocks as any);
                        appLogger.debug(`✅ Template modular: ${stepId} (${blocks.length} blocos)`);
                    }
                } catch {
                    // 3. Último fallback: hidratar sections (legado)
                    const sections = hydrateSectionsWithQuizSteps(stepId, stepConf?.sections);
                    blocks = convertTemplateToBlocks({ [stepId]: { sections } });
                    appLogger.debug(`⚠️ Fallback sections: ${stepId} (${blocks.length} blocos)`);
                }
            }

            steps.push({
                id: stepId,
                type: stepConf?.type || getStepType(i),
                order: i + 1,
                blocks,
                nextStep: i < 20 ? `step-${String(i + 2).padStart(2, '0')}` : undefined,
                metadata: stepConf?.metadata || {},
            });
        }

        appLogger.debug('✅ Master JSON carregado:', { steps: steps.length, blocks: steps.reduce((sum, s) => sum + s.blocks.length, 0) });
        return steps;
    } catch (error) {
        appLogger.warn('⚠️ Falha ao carregar master JSON:', error);
        return null;
    }
}
```

---

## 📊 RESULTADO ESPERADO

**Antes (com bug):**
```json
[
  {
    "id": "step-01",
    "blocks": [],  ← ❌ Vazio
    ...
  }
]
```

**Depois (corrigido):**
```json
[
  {
    "id": "step-01",
    "blocks": [
      { "id": "intro-logo", "type": "intro-logo", ... },
      { "id": "intro-title", "type": "intro-title", ... },
      { "id": "intro-image", "type": "intro-image", ... },
      // ... 6 blocos
    ],
    ...
  }
]
```

---

## 🎯 IMPACTO

Com esta correção:
- ✅ Todos os 21 steps terão seus blocos carregados
- ✅ Master JSON será a fonte primária (como deveria ser)
- ✅ Templates modulares continuam como fallback
- ✅ Total de blocos: ~150-200 (vs 0 atual)

---

## 📝 PRIORIDADE

**🔴 CRÍTICO** - Sem esta correção, o editor carrega vazio e é impossível editar os steps.
