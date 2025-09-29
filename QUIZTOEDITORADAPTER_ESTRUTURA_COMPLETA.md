# 🎯 QUIZTOEDITORADAPTER - ESTRUTURA COMPLETA

## 📋 **VISÃO GERAL**

O `QuizToEditorAdapter` é um adaptador central que converte dados do quiz para o formato do editor unificado e vice-versa, mantendo sincronização bidirecional entre o sistema de quiz e o editor visual.

---

## 🏗️ **ARQUITETURA DO ADAPTER**

### **Classe Principal**
```typescript
export class QuizToEditorAdapter {
  // Estado interno
  private isDirty = false;
  private currentState: EditorQuizState | null = null;
  private changeListeners: ((event: ChangeEvent) => void)[] = [];
  private autoSaveInterval?: NodeJS.Timeout;
}
```

### **Interfaces Principais**

#### **EditorQuizState**
```typescript
interface EditorQuizState {
  id: string;                    // ID único do quiz
  name: string;                  // Nome do quiz
  description: string;           // Descrição do quiz
  questions: QuizQuestion[];     // Array de questões
  styles: any[];                // Array de estilos
  isDirty: boolean;             // Flag de modificação
  lastSaved?: string;           // Timestamp do último salvamento
  version: string;              // Versão do quiz
}
```

#### **SyncResult**
```typescript
interface SyncResult {
  success: boolean;             // Status da operação
  data?: any;                  // Dados retornados
  error?: string;              // Mensagem de erro
  timestamp: string;           // Timestamp da operação
}
```

#### **ChangeEvent**
```typescript
interface ChangeEvent {
  type: 'question-updated' | 'data-saved' | 'sync-error';
  payload: any;
  timestamp: string;
}
```

#### **QuizStepData**
```typescript
interface QuizStepData {
  type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'result' | 'offer';
  stepNumber: number;
  blocks: Block[];
  metadata: {
    isQuizStep: boolean;
    originalQuizStep: number;
  };
}
```

---

## 🔄 **MÉTODOS PRINCIPAIS**

### **1. Conversão Quiz → Editor**
```typescript
async convertQuizToEditor(quizData: any): Promise<EditorQuizState>
```
**Função**: Converte dados do quiz para o formato do editor
**Processo**:
1. Extrai questões do quiz
2. Extrai estilos
3. Cria estado do editor
4. Valida dados

### **2. Conversão Editor → Quiz**
```typescript
async convertEditorToQuiz(editorState: EditorQuizState): Promise<any>
```
**Função**: Converte estado do editor para dados do quiz
**Processo**:
1. Converte estado do editor
2. Adiciona metadata
3. Retorna dados do quiz

### **3. Salvamento e Sincronização**
```typescript
async saveChangesToQuiz(editorState: EditorQuizState): Promise<SyncResult>
```
**Função**: Salva alterações do editor no quiz
**Processo**:
1. Marca como limpo
2. Atualiza estado
3. Notifica listeners
4. Retorna resultado

---

## 🛣️ **ROTAS QUE UTILIZAM O ADAPTER**

### **1. Rota Principal: `/editor/:funnelId`**
```typescript
<Route path="/editor/:funnelId">
  {(params) => (
    <EditorErrorBoundary>
      <ModernUnifiedEditor funnelId={params.funnelId} />
    </EditorErrorBoundary>
  )}
</Route>
```
**Componente**: `ModernUnifiedEditor`
**Função**: Editor unificado com suporte a funnelId dinâmico

### **2. Rota de Quiz Integrado: `/quiz`**
```typescript
<Route path="/quiz">
  <QuizErrorBoundary>
    <QuizIntegratedPage />
  </QuizErrorBoundary>
</Route>
```
**Componente**: `QuizIntegratedPage`
**Função**: Página integrada para editar quiz no editor

### **3. Rota de Quiz Estilo: `/quiz-estilo`**
```typescript
<Route path="/quiz-estilo">
  <QuizErrorBoundary>
    <QuizEstiloPessoalPage />
  </QuizErrorBoundary>
</Route>
```
**Componente**: `QuizEstiloPessoalPage`
**Função**: Quiz de estilo pessoal com 21 etapas

---

## 🔧 **MÉTODOS AUXILIARES**

### **Extração de Dados**
```typescript
// Extrair questões do quiz
private extractQuestions(quizData: any): QuizQuestion[]

// Extrair respostas de uma questão
private extractAnswers(answers: any[]): QuizAnswer[]

// Extrair estilos do quiz
private extractStyles(quizData: any): any[]
```

