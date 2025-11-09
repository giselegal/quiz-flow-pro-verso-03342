# 🎨 Editor de Templates JSON - Guia Completo

**Rota:** `/editor/json-templates`  
**Status:** ✅ Implementado  
**Versão:** 1.0

---

## 📖 Visão Geral

O **Editor de Templates JSON** é uma interface visual para editar os 21 templates do Quiz de Estilo sem precisar mexer diretamente nos arquivos JSON.

### ✨ Funcionalidades

- ✅ **Visualização de todos os templates** (21 steps)
- ✅ **Edição visual** de metadata, layout e blocos
- ✅ **Editor JSON avançado** para edições manuais
- ✅ **Validação em tempo real** usando QuizStepAdapter
- ✅ **Preview ao vivo** em nova aba
- ✅ **Importar/Exportar** templates JSON
- ✅ **Duplicar templates** para criar variações
- ✅ **Busca e filtros** por nome, ID ou categoria
- ✅ **Recarregamento dinâmico** dos templates

---

## 🚀 Como Acessar

### 1. **URL Direta**
```
http://localhost:5173/editor/json-templates
```

### 2. **Menu de Navegação**
- Dashboard → Editor → Templates JSON
- Ou adicione um link no menu principal

### 3. **Via Code**
```typescript
import { useLocation } from 'wouter';

const [, setLocation] = useLocation();
setLocation('/editor/json-templates');
```

---

## 🎯 Como Usar

### **1. Selecionar um Template**

1. Na sidebar esquerda, você vê a lista de 21 templates
2. Clique em qualquer template para selecioná-lo
3. O template aparece no painel direito

**Informações exibidas:**
- ✅ Nome do template
- ✅ ID único (ex: `quiz-step-02`)
- ✅ Número de blocos
- ✅ Categoria (question, transition, result, etc.)

---

### **2. Visualizar Template (Modo Leitura)**

Quando você seleciona um template, ele abre em **modo de visualização**:

**Seção Preview:**
- Mostra o JSON completo formatado
- Background color aplicada visualmente

**Seção Informações:**
- 📊 Quantidade de blocos
- 📅 Última atualização
- 🏷️ Tags do template
- 🔢 Versão do template

**Ações disponíveis:**
- 👁️ **Preview** - Abre o template no quiz em nova aba
- 📋 **Duplicar** - Cria uma cópia do template
- 💾 **Exportar** - Baixa o JSON do template
- ✏️ **Editar** - Entra no modo de edição

---

### **3. Editar Template**

Clique no botão **"Editar"** para entrar no modo de edição.

#### **3.1. Edição Visual (Metadata)**

**Nome do Template:**
```typescript
Input: selectedTemplate.metadata.name
Exemplo: "QUAL O SEU TIPO DE ROUPA FAVORITA?"
```

**Categoria:**
```typescript
Input: selectedTemplate.metadata.category
Exemplo: "quiz-question"
```

**Descrição:**
```typescript
Textarea: selectedTemplate.metadata.description
Exemplo: "Primeira questão sobre estilo de roupa"
```

#### **3.2. Edição Visual (Layout)**

**Largura do Container:**
```typescript
Input: selectedTemplate.layout.containerWidth
Opções: "full", "narrow", "medium", "wide"
```

**Cor de Fundo:**
```typescript
Input color: selectedTemplate.layout.backgroundColor
Picker de cor visual
```

#### **3.3. Editor JSON Avançado**

Para edições mais complexas, use o **Editor JSON**:

```json
{
  "templateVersion": "2.0",
  "metadata": {
    "id": "quiz-step-02",
    "name": "Step step-02",
    "description": "question step for quiz",
    "category": "quiz-question",
    "tags": ["quiz", "style", "question"],
    "createdAt": "2025-10-11T10:44:14.170Z",
    "updatedAt": "2025-10-11T10:44:14.170Z"
  },
  "layout": {
    "containerWidth": "full",
    "spacing": "small",
    "backgroundColor": "#FAF9F7",
    "responsive": true
  },
  "blocks": [
    {
      "id": "question-text",
      "type": "text-inline",
      "position": 0,
      "properties": {
        "content": "QUAL O SEU TIPO DE ROUPA FAVORITA?",
        "fontSize": "text-xl",
        "fontWeight": "font-bold"
      }
    }
  ]
}
```

**Validação em tempo real:**
- ✅ Se o JSON for válido, nenhum erro aparece
- ❌ Se o JSON for inválido, mostra erro: "JSON inválido"

---

### **4. Salvar Template**

Clique no botão **"Salvar"** para:

1. ✅ **Validar** o template usando `QuizStepAdapter.fromJSON()`
2. ✅ **Atualizar** a data de modificação
3. ✅ **Salvar** no localStorage (simulação)
4. ✅ **Mostrar** mensagem de sucesso

