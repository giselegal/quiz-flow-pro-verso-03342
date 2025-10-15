# 🔍 ANÁLISE DO PREVIEW DO CANVAS - PROBLEMAS IDENTIFICADOS

## 📊 **PROBLEMAS PRINCIPAIS IDENTIFICADOS**

### 1. **🚨 Erros 404 do Supabase**
```
pwtjuuhchtbzttrzoutw.supabase.co/rest/v1/quiz_drafts?select=*&id=eq.quiz-estilo-21-steps
pwtjuuhchtbzttrzoutw.supabase.co/rest/v1/quiz_production?select=steps,runtime,results,ui,settings&slug=eq.quiz-estilo
```

**Causa:** Tentativas de buscar dados que não existem na tabela Supabase.

**Impacto:** Preview não carrega porque depende desses dados para configurações.

### 2. **⏰ Timeouts de Configuração**
```
⚠️ Loading timeout for quiz-global-config - usando valores padrão
⚠️ Loading timeout for quiz-theme-config - usando valores padrão  
⚠️ Loading timeout for quiz-step-1 - usando valores padrão
```

**Causa:** Hook `useComponentConfiguration` aguarda resposta da API por 15 segundos antes de usar fallback.

**Impacto:** Preview demora para carregar, usando configurações padrão.

### 3. **🔄 Registro Duplicado de Steps**
```
⚠️ Step 'step-01' já está registrado. Sobrescrevendo...
```

**Causa:** Sistema de registro de steps está sendo chamado múltiplas vezes.

**Impacto:** Comportamento inconsistente e warnings desnecessários.

### 4. **🌐 Falhas de WebSocket/Lovable**
```
WebSocket connection to 'wss://2e9b8570-48ab-48d7-a298-6a8f0c0bec0f.lovableproject.com/' failed
```

**Causa:** Ambiente Lovable tentando conectar WebSocket que falha.

**Impacto:** Funcionalidades de tempo real não funcionam.

### 5. **🔒 Warnings de Segurança iFrame**
```
An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing
```

**Causa:** Configuração de sandbox do iframe não é ideal.

**Impacto:** Vulnerabilidade de segurança potencial.

---

## 🎯 **ARQUITETURA ATUAL DO PREVIEW**

### **Fluxo de Renderização:**
```
EnhancedCanvasArea → Tabs (Canvas/Preview) → LiveCanvasPreview → QuizRenderer
```

### **Sistema de Configuração:**
```
useComponentConfiguration → ConfigurationAPI → Supabase → Fallback
```

### **Sistema de Registro:**
```
BlockRegistry → Step Registration → Preview Rendering
```

---

## 🔧 **PROBLEMAS TÉCNICOS ESPECÍFICOS**

### **1. useComponentConfiguration.ts**
- **Timeout muito alto:** 15 segundos para desenvolvimento
- **Loading bloqueante:** Preview fica carregando até timeout
- **Fallback tardio:** Só ativa após timeout completo

### **2. ConfigurationAPI.ts** 
- **Dados mock insuficientes:** Definições básicas para poucos componentes
- **API calls reais:** Tenta conectar Supabase mesmo em dev
- **Cache inexistente:** Não reutiliza configurações já carregadas

### **3. QuizAppConnected.tsx**
- **Múltiplas instâncias:** Vários `useComponentConfiguration` simultâneos
- **Re-renders excessivos:** Carregamento causa múltiplas renderizações
- **Estado de loading:** Preview fica travado em loading

### **4. Sistema de Fallback**
- **Interceptor incompleto:** `supabase-fallback-system.js` não cobre todos os casos
- **Dados insuficientes:** Fallback não tem dados completos para todos os componentes
- **Timing incorreto:** Fallback só ativa após timeout da requisição real

---

## 📈 **MÉTRICAS DE PERFORMANCE**

### **Tempos de Carregamento:**
- ⏱️ **Atual:** 15+ segundos (aguarda timeout)
- 🎯 **Esperado:** < 2 segundos
- 📊 **Otimizado:** < 500ms (com cache)

### **Requisições de Rede:**
- 📡 **Atual:** ~8 requisições Supabase (todas falhando)
- 🎯 **Esperado:** 0 requisições em dev/preview
- 📈 **Com Cache:** 1 requisição inicial + cache

---

## 🛠️ **SOLUÇÕES PROPOSTAS**

### **1. Modo Preview Offline**
```typescript
// useComponentConfiguration.ts
if (editorMode || previewMode) {
    // Skip API calls, use local definitions immediately
    return mockConfiguration;
}
```

### **2. Cache Inteligente**
```typescript
// ConfigurationAPI.ts
const cache = new Map();
if (cache.has(componentId)) {
    return cache.get(componentId);
}
```

### **3. Fallback Imediato**
```typescript
// Priorizar fallback em ambiente de desenvolvimento
if (process.env.NODE_ENV === 'development') {
    return fallbackConfiguration;
}
```

### **4. Preview Independente**
```typescript
// Modo preview que não depende de APIs externas
const PreviewMode = ({ steps, selectedStep }) => {
    return <QuizRenderer mode="preview" data={localData} />;
};
```

---

## 🎯 **PRÓXIMOS PASSOS**

### **Prioridade Alta:**
1. 🚀 Implementar modo preview offline
2. ⚡ Reduzir timeout de 15s para 2s
3. 🛡️ Melhorar sistema de fallback
4. 📊 Adicionar cache de configurações

### **Prioridade Média:**
1. 🔄 Corrigir registro duplicado de steps
2. 🐛 Resolver warnings de security
3. 📈 Otimizar re-renders

### **Prioridade Baixa:**
1. 🌐 Implementar WebSocket fallback
2. 🎨 Melhorar UI de loading
3. 📋 Adicionar métricas de performance

---

## 📝 **CONCLUSÃO**

O preview do canvas está funcional, mas com sérios problemas de performance devido a:
- Dependência excessiva de APIs externas
- Timeouts muito longos
- Sistema de fallback inadequado
- Múltiplas requisições desnecessárias

**Solução principal:** Implementar modo preview completamente offline para desenvolvimento, mantendo funcionalidade de produção intacta.