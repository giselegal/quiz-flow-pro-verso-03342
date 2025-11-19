# 🔧 Diagnóstico: Edições JSON Não Funcionam

## 📋 Problema Relatado

**Sintoma**: Edições no Painel de Propriedades (aba JSON) não estão sendo aplicadas.

## 🔍 Análise do Fluxo de Edição

### Fluxo Esperado

1. **Usuário edita JSON** → JsonTemplateEditor
2. **Clica "Aplicar"** → `handleApply()`
3. **Callback chamado** → `onTemplateChange(parsed)`
4. **QuizModularEditor recebe** → `onTemplateChange` callback
5. **Extrai blocks** → `template.blocks`
6. **Atualiza estado** → `setStepBlocks(stepIndex, blocks)`
7. **Reducer processa** → `SET_STEP_BLOCKS` action
8. **Valida blocos** → `blockSchema.safeParse()`
9. **Atualiza UI** → Re-render com novos blocos

### Pontos de Falha Identificados

#### 1️⃣ **Estrutura do Template JSON** ❌ PROVÁVEL CAUSA
```tsx
// QuizModularEditor espera:
onTemplateChange={(template) => {
    if (template?.blocks && Array.isArray(template.blocks)) {
        setStepBlocks(safeCurrentStep, template.blocks);
    }
}}
```

**Problema**: O JSON Editor pode estar usando estrutura diferente!

```json
// ❌ Estrutura com "stages" (não funciona)
{
  "stages": [
    {
      "id": "step-01",
      "blocks": [...]
    }
  ]
}

// ✅ Estrutura esperada (funciona)
{
  "step": "step-01",
  "blocks": [...]
}
```

#### 2️⃣ **Validação de Blocos** ⚠️ POSSÍVEL CAUSA
O reducer valida cada bloco com `blockSchema` e **descarta silenciosamente** blocos inválidos:

```tsx
case 'SET_STEP_BLOCKS': {
    for (const block of action.payload.blocks) {
        const validation = blockSchema.safeParse(block);
        if (validation.success) {
            validBlocks.push(validation.data);
        } else {
            // ❌ BLOCO IGNORADO SEM NOTIFICAÇÃO VISÍVEL
            invalidBlocks.push({ block, errors: validation.error.issues });
        }
    }
}
```

**Problema**: Se blocos não seguem o schema, são descartados sem feedback visual ao usuário!

#### 3️⃣ **Callback Não Chamado** ⚠️ POSSÍVEL CAUSA
```tsx
onTemplateChange?.(parsed);
```

Se `onTemplateChange` for `undefined`, nada acontece silenciosamente.

## 🔧 Logs de Debug Adicionados

### 1. JsonTemplateEditor - handleApply
```tsx
console.group('📝 [JsonTemplateEditor] handleApply chamado');
console.log('isValid:', isValid);
console.log('jsonText length:', jsonText.length);
console.log('✅ JSON parseado:', parsed);
console.log('Chamando onTemplateChange:', typeof onTemplateChange);
console.log('parsed.stages:', parsed.stages?.length);
console.log('parsed.blocks:', parsed.blocks?.length);
```

### 2. QuizModularEditor - onTemplateChange
```tsx
console.group('🔧 [QuizModularEditor] onTemplateChange chamado');
console.log('template recebido:', template);
console.log('safeCurrentStep:', safeCurrentStep);
console.log('template.blocks:', template?.blocks);
console.log('isArray:', Array.isArray(template?.blocks));
console.log('blocksCount:', template?.blocks?.length);

if (template?.blocks && Array.isArray(template.blocks)) {
    console.log('✅ Chamando setStepBlocks');
    setStepBlocks(safeCurrentStep, template.blocks);
} else {
    console.warn('❌ template.blocks inválido ou não é array');
}
```

### 3. SuperUnifiedProvider - setStepBlocks
```tsx
console.group('📝 [SuperUnified] setStepBlocks chamado');
console.log('stepIndex:', stepIndex);
console.log('blocks recebidos:', blocks);
console.log('blocksCount:', blocks?.length);
console.log('blockIds:', blocks?.map(b => b.id));
console.log('✅ Dispatch enviado');
```

### 4. Reducer - SET_STEP_BLOCKS
```tsx
console.group('🔧 [Reducer] SET_STEP_BLOCKS');
console.log('stepIndex:', action.payload.stepIndex);
console.log('blocks recebidos:', action.payload.blocks.length);

// Para cada bloco:
console.log('✅ Bloco válido:', block.id);
// ou
console.error('❌ Bloco INVÁLIDO:', block.id, validation.error.issues);

// Resumo final:
console.log('✅ Todos os N blocos são válidos');
// ou
console.error('❌ X blocos inválidos ignorados!');
console.table(invalidBlocks); // Mostra erros de validação
```

## 🧪 Como Testar

### Passo 1: Abrir Editor JSON
1. Acessar: `http://localhost:8080/editor?resource=quiz21StepsComplete&step=1`
2. Clicar na aba **"JSON"** no Painel de Propriedades
3. Abrir console (F12)

### Passo 2: Editar JSON
Tentar editar o JSON de **duas formas** para identificar qual estrutura funciona:

#### Teste A: Estrutura "blocks" direta (esperada)
```json
{
  "step": "step-01",
  "blocks": [
    {
      "id": "test-block-1",
      "type": "heading",
      "content": {
        "text": "Teste de Edição",
        "level": 1
      }
    }
  ]
}
```