**Validação:**
- Se o template passar na conversão `JSON → QuizStep`, está válido
- Se falhar, mostra o erro de validação

**Mensagens:**
- ✅ Sucesso: "✅ Template salvo com sucesso!"
- ❌ Erro: Mostra a mensagem de erro específica

---

### **5. Preview do Template**

Clique no botão **"Preview"** para:

1. Abrir nova aba do navegador
2. Carregar o quiz no step específico
3. Ver o template renderizado ao vivo

**URL gerada:**
```
/quiz-estilo?step=02&preview=true
```

---

### **6. Exportar Template**

Clique no botão **"Exportar"** para:

1. Gerar arquivo JSON
2. Baixar automaticamente
3. Nome do arquivo: `quiz-step-XX.json`

**Uso:**
- Backup de templates
- Compartilhar com outros desenvolvedores
- Versionamento manual

---

### **7. Importar Template**

Clique no botão **"Importar"** para:

1. Abrir seletor de arquivo
2. Escolher arquivo `.json`
3. Carregar no editor

**Validação:**
- ✅ JSON válido: Carrega e abre em modo de edição
- ❌ JSON inválido: Mostra erro

---

### **8. Duplicar Template**

Clique no botão **"Duplicar"** para:

1. Criar cópia do template
2. Adiciona `(Cópia)` ao nome
3. Gera novo ID: `quiz-step-XX-copy`

**Uso:**
- Criar variações de templates
- Testar modificações sem afetar original

---

### **9. Excluir Template**

Na **Zona de Perigo** (fundo vermelho):

1. Clique em "Excluir Template"
2. Confirma ação
3. Remove da lista

⚠️ **CUIDADO:** Ação irreversível!

---

## 🔍 Busca e Filtros

Use a **barra de busca** no topo da lista para filtrar por:

- 📝 **Nome do template**
- 🔖 **ID** (ex: `quiz-step-02`)
- 🏷️ **Categoria** (ex: `question`)

**Exemplo:**
```
Busca: "question"
Resultado: Mostra apenas templates de perguntas
```

---

## 🔄 Recarregar Templates

Clique no botão **🔄** (Refresh) para:

1. Recarregar templates dos arquivos `/templates/`
2. Sincronizar com o sistema de arquivos
3. Útil após edições externas

---

## 📊 Estrutura de um Template

### **Campos Obrigatórios:**

```typescript
interface JsonTemplate {
  templateVersion: string;        // Ex: "2.0"
  metadata: {
    id: string;                   // Ex: "quiz-step-02"
    name: string;                 // Ex: "QUAL O SEU TIPO..."
    description: string;          // Descrição do step
    category: string;             // "quiz-question", "quiz-result", etc.
    tags: string[];               // ["quiz", "style", "question"]
    createdAt: string;            // ISO 8601
    updatedAt: string;            // ISO 8601
  };
  layout: {
    containerWidth: string;       // "full", "narrow", "medium", "wide"
    spacing: string;              // "small", "medium", "large"
    backgroundColor: string;      // Hex color
    responsive: boolean;          // true/false
  };
  validation: Record<string, any>;  // Regras de validação
  analytics: {
    events: string[];             // Eventos tracked
    trackingId: string;           // ID único para analytics
    utmParams: boolean;           // Capturar UTMs?
    customEvents: string[];       // Eventos customizados
  };
  blocks: Array<{
    id: string;                   // ID único do bloco
    type: string;                 // "text-inline", "options-grid", etc.
    position: number;             // Ordem de renderização
    properties: Record<string, any>;  // Props específicas do bloco
  }>;
}
```

---

## 🎨 Tipos de Blocos

### **1. text-inline**
Texto simples em linha

```json
{
  "id": "question-text",
  "type": "text-inline",
  "position": 0,
  "properties": {
    "content": "QUAL O SEU TIPO DE ROUPA FAVORITA?",
    "fontSize": "text-xl",
    "fontWeight": "font-bold"
  }
}
```

### **2. options-grid**
Grid de opções clicáveis

```json
{
  "id": "options-grid",
  "type": "options-grid",
  "position": 1,
  "properties": {
    "options": [
      {
        "id": "natural",
        "text": "Conforto e praticidade",
        "image": "https://...",
        "styleId": "natural"
      }
    ],
    "requiredSelections": 3,
    "columns": 2
  }
}
```

### **3. form-input**
Campo de entrada de texto

```json
{
  "id": "name-input",
  "type": "form-input",
  "position": 1,
  "properties": {
    "placeholder": "Digite seu nome",
    "inputType": "text"
  }
}
```

### **4. button-inline**
Botão de ação

```json
{
  "id": "continue-button",
  "type": "button-inline",
  "position": 2,
  "properties": {
    "text": "Continuar"
  }
}
```

