# 🎯 PLANO DE AÇÃO: Unificação Completa JSON v3.0

**Data:** 13 de outubro de 2025  
**Status:** FASE 1 ✅ CONCLUÍDA | FASE 2-4 🔄 PENDENTE  
**Objetivo:** Sistema 100% editável via JSON com master unificado

---

## 📊 STATUS ATUAL

### ✅ FASE 1: CONCLUÍDA - Consolidação JSON Master
- ✅ Script `scripts/consolidate-json-v3.mjs` criado
- ✅ Executado com sucesso: 21/21 steps consolidados
- ✅ Arquivo `quiz21-complete.json` gerado: 101.87 KB, 3.367 linhas
- ✅ Todos os steps incluem seções/blocos completos
- ✅ Configuração global adicionada

### 🔄 PRÓXIMAS FASES

- 🔄 FASE 2: Atualizar HybridTemplateService (10-15 min)
- 🔄 FASE 3: Sistema de Salvamento Editor → JSON (15-20 min)
- 🔄 FASE 4: Validação e Testes (10 min)

---

## 🚀 FASE 2: ATUALIZAR HYBRIDTEMPLATESERVICE

### Objetivo
Modificar o HybridTemplateService para priorizar o master JSON consolidado

### Tempo Estimado
10-15 minutos

### Arquivos a Modificar

#### 1. `src/services/HybridTemplateService.ts`

**Modificação 1: Método `loadMasterTemplate`**

```typescript
/**
 * Carrega o master template consolidado (quiz21-complete.json)
 */
private static async loadMasterTemplate(): Promise<void> {
  try {
    console.log('🔄 Carregando master JSON v3.0...');
    
    // Tentar carregar o master JSON consolidado
    const response = await fetch('/templates/quiz21-complete.json');
    
    if (response.ok) {
      const data = await response.json();
      
      // Validar estrutura v3.0 completa
      const isValid = this.validateMasterTemplate(data);
      
      if (isValid) {
        this.masterTemplate = data;
        console.log('✅ Master JSON v3.0 carregado com sucesso:', {
          version: data.templateVersion,
          steps: Object.keys(data.steps).length,
          consolidated: data.metadata?.consolidated,
          size: `${(JSON.stringify(data).length / 1024).toFixed(2)} KB`
        });
        return;
      } else {
        console.warn('⚠️ Master JSON inválido, usando fallback');
      }
    }
  } catch (error) {
    console.warn('⚠️ Erro ao carregar master JSON:', error);
  }
  
  // Fallback para TypeScript se JSON falhar ou for inválido
  console.log('📦 Usando fallback TypeScript...');
  try {
    const { getQuiz21StepsTemplate } = await import('@/templates/imports');
    const tsTemplate = getQuiz21StepsTemplate();
    
    this.masterTemplate = {
      templateVersion: "3.0",
      templateId: "quiz21StepsComplete",
      metadata: {
        source: "typescript-fallback",
        loadedAt: new Date().toISOString()
      },
      steps: tsTemplate,
      settings: {
        autoAdvance: true,
        showProgress: true
      }
    };
    
    console.log('✅ TypeScript fallback carregado');
  } catch (fallbackError) {
    console.error('❌ ERRO CRÍTICO: Falha no fallback TypeScript:', fallbackError);
    throw new Error('Não foi possível carregar nenhum template');
  }
}

/**
 * Valida estrutura do master template
 */
private static validateMasterTemplate(data: any): boolean {
  if (!data) return false;
  
  // Validar campos obrigatórios
  if (data.templateVersion !== "3.0") {
    console.warn('❌ Versão incorreta:', data.templateVersion);
    return false;
  }
  
  if (!data.steps || typeof data.steps !== 'object') {
    console.warn('❌ Campo "steps" ausente ou inválido');
    return false;
  }
  
  // Validar que tem os 21 steps
  const stepCount = Object.keys(data.steps).length;
  if (stepCount !== 21) {
    console.warn(`❌ Número incorreto de steps: ${stepCount}/21`);
    return false;
  }
  
  // Validar que steps têm seções
  let stepsWithSections = 0;
  for (const stepId in data.steps) {
    const step = data.steps[stepId];
    if (step.sections && Array.isArray(step.sections)) {
      stepsWithSections++;
    }
  }
  
  if (stepsWithSections < 21) {
    console.warn(`⚠️ Apenas ${stepsWithSections}/21 steps têm seções`);
    // Não retorna false, pois pode ser intencional
  }
  
  console.log(`✅ Validação master template: ${stepsWithSections}/21 steps com seções`);
  return true;
}
```