### **Gerenciamento de Estado**
```typescript
// Marcar estado como alterado
markDirty(state: EditorQuizState): void

// Adicionar listener para mudanças
addChangeListener(listener: (event: ChangeEvent) => void): void

// Remover listener
removeChangeListener(listener: (event: ChangeEvent) => void): void
```

### **Auto-save**
```typescript
// Iniciar auto-save
startAutoSave(intervalMs = 30000): void

// Parar auto-save
stopAutoSave(): void
```

---

## 📊 **FLUXO DE DADOS**

### **1. Carregamento**
```
Quiz Data → QuizToEditorAdapter → Editor State → UI Components
```

### **2. Salvamento**
```
UI Changes → Editor State → QuizToEditorAdapter → Quiz Data → Backend
```

### **3. Sincronização**
```
Editor Changes → Change Listeners → Auto-save → Backend Sync
```

---

## 🎯 **CONFIGURAÇÃO DE ETAPAS**

### **Mapeamento de Tipos por Número**
```typescript
// Lógica de tipos baseada no número da etapa
if (stepNumber === 1) type = 'intro';
else if (stepNumber >= 2 && stepNumber <= 11) type = 'question';
else if (stepNumber === 12 || stepNumber === 19) type = 'transition';
else if (stepNumber >= 13 && stepNumber <= 18) type = 'strategic-question';
else if (stepNumber === 20) type = 'result';
else if (stepNumber === 21) type = 'offer';
```

### **Estrutura de Retorno**
```typescript
return {
  type,                    // Tipo da etapa
  stepNumber,             // Número da etapa
  blocks: [],            // Blocos do editor (TODO: implementar)
  metadata: {
    isQuizStep: true,
    originalQuizStep: stepNumber
  }
};
```

---

## 🔗 **INTEGRAÇÃO COM COMPONENTES**

### **1. QuizEditorIntegratedPage**
```typescript
// Conversão do quiz
const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);

// Validação
if (!QuizToEditorAdapter.validateQuizData(editorData)) {
  throw new Error('Dados do quiz inválidos após conversão');
}
```

### **2. useTemplateLoader Hook**
```typescript
// Import dinâmico
const { QuizToEditorAdapter } = await import('@/adapters/QuizToEditorAdapter');

// Configuração de etapa
const stepConfig = await QuizToEditorAdapter.getStepConfiguration(stepNumber);

// Conversão para editor
const editorData = await QuizToEditorAdapter.convertQuizToEditor();
```

### **3. ModernUnifiedEditor**
```typescript
// Integração com editor unificado
<ModernUnifiedEditor funnelId={params.funnelId} />
```

---

## ⚙️ **RECURSOS AVANÇADOS**

### **1. Sistema de Auto-save**
```typescript
startAutoSave(intervalMs = 30000): void {
  this.autoSaveInterval = setInterval(() => {
    if (this.isDirty && this.currentState) {
      this.saveChangesToQuiz(this.currentState);
    }
  }, intervalMs);
}
```

### **2. Sistema de Event Listeners**
```typescript
// Adicionar listener
addChangeListener(listener: (event: ChangeEvent) => void): void {
  this.changeListeners.push(listener);
}

// Notificar listeners
private notifyListeners(event: ChangeEvent): void {
  this.changeListeners.forEach(listener => {
    try {
      listener(event);
    } catch (error) {
      console.error('Erro ao notificar listener:', error);
    }
  });
}
```

### **3. Validação de Dados**
```typescript
static validateQuizData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  
  const required = ['questions', 'styles'];
  return required.every(key => key in data && Array.isArray(data[key]));
}
```

---

## 📁 **ESTRUTURA DE ARQUIVOS**

```
src/
├── adapters/
│   └── QuizToEditorAdapter.ts          # Adapter principal
├── pages/
│   ├── editor/
│   │   ├── ModernUnifiedEditor.tsx     # Editor unificado
│   │   └── QuizEditorIntegratedPage.tsx # Página integrada
│   └── QuizEstiloPessoalPage.tsx      # Quiz de estilo
├── hooks/
│   └── useTemplateLoader.ts           # Hook de carregamento
├── types/
│   ├── quiz.ts                        # Tipos do quiz
│   └── editor.ts                      # Tipos do editor
└── data/
    └── quizSteps.ts                   # Dados das etapas
```

