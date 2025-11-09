# ✅ CORREÇÕES APLICADAS - 2025-11-08

## 🎯 Problema Identificado

O editor não carregava as 21 etapas porque:
1. **jsonStepLoader** estava hardcoded para `quiz21StepsComplete` apenas
2. **HierarchicalTemplateSource** não sabia qual template estava ativo
3. **ONLINE_DISABLED** desligava Supabase automaticamente em DEV (impedindo testes)

---

## 🔧 Correções Aplicadas

### 1️⃣ jsonStepLoader.ts
**Antes:**
```typescript
export async function loadStepFromJson(stepId: string): Promise<Block[] | null> {
  const paths = [
    `/templates/funnels/quiz21StepsComplete/steps/${stepId}.json`, // ❌ Hardcoded!
  ];
}
```

**Depois:**
```typescript
export async function loadStepFromJson(
  stepId: string, 
  templateId: string = 'quiz21StepsComplete'  // ✅ Parâmetro dinâmico
): Promise<Block[] | null> {
  const paths = [
    `/templates/funnels/${templateId}/steps/${stepId}.json`, // ✅ Path dinâmico
  ];
  console.log(`🔍 [jsonStepLoader] Tentando carregar: ${paths[0]}`);
}
```

**Resultado:** ✅ Agora aceita qualquer templateId

---

### 2️⃣ HierarchicalTemplateSource.ts

#### A) Adicionado activeTemplateId
```typescript
export class HierarchicalTemplateSource implements TemplateDataSource {
  private activeTemplateId: string = 'quiz21StepsComplete'; // 🆕 Template ativo
  
  setActiveTemplate(templateId: string): void {
    this.activeTemplateId = templateId;
    console.log(`🎯 [HierarchicalSource] Template ativo definido: ${templateId}`);
  }
}
```

#### B) getFromTemplateDefault agora passa templateId
```typescript
private async getFromTemplateDefault(stepId: string): Promise<Block[] | null> {
  const { loadStepFromJson } = await import('@/templates/loaders/jsonStepLoader');
  const jsonBlocks = await loadStepFromJson(stepId, this.activeTemplateId); // ✅ Passa templateId
  return jsonBlocks;
}
```

#### C) UnifiedTemplateRegistry REMOVIDO
```typescript
// ❌ REMOVIDO (deprecated):
// const { templateRegistry } = await import('@/services/deprecated/UnifiedTemplateRegistry');
// const blocks = await templateRegistry.getStep(stepId);

// ✅ NOVO: Retorna null se JSON não encontrar (modo JSON-only permanente)
return null;
```

#### D) ONLINE_DISABLED simplificado
**Antes:**
```typescript
// ❌ Desligava Supabase em DEV automaticamente
const isDev = !!(import.meta as any)?.env?.DEV;
return !!isDev;
```

**Depois:**
```typescript
// ✅ Verifica apenas flags explícitas
// localStorage > Vite env > process.env
// Padrão: Supabase HABILITADO
return false;
```

**Resultado:** ✅ Em DEV, Supabase fica ativo (pode ser desligado via localStorage)

#### E) Logs de diagnóstico adicionados
```typescript
console.log(`🔍 [HierarchicalSource] Tentando fonte: ${DataSourcePriority[priority]}`);
console.log(`⚠️ [HierarchicalSource] Fonte ${priority} retornou vazio`);

// Quando nenhuma fonte funciona:
console.error(`❌ [HierarchicalSource] NENHUMA FONTE disponível`);
console.table({
  'Step ID': stepId,
  'Template Ativo': this.activeTemplateId,
  'USER_EDIT': '✅ Tentado',
  'TEMPLATE_DEFAULT': `✅ Tentado (${this.activeTemplateId})`,
});
```

---

### 3️⃣ TemplateService.ts

**Sincronização com HierarchicalSource:**
```typescript
setActiveTemplate(templateId: string, totalSteps: number): void {
  this.activeTemplateId = templateId;
  this.activeTemplateSteps = totalSteps;
  
  // 🆕 Sincronizar com HierarchicalTemplateSource
  hierarchicalTemplateSource.setActiveTemplate(templateId);
}
```

**Resultado:** ✅ Quando `prepareTemplate()` roda, HierarchicalSource fica sincronizado

---

## 🧪 Como Testar

### 1. Abrir o editor
```
http://localhost:8080/editor?resource=quiz21StepsComplete
```

### 2. Abrir Console (F12)

### 3. Verificar logs esperados:
```
🎯 [setActiveTemplate] Definindo template ativo: quiz21StepsComplete com 21 etapas
🎯 [HierarchicalSource] Template ativo definido: quiz21StepsComplete
🔍 [TemplateService.steps.list] activeTemplateSteps = 21
🔍 [HierarchicalSource] Tentando fonte: TEMPLATE_DEFAULT para step-01
🔍 [jsonStepLoader] Tentando carregar: /templates/funnels/quiz21StepsComplete/steps/step-01.json
✅ [jsonStepLoader] Carregado X blocos de ...
```

### 4. Verificar painel lateral esquerdo
- ✅ Deve mostrar **21 etapas numeradas**
- ✅ Deve ser possível clicar e navegar entre elas
- ✅ Canvas central deve renderizar o conteúdo

---

## 🚨 Se Ainda Não Funcionar

Se os logs mostrarem:
```
❌ [HierarchicalSource] NENHUMA FONTE disponível para step-01
⚠️ [jsonStepLoader] Nenhum bloco encontrado para step-01
```

**Verificar:**
1. Arquivo existe? `ls -la public/templates/funnels/quiz21StepsComplete/steps/step-01.json`
2. Servidor serve o arquivo? `curl http://localhost:8080/templates/funnels/quiz21StepsComplete/steps/step-01.json`
3. JSON está válido? `cat public/templates/funnels/quiz21StepsComplete/steps/step-01.json | jq .`

---

## 📊 Resumo das Mudanças

| Arquivo | Linhas Modificadas | Mudanças Principais |
|---------|-------------------|---------------------|
| `jsonStepLoader.ts` | ~15 | ✅ Aceita templateId dinâmico |
| `HierarchicalTemplateSource.ts` | ~80 | ✅ activeTemplateId, logs, remove registry |
| `TemplateService.ts` | ~3 | ✅ Sincroniza com HierarchicalSource |

**Total:** ~98 linhas modificadas

---

## ✅ Benefícios

1. **Suporte a múltiplos templates**: Não limitado a `quiz21StepsComplete`
2. **Logs detalhados**: Fácil diagnóstico de problemas
3. **Código mais limpo**: Registry deprecated removido
4. **DEV experience melhor**: Supabase não desliga automaticamente
5. **Arquitetura correta**: Sincronização TemplateService ↔ HierarchicalSource

---

## 🔄 Próximos Passos (se necessário)

1. Testar com outros templates (lead-magnet-fashion, etc)
2. Verificar se fallback TypeScript ainda é necessário
3. Considerar remover flag `ONLINE_DISABLED` em produção
4. Adicionar testes automatizados para jsonStepLoader