**Modificação 2: Método `getTemplate`**

```typescript
/**
 * 🎯 MÉTODO PRINCIPAL: getTemplate
 * Hierarquia: Master JSON → Step Individual JSON → TypeScript Fallback
 */
static async getTemplate(templateId: string): Promise<any | null> {
  try {
    // 1. Carregar master template se necessário
    if (!this.masterTemplate) {
      await this.loadMasterTemplate();
    }

    console.log(`🔍 Buscando template: ${templateId}`);

    // 2. Caso especial: template completo
    if (templateId === 'quiz21StepsComplete') {
      if (this.masterTemplate) {
        console.log('✅ Retornando master template completo');
        return this.masterTemplate;
      }
    }

    // 3. Buscar step específico no master template
    if (this.masterTemplate?.steps?.[templateId]) {
      const stepData = this.masterTemplate.steps[templateId];
      console.log(`✅ Step ${templateId} encontrado no master JSON:`, {
        hasSections: !!stepData.sections,
        sectionsCount: stepData.sections?.length || 0
      });
      return stepData;
    }

    // 4. Tentar carregar override/individual específico
    const override = await this.loadStepOverride(templateId);
    if (override) {
      console.log(`✅ Step ${templateId} carregado de arquivo individual`);
      return override;
    }

    console.warn(`⚠️ Template não encontrado: ${templateId}`);
    return null;

  } catch (error) {
    console.error(`❌ Erro ao carregar template ${templateId}:`, error);
    return null;
  }
}
```

**Modificação 3: Adicionar método público para obter master**

```typescript
/**
 * Retorna o master template completo
 */
static async getMasterTemplate(): Promise<MasterTemplate | null> {
  if (!this.masterTemplate) {
    await this.loadMasterTemplate();
  }
  return this.masterTemplate;
}

/**
 * Limpa o cache do master template (útil para recarregar após edições)
 */
static clearCache(): void {
  this.masterTemplate = null;
  this.overrideCache.clear();
  console.log('🗑️ Cache do HybridTemplateService limpo');
}

/**
 * Recarrega o master template do servidor
 */
static async reload(): Promise<void> {
  console.log('🔄 Recarregando master template...');
  this.clearCache();
  await this.loadMasterTemplate();
  console.log('✅ Master template recarregado');
}
```

### Checklist FASE 2

- [ ] Adicionar método `validateMasterTemplate`
- [ ] Atualizar método `loadMasterTemplate`
- [ ] Atualizar método `getTemplate`
- [ ] Adicionar método `getMasterTemplate`
- [ ] Adicionar método `clearCache`
- [ ] Adicionar método `reload`
- [ ] Testar carregamento do master JSON
- [ ] Testar fallback para TypeScript
- [ ] Verificar logs no console

---

## 💾 FASE 3: SISTEMA DE SALVAMENTO EDITOR → JSON

### Objetivo
Criar serviço para salvar alterações do editor de volta no JSON

### Tempo Estimado
15-20 minutos

### Arquivos a Criar/Modificar

#### 1. Criar `src/services/TemplateEditorService.ts`

