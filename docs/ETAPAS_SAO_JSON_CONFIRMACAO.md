# ✅ **SIM! As Etapas SÃO JSON - Estrutura Completa**

## 🎯 **Confirmação: As informações das etapas estão em formato JSON**

### 📁 **1. Arquivo JSON Principal - Todas as 21 Etapas**

**Localização:** `/src/config/optimized21StepsFunnel.json`

```json
{
  "id": "optimized-21-steps-funnel",
  "name": "Quiz de Estilo - 21 Etapas Otimizadas",
  "metadata": {
    "totalSteps": 21,
    "coreComponents": 13,
    "hasCalculations": true
  },
  "steps": [
    {
      "id": "step-1",
      "name": "Introdução",
      "description": "Página inicial do quiz com coleta de nome",
      "order": 1,
      "type": "intro",
      "blocks": [
        // ✅ Todos os blocos da etapa 1 em JSON
        {
          "id": "header-logo",
          "type": "quiz-intro-header",
          "properties": {
            "logoUrl": "https://res.cloudinary.com/...",
            "logoAlt": "Logo Gisele Galvão",
            "progressValue": 0
          }
        }
        // ... mais blocos
      ]
    },
    {
      "id": "step-2",
      "name": "Q1 - Qual seu estilo de vida?",
      "type": "question",
      "questionData": {
        "id": "q1",
        "title": "Qual seu estilo de vida?",
        "options": [
          {
            "id": "a",
            "text": "Prática e dinâmica",
            "score": { "natural": 3, "classico": 1 }
          }
        ]
      }
    }
    // ... continua até step-21
  ]
}
```

### 📁 **2. Templates Individuais JSON (21 arquivos)**

**Localização:** `/src/config/templates/`

```
step-01.json ← Etapa 1 completa
step-02.json ← Etapa 2 completa
step-03.json ← Etapa 3 completa
...
step-21.json ← Etapa 21 completa
```

**Estrutura de cada arquivo:**

```json
{
  "templateVersion": "2.0",
  "metadata": {
    "id": "quiz-step-01",
    "name": "Bem-vinda ao Quiz de Estilo",
    "type": "intro"
  },
  "design": {
    "primaryColor": "#B89B7A",
    "secondaryColor": "#432818",
    "backgroundColor": "#FAF9F7"
  },
  "steps": [
    {
      "id": "step-1",
      "elements": [
        // ✅ Todos os elementos da etapa em JSON
        {
          "id": "logo-image",
          "type": "image-block",
          "config": {
            "src": "https://...",
            "width": 120,
            "height": 120
          }
        }
      ]
    }
  ]
}
```

### 📁 **3. Exemplos JSON de Etapas**

**Localização:** `/examples/`

```
step01-blocks.json        ← Blocos da etapa 1
step01-blocks-corrigido.json ← Versão corrigida
etapa1-para-editor.json   ← Etapa 1 formatada para editor
```

**Exemplo de estrutura:**

```json
[
  {
    "id": "step01-header-logo",
    "type": "quiz-intro-header",
    "properties": {
      "logoUrl": "https://res.cloudinary.com/...",
      "logoWidth": 120,
      "logoHeight": 120,
      "progressValue": 0,
      "showProgress": false
    }
  },
  {
    "id": "step01-main-title",
    "type": "text",
    "properties": {
      "content": "Chega de um guarda-roupa lotado...",
      "fontSize": "text-3xl",
      "fontWeight": "font-bold",
      "color": "#432818"
    }
  }
]
```

## 🔧 **Como o JSON é Carregado no Código**

### **TemplateManager.ts** - Gerenciador de Templates JSON

```typescript
// ✅ MAPEAMENTO DAS 21 ETAPAS PARA JSON
const TEMPLATE_MAPPING = {
  "step-1": "/templates/step-01-template.json",
  "step-2": "/templates/step-02-template.json",
  // ... até step-21
};

// ✅ CARREGA BLOCOS DA ETAPA A PARTIR DO JSON
static async loadStepBlocks(stepId: string): Promise<Block[]> {
  const templatePath = TEMPLATE_MAPPING[stepId];
  const jsonData = await TemplateJsonLoader.load(templatePath);
  return this.convertJsonToBlocks(jsonData);
}
```

### **EditorContext.tsx** - Inicialização com Templates JSON

```typescript
// ✅ AS ETAPAS SÃO INICIALIZADAS A PARTIR DOS TEMPLATES JSON
const [stages, setStages] = useState<FunnelStage[]>(() => {
  const allStepTemplates = STEP_TEMPLATES; // ← Baseado nos JSONs

  const initialStages = allStepTemplates.map(stepTemplate => ({
    id: `step-${stepTemplate.stepNumber}`,
    name: stepTemplate.name,
    // ✅ TEMPLATE CARREGADO DO JSON:
    metadata: {
      templateBlocks: getTemplateByStep(stepTemplate.stepNumber)?.templateFunction() || [],
    },
  }));

  return initialStages;
});
```

## 📊 **Estrutura Híbrida: JSON + TypeScript**

| **Origem**         | **Formato**                       | **Onde**                 | **O que Contém**                 |
| ------------------ | --------------------------------- | ------------------------ | -------------------------------- |
| **JSON Principal** | `optimized21StepsFunnel.json`     | `/src/config/`           | ✅ Todas 21 etapas completas     |
| **Templates JSON** | `step-01.json` até `step-21.json` | `/src/config/templates/` | ✅ Cada etapa individual         |
| **Exemplos JSON**  | `step01-blocks.json` etc          | `/examples/`             | ✅ Exemplos para desenvolvimento |
| **TypeScript**     | `EditorContext.tsx`               | `/src/context/`          | ✅ Estado e inicialização        |
| **TypeScript**     | `stepTemplatesMapping.ts`         | `/src/config/`           | ✅ Mapeamento para JSONs         |

## 🎯 **Fluxo Completo JSON → Etapas:**

```
1. TemplateManager.ts carrega step-XX.json
           ↓
2. JSON é convertido para objetos Block[]
           ↓
3. EditorContext inicializa FunnelStage[] com os blocos
           ↓
4. FunnelStagesPanel renderiza as 21 etapas na UI
           ↓
5. Usuário navega entre etapas definidas nos JSONs
```

## ✅ **RESUMO: As Etapas SÃO JSON!**

**SIM**, as informações das etapas estão em formato JSON:

- 📁 **1 JSON Principal** com todas as 21 etapas (`optimized21StepsFunnel.json`)
- 📁 **21 JSONs Individuais** com templates de cada etapa (`step-01.json` até `step-21.json`)
- 📁 **JSONs de Exemplo** para desenvolvimento e testes
- 🔧 **Sistema Híbrido** que carrega JSONs e converte para TypeScript no runtime

**As etapas são definidas em JSON e depois convertidas para objetos TypeScript pelo sistema!** 🚀