---

## 🚀 **PONTOS DE INTEGRAÇÃO**

### **1. Editor Unificado**
- **Rota**: `/editor/:funnelId`
- **Componente**: `ModernUnifiedEditor`
- **Adapter**: `QuizToEditorAdapter`
- **Função**: Editor principal com suporte a funnelId

### **2. Quiz Integrado**
- **Rota**: `/quiz`
- **Componente**: `QuizIntegratedPage`
- **Adapter**: `QuizToEditorAdapter`
- **Função**: Página integrada para edição

### **3. Template Loader**
- **Hook**: `useTemplateLoader`
- **Adapter**: `QuizToEditorAdapter`
- **Função**: Carregamento dinâmico de templates

### **4. Quiz Estilo**
- **Rota**: `/quiz-estilo`
- **Componente**: `QuizEstiloPessoalPage`
- **Adapter**: `QuizToEditorAdapter`
- **Função**: Quiz de estilo pessoal com 21 etapas

---

## 🔄 **CICLO DE VIDA**

### **1. Inicialização**
```typescript
constructor() {
  console.log('🎯 QuizToEditorAdapter inicializado');
}
```

### **2. Carregamento**
```typescript
// 1. Converter quiz para editor
const editorState = await adapter.convertQuizToEditor(quizData);

// 2. Validar dados
if (!QuizToEditorAdapter.validateQuizData(editorState)) {
  throw new Error('Dados inválidos');
}

// 3. Configurar auto-save
adapter.startAutoSave(30000);
```

### **3. Edição**
```typescript
// 1. Marcar como alterado
adapter.markDirty(editorState);

// 2. Notificar mudanças
adapter.addChangeListener((event) => {
  console.log('Mudança detectada:', event);
});
```

### **4. Salvamento**
```typescript
// 1. Salvar alterações
const result = await adapter.saveChangesToQuiz(editorState);

// 2. Verificar resultado
if (result.success) {
  console.log('Salvamento bem-sucedido');
} else {
  console.error('Erro no salvamento:', result.error);
}
```

---

## 🎯 **CASOS DE USO**

### **1. Carregamento de Quiz**
- Converter dados do quiz para formato do editor
- Validar integridade dos dados
- Configurar estado inicial

### **2. Edição em Tempo Real**
- Sincronizar mudanças entre editor e quiz
- Manter estado consistente
- Auto-save automático

### **3. Salvamento**
- Converter estado do editor para quiz
- Persistir alterações
- Notificar sucesso/erro

### **4. Navegação entre Etapas**
- Carregar configuração específica da etapa
- Determinar tipo da etapa
- Gerar blocos apropriados

---

## 🔧 **CONFIGURAÇÕES**

### **Auto-save**
- **Intervalo padrão**: 30 segundos
- **Configurável**: `startAutoSave(intervalMs)`
- **Desabilitável**: `stopAutoSave()`

### **Validação**
- **Campos obrigatórios**: `questions`, `styles`
- **Tipos**: Array para campos obrigatórios
- **Estrutura**: Objeto válido

### **Listeners**
- **Tipos de evento**: `question-updated`, `data-saved`, `sync-error`
- **Gerenciamento**: Adicionar/remover listeners
- **Tratamento de erro**: Try/catch automático

---

## 📈 **MÉTRICAS E MONITORAMENTO**

### **Logs de Sistema**
```typescript
console.log('🎯 QuizToEditorAdapter inicializado');
console.log('🔄 Convertendo quiz para editor...');
console.log('✅ Conversão concluída:', editorState);
console.log('💾 Salvando alterações do editor...');
console.log('⏰ Auto-save triggered');
```

### **Tratamento de Erros**
```typescript
try {
  // Operação
} catch (error) {
  console.error('❌ Erro na operação:', error);
  throw error;
}
```

---

## 🎯 **CONCLUSÃO**

O `QuizToEditorAdapter` é um componente central que:

1. **Facilita a conversão** entre formatos de quiz e editor
2. **Mantém sincronização** bidirecional
3. **Gerencia estado** de forma consistente
4. **Fornece auto-save** automático
5. **Integra-se** com múltiplas rotas e componentes
6. **Valida dados** para garantir integridade
7. **Suporta eventos** para reatividade
8. **Configura etapas** dinamicamente

É a **ponte essencial** entre o sistema de quiz e o editor visual, garantindo uma experiência de edição fluida e consistente.