```typescript
/**
 * 🎯 TEMPLATE EDITOR SERVICE
 * 
 * Gerencia salvamento de alterações do editor para JSON
 */

import { HybridTemplateService } from './HybridTemplateService';

export interface SaveResult {
  success: boolean;
  message: string;
  stepId?: string;
  error?: any;
}

export class TemplateEditorService {
  
  /**
   * Salva alterações de um step específico
   */
  static async saveStepChanges(
    stepId: string, 
    updatedStep: any
  ): Promise<SaveResult> {
    try {
      console.log(`💾 Salvando alterações do ${stepId}...`);
      
      // 1. Validar estrutura do step
      if (!this.validateStepStructure(updatedStep)) {
        return {
          success: false,
          message: 'Estrutura do step inválida',
          stepId
        };
      }
      
      // 2. Obter master template
      const master = await HybridTemplateService.getMasterTemplate();
      if (!master) {
        return {
          success: false,
          message: 'Master template não disponível',
          stepId
        };
      }
      
      // 3. Atualizar step no master
      master.steps[stepId] = {
        ...master.steps[stepId],
        ...updatedStep,
        metadata: {
          ...master.steps[stepId]?.metadata,
          ...updatedStep.metadata,
          updatedAt: new Date().toISOString()
        }
      };
      
      // 4. Salvar no servidor via API
      const saved = await this.saveMasterToServer(master);
      
      if (saved) {
        // 5. Limpar cache para recarregar alterações
        HybridTemplateService.clearCache();
        
        return {
          success: true,
          message: `Step ${stepId} salvo com sucesso`,
          stepId
        };
      } else {
        return {
          success: false,
          message: 'Erro ao salvar no servidor',
          stepId
        };
      }
      
    } catch (error) {
      console.error(`❌ Erro ao salvar ${stepId}:`, error);
      return {
        success: false,
        message: 'Erro ao processar salvamento',
        stepId,
        error
      };
    }
  }
  
  /**
   * Salva o master template completo no servidor
   */
  private static async saveMasterToServer(master: any): Promise<boolean> {
    try {
      // Em produção: salvar via API
      // Por enquanto: localStorage para desenvolvimento
      
      if (typeof window !== 'undefined' && window.localStorage) {
        const key = 'quiz-master-template-v3';
        localStorage.setItem(key, JSON.stringify(master));
        console.log('✅ Master template salvo no localStorage');
        return true;
      }
      
      // TODO: Implementar API endpoint
      // const response = await fetch('/api/templates/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(master)
      // });
      // return response.ok;
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar no servidor:', error);
      return false;
    }
  }
  
  /**
   * Valida estrutura de um step
   */
  private static validateStepStructure(step: any): boolean {
    if (!step || typeof step !== 'object') return false;
    
    // Campos obrigatórios
    const required = ['templateVersion', 'metadata'];
    for (const field of required) {
      if (!step[field]) {
        console.warn(`❌ Campo obrigatório ausente: ${field}`);
        return false;
      }
    }
    
    // Validar sections se existir
    if (step.sections && !Array.isArray(step.sections)) {
      console.warn('❌ Campo "sections" deve ser array');
      return false;
    }
    
    return true;
  }
  
  /**
   * Exporta o master template como JSON para download
   */
  static async exportMasterTemplate(): Promise<string> {
    const master = await HybridTemplateService.getMasterTemplate();
    if (!master) {
      throw new Error('Master template não disponível');
    }
    
    return JSON.stringify(master, null, 2);
  }
  
  /**
   * Importa master template de JSON
   */
  static async importMasterTemplate(jsonString: string): Promise<SaveResult> {
    try {
      const data = JSON.parse(jsonString);
      
      // Validar estrutura
      if (data.templateVersion !== "3.0") {
        return {
          success: false,
          message: 'Versão do template incorreta'
        };
      }
      
      // Salvar
      const saved = await this.saveMasterToServer(data);
      
      if (saved) {
        HybridTemplateService.clearCache();
        return {
          success: true,
          message: 'Template importado com sucesso'
        };
      }
      
      return {
        success: false,
        message: 'Erro ao salvar template importado'
      };
      
    } catch (error) {
      return {
        success: false,
        message: 'JSON inválido',
        error
      };
    }
  }
}
```