#### Teste B: Estrutura "stages" (padrão do template)
```json
{
  "templateId": "quiz21StepsComplete",
  "stages": [
    {
      "id": "step-01",
      "blocks": [
        {
          "id": "test-block-1",
          "type": "heading",
          "content": {
            "text": "Teste de Edição",
            "level": 1
          }
        }
      ]
    }
  ]
}
```

### Passo 3: Clicar "Aplicar" e Verificar Logs

#### Cenário 1: Callback não chamado
```
📝 [JsonTemplateEditor] handleApply chamado
✅ JSON parseado: {...}
Chamando onTemplateChange: function
✅ onTemplateChange chamado
❌ [QuizModularEditor] onTemplateChange chamado NÃO APARECE
```

**Problema**: `onTemplateChange` não está conectado corretamente.

#### Cenário 2: Estrutura errada
```
📝 [JsonTemplateEditor] handleApply chamado
✅ JSON parseado: { stages: [...] }
🔧 [QuizModularEditor] onTemplateChange chamado
template.blocks: undefined
❌ template.blocks inválido ou não é array
```

**Problema**: JSON usa `stages` mas código espera `blocks` diretamente.

#### Cenário 3: Blocos inválidos
```
📝 [SuperUnified] setStepBlocks chamado
blocksCount: 3
🔧 [Reducer] SET_STEP_BLOCKS
❌ Bloco INVÁLIDO: test-block-1
Errors: [
  { path: 'content.text', message: 'Required' }
]
❌ 1 blocos inválidos ignorados!
Estado final: stepBlocks[1] = 2 blocos
```

**Problema**: Blocos não seguem o `blockSchema`, sendo descartados.

#### Cenário 4: Sucesso total ✅
```
📝 [JsonTemplateEditor] handleApply chamado
🔧 [QuizModularEditor] onTemplateChange chamado
✅ Chamando setStepBlocks com 3 blocos
📝 [SuperUnified] setStepBlocks chamado
🔧 [Reducer] SET_STEP_BLOCKS
✅ Bloco válido: test-block-1
✅ Bloco válido: test-block-2
✅ Bloco válido: test-block-3
✅ Todos os 3 blocos são válidos
```

## 🔧 Soluções por Cenário

### Solução 1: Adaptar Estrutura do Template

**Se o problema for estrutura `stages` vs `blocks`:**

```tsx
// Em QuizModularEditor/index.tsx
onTemplateChange={(template) => {
    console.log('🔧 Template recebido:', template);
    
    // Suportar ambas as estruturas
    let blocks = null;
    
    // Opção 1: blocks diretamente
    if (template?.blocks && Array.isArray(template.blocks)) {
        blocks = template.blocks;
    }
    // Opção 2: stages[0].blocks (extrair do primeiro stage)
    else if (template?.stages && Array.isArray(template.stages) && template.stages.length > 0) {
        const currentStage = template.stages.find(s => s.id === currentStepKey);
        blocks = currentStage?.blocks || template.stages[0]?.blocks;
    }
    
    if (blocks && Array.isArray(blocks)) {
        console.log('✅ Aplicando', blocks.length, 'blocos');
        setStepBlocks(safeCurrentStep, blocks);
    } else {
        console.warn('❌ Estrutura de template não reconhecida');
    }
}}
```

### Solução 2: Feedback de Validação

**Adicionar toast quando blocos forem descartados:**

```tsx
// No reducer SET_STEP_BLOCKS
if (invalidBlocks.length > 0) {
    // Notificar usuário via toast
    setTimeout(() => {
        // Acessar showToast do contexto (não disponível no reducer)
        // Alternativa: Usar event bus
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
                title: 'Blocos inválidos',
                description: `${invalidBlocks.length} blocos foram ignorados por não seguirem o schema`,
                variant: 'destructive'
            }
        }));
    }, 0);
}
```

### Solução 3: Desabilitar Validação Estrita (Temporário)

**Para debug, permitir blocos mesmo se inválidos:**

```tsx
case 'SET_STEP_BLOCKS': {
    // ⚠️ MODO DEBUG: Aceitar todos os blocos sem validação
    const DEBUG_SKIP_VALIDATION = true;
    
    if (DEBUG_SKIP_VALIDATION) {
        console.warn('⚠️ Validação desabilitada - aceitando todos os blocos');
        return {
            ...state,
            editor: {
                ...state.editor,
                stepBlocks: {
                    ...state.editor.stepBlocks,
                    [action.payload.stepIndex]: action.payload.blocks,
                },
            },
        };
    }
    
    // ... validação normal
}
```

## 📊 Próximos Passos

### Imediato
1. Recarregar editor
2. Abrir console
3. Tentar editar JSON
4. Copiar **TODOS** os logs começando com 📝, 🔧, ❌, ✅
5. Analisar logs para identificar exatamente onde falha

### Com Base nos Logs
- **Se não aparecer logs**: Callback não conectado → Verificar props
- **Se `template.blocks: undefined`**: Estrutura errada → Adaptar parser
- **Se blocos inválidos**: Schema muito restritivo → Ajustar validação ou blocos

---

**Status**: 🔍 Logs de debug adicionados, aguardando teste do usuário  
**Data**: 2025-11-19  
**Arquivos modificados**:
- `JsonTemplateEditor.tsx` - Logs no handleApply
- `QuizModularEditor/index.tsx` - Logs no onTemplateChange
- `SuperUnifiedProvider.tsx` - Logs em setStepBlocks e reducer