### **5. result-display**
Exibição de resultado

```json
{
  "id": "result",
  "type": "result-display",
  "position": 0,
  "properties": {}
}
```

### **6. offer-card**
Card de oferta

```json
{
  "id": "offer",
  "type": "offer-card",
  "position": 0,
  "properties": {}
}
```

---

## 🛠️ Integração com Backend (Futuro)

Atualmente, o editor salva no **localStorage**. Para integrar com backend:

### **1. Criar API de Templates**

```typescript
// POST /api/templates/:id
async function saveTemplate(templateId: string, template: JsonTemplate) {
  const response = await fetch(`/api/templates/${templateId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template),
  });
  return response.json();
}
```

### **2. Atualizar `saveTemplateToFile()`**

```typescript
const saveTemplateToFile = async (template: JsonTemplate) => {
  // Substituir localStorage por API call
  const response = await fetch('/api/templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao salvar template');
  }
  
  return response.json();
};
```

### **3. Endpoint de Listagem**

```typescript
// GET /api/templates
async function loadTemplates() {
  const response = await fetch('/api/templates');
  return response.json();
}
```

---

## 🐛 Troubleshooting

### **Problema: Templates não carregam**
**Solução:**
1. Verificar se `/templates/` existe
2. Executar `npm run templates:all`
3. Clicar no botão 🔄 (Refresh)

### **Problema: Erro ao salvar**
**Solução:**
1. Verificar JSON no editor avançado
2. Validar estrutura de blocos
3. Verificar campos obrigatórios

### **Problema: Preview não funciona**
**Solução:**
1. Verificar se `/quiz-estilo` está funcionando
2. Verificar parâmetro `?step=XX` na URL
3. Verificar console do navegador

---

## 📈 Roadmap

### **v1.1 (Próxima versão)**
- [ ] Arrastar e soltar blocos
- [ ] Editor visual de blocos (sem JSON)
- [ ] Histórico de versões
- [ ] Undo/Redo
- [ ] Comparação de templates

### **v1.2**
- [ ] Integração com backend
- [ ] Multi-usuário (colaboração)
- [ ] Comentários em templates
- [ ] Aprovação de mudanças

### **v2.0**
- [ ] AI Assistant para sugerir melhorias
- [ ] A/B Testing de templates
- [ ] Analytics de performance
- [ ] Templates marketplace

---

## 🔗 Links Relacionados

- **Documentação Fase 1:** `FASE_1_COMPLETA_STATUS.md`
- **Guia Fase 2:** `FASE_2_GUIA_RAPIDO.md`
- **QuizStepAdapter:** `src/adapters/QuizStepAdapter.ts`
- **Templates JSON:** `/templates/step-XX-template.json`

---

## 💡 Exemplos de Uso

### **Exemplo 1: Editar cor de fundo**
```typescript
1. Selecionar template step-02
2. Clicar em "Editar"
3. Na seção Layout, mudar "Cor de Fundo" para #FFFFFF
4. Clicar em "Salvar"
5. Clicar em "Preview" para ver mudança
```

### **Exemplo 2: Adicionar novo bloco**
```typescript
1. Selecionar template step-05
2. Clicar em "Editar"
3. No Editor JSON Avançado, adicionar:
{
  "id": "new-block",
  "type": "text-inline",
  "position": 2,
  "properties": {
    "content": "Novo texto"
  }
}
4. Clicar em "Salvar"
```

### **Exemplo 3: Criar variação de template**
```typescript
1. Selecionar template step-03
2. Clicar em "Duplicar"
3. Editar a cópia
4. Alterar nome para "Step 03 - Variação A"
5. Modificar propriedades
6. Salvar
```

---

## 🎓 Boas Práticas

### ✅ **DO (Faça)**
- ✅ Sempre testar com "Preview" antes de salvar
- ✅ Usar "Duplicar" para criar variações
- ✅ Exportar backup antes de grandes mudanças
- ✅ Usar nomes descritivos nos blocos
- ✅ Manter estrutura consistente entre templates

### ❌ **DON'T (Não Faça)**
- ❌ Editar JSON diretamente sem validação
- ❌ Excluir templates sem backup
- ❌ Mudar `templateVersion` manualmente
- ❌ Remover campos obrigatórios
- ❌ Usar IDs duplicados em blocos

---

## 🚀 Conclusão

O **Editor de Templates JSON** torna fácil gerenciar os 21 templates do Quiz de Estilo visualmente, sem precisar editar arquivos JSON manualmente.

**Próximo passo:** Integrar com backend para persistência real!

---

**Status:** ✅ Pronto para uso  
**Rota:** `/editor/json-templates`  
**Versão:** 1.0  
**Data:** 11/10/2025