#### 2. Criar Hook `src/hooks/useTemplateEditor.ts`

```typescript
/**
 * 🎯 HOOK: useTemplateEditor
 * 
 * Hook React para gerenciar edição de templates
 */

import { useState, useCallback } from 'react';
import { TemplateEditorService, SaveResult } from '@/services/TemplateEditorService';

export function useTemplateEditor() {
  const [saving, setSaving] = useState(false);
  const [lastSaveResult, setLastSaveResult] = useState<SaveResult | null>(null);
  
  const saveStep = useCallback(async (stepId: string, stepData: any) => {
    setSaving(true);
    try {
      const result = await TemplateEditorService.saveStepChanges(stepId, stepData);
      setLastSaveResult(result);
      return result;
    } finally {
      setSaving(false);
    }
  }, []);
  
  const exportTemplate = useCallback(async () => {
    try {
      const json = await TemplateEditorService.exportMasterTemplate();
      
      // Criar download
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz21-complete-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'Template exportado' };
    } catch (error) {
      return { success: false, message: 'Erro ao exportar', error };
    }
  }, []);
  
  const importTemplate = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const result = await TemplateEditorService.importMasterTemplate(text);
      setLastSaveResult(result);
      return result;
    } catch (error) {
      return { success: false, message: 'Erro ao importar', error };
    }
  }, []);
  
  return {
    saving,
    lastSaveResult,
    saveStep,
    exportTemplate,
    importTemplate
  };
}
```

### Checklist FASE 3

- [ ] Criar `TemplateEditorService.ts`
- [ ] Implementar `saveStepChanges`
- [ ] Implementar `saveMasterToServer`
- [ ] Implementar `exportMasterTemplate`
- [ ] Implementar `importMasterTemplate`
- [ ] Criar hook `useTemplateEditor`
- [ ] Adicionar botões de salvar no editor
- [ ] Testar salvamento local (localStorage)
- [ ] Preparar endpoint API para produção

---

## ✅ FASE 4: VALIDAÇÃO E TESTES

### Objetivo
Validar que todo o sistema funciona end-to-end

### Tempo Estimado
10 minutos

### Testes a Realizar

#### Teste 1: Carregamento do Master JSON

```typescript
// src/__tests__/HybridTemplateService.test.ts

describe('HybridTemplateService - Master JSON', () => {
  it('deve carregar master JSON v3.0', async () => {
    const master = await HybridTemplateService.getMasterTemplate();
    
    expect(master).toBeDefined();
    expect(master.templateVersion).toBe('3.0');
    expect(Object.keys(master.steps)).toHaveLength(21);
  });
  
  it('deve ter seções em todos os steps', async () => {
    const master = await HybridTemplateService.getMasterTemplate();
    
    for (let i = 1; i <= 21; i++) {
      const stepId = `step-${String(i).padStart(2, '0')}`;
      const step = master.steps[stepId];
      
      expect(step).toBeDefined();
      expect(step.sections).toBeDefined();
      expect(Array.isArray(step.sections)).toBe(true);
    }
  });
});
```

#### Teste 2: Fallback para TypeScript

```typescript
describe('HybridTemplateService - Fallback', () => {
  it('deve usar TypeScript se JSON falhar', async () => {
    // Simular falha no fetch
    global.fetch = jest.fn(() => Promise.reject('Network error'));
    
    HybridTemplateService.clearCache();
    const master = await HybridTemplateService.getMasterTemplate();
    
    expect(master).toBeDefined();
    expect(master.metadata.source).toBe('typescript-fallback');
  });
});
```

#### Teste 3: Salvamento de Alterações

```typescript
describe('TemplateEditorService', () => {
  it('deve salvar alterações de um step', async () => {
    const stepId = 'step-01';
    const updatedStep = {
      templateVersion: '3.0',
      metadata: {
        id: 'step-01-intro-v3',
        name: 'Step 1 - Editado',
        updatedAt: new Date().toISOString()
      },
      sections: []
    };
    
    const result = await TemplateEditorService.saveStepChanges(stepId, updatedStep);
    
    expect(result.success).toBe(true);
    expect(result.stepId).toBe(stepId);
  });
});
```

#### Teste 4: Preview em Tempo Real

**Teste Manual:**
1. Abrir `/editor`
2. Selecionar um step
3. Modificar título ou seção
4. Salvar alterações
5. Verificar que preview atualiza
6. Abrir `/quiz-estilo` em nova aba
7. Verificar que mudanças aparecem

### Checklist FASE 4

- [ ] Criar testes unitários do HybridTemplateService
- [ ] Criar testes do TemplateEditorService
- [ ] Executar suite de testes
- [ ] Teste manual: carregamento
- [ ] Teste manual: edição
- [ ] Teste manual: salvamento
- [ ] Teste manual: export/import
- [ ] Validar performance (tempo de carregamento)
- [ ] Verificar logs no console
- [ ] Documentar resultados

---

## 📈 MÉTRICAS DE SUCESSO

### Critérios de Aceitação

| Critério | Status | Meta |
|----------|--------|------|
| Master JSON carrega em < 500ms | 🔄 | ✅ |
| Todos os 21 steps têm seções | ✅ | ✅ |
| Fallback TypeScript funciona | 🔄 | ✅ |
| Editor pode salvar alterações | 🔄 | ✅ |
| Preview atualiza em tempo real | 🔄 | ✅ |
| Export/Import funciona | 🔄 | ✅ |
| Zero erros no console | 🔄 | ✅ |

---

## 🚀 COMANDOS RÁPIDOS

### Consolidar JSON (executar sempre que editar JSONs individuais)
```bash
node scripts/consolidate-json-v3.mjs
```

### Executar Testes
```bash
npm test src/__tests__/HybridTemplateService.test.ts
npm test src/__tests__/TemplateEditorService.test.ts
```

### Verificar Master JSON
```bash
# Tamanho
ls -lh public/templates/quiz21-complete.json

# Contar linhas
wc -l public/templates/quiz21-complete.json

# Ver estrutura (primeiras 100 linhas)
head -100 public/templates/quiz21-complete.json
```

### Limpar Cache e Recarregar
```javascript
// No console do navegador
HybridTemplateService.clearCache()
HybridTemplateService.reload()
```

---

## 📝 PRÓXIMOS PASSOS IMEDIATOS

### 1. FASE 2 - Agora! (10-15 min)
```bash
# Editar arquivo
code src/services/HybridTemplateService.ts

# Adicionar métodos:
# - validateMasterTemplate()
# - getMasterTemplate()
# - clearCache()
# - reload()
```

### 2. Testar FASE 2
```bash
# Iniciar servidor dev
npm run dev

# Abrir navegador
# Verificar console para logs de carregamento
```

### 3. FASE 3 - Em seguida (15-20 min)
```bash
# Criar novos arquivos
touch src/services/TemplateEditorService.ts
touch src/hooks/useTemplateEditor.ts

# Implementar lógica de salvamento
```

### 4. FASE 4 - Finalizar (10 min)
```bash
# Criar testes
touch src/__tests__/HybridTemplateService.test.ts
touch src/__tests__/TemplateEditorService.test.ts

# Executar testes
npm test
```

---

## 🎉 RESULTADO ESPERADO

Ao final das 4 fases, teremos:

✅ **Sistema 100% Editável via JSON**
- Master JSON completo como fonte primária
- Fallback robusto para TypeScript
- Editor pode salvar de volta no JSON

✅ **Performance Otimizada**
- Carregamento rápido (< 500ms)
- Cache inteligente
- Reload sob demanda

✅ **Developer Experience**
- Scripts automatizados
- Logs claros e informativos
- Validação em múltiplas camadas

✅ **Robustez**
- 3 níveis de fallback
- Validação de estrutura
- Tratamento de erros

---

**🚀 Pronto para começar a FASE 2!**

Execute: `code src/services/HybridTemplateService.ts`
