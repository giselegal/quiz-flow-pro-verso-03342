# 📊 **DIAGRAMA VISUAL - Sistema de IDs dos Templates**

```
🌟 QUIZ QUEST CHALLENGE VERSE - SISTEMA DE IDs
═══════════════════════════════════════════════════════════════════

📁 CAMADA 1: TEMPLATES (Arquivos JSON)
┌─────────────────────────────────────────────────────────────────┐
│  /src/config/templates/                                         │
│  ├── step-01.json  ─────► templateId: "quiz-step-01"           │
│  ├── step-02.json  ─────► templateId: "quiz-step-02"           │
│  ├── step-03.json  ─────► templateId: "quiz-step-03"           │
│  │   ...                                                        │
│  └── step-21.json  ─────► templateId: "quiz-step-21"           │
│                                                                 │
│  📋 Cada template contém:                                       │
│  • metadata (id, nome, descrição, tags)                        │
│  • design (cores, fontes, estilos)                             │
│  • blocks (componentes visuais)                                │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
🗄️ CAMADA 2: FUNIS (Banco de Dados)
┌─────────────────────────────────────────────────────────────────┐
│  TABLE: funnels                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ id (UUID)           │ template_id      │ name           │    │
│  ├─────────────────────┼──────────────────┼────────────────┤    │
│  │ 550e8400-e29b...    │ quiz-step-01     │ Quiz Estilo    │    │
│  │ 6ba7b811-9dad...    │ quiz-step-05     │ Quiz Ocasiões  │    │
│  │ 6ba7b812-9dad...    │ quiz-step-01     │ Quiz Pessoal   │    │
│  └─────────────────────┴──────────────────┴────────────────┘    │
│                                                                 │
│  TABLE: funnel_steps                                            │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ funnel_id       │ order_index │ name        │ type   │       │
│  ├─────────────────┼─────────────┼─────────────┼────────┤       │
│  │ 550e8400...     │ 1           │ Introdução  │ intro  │       │
│  │ 550e8400...     │ 2           │ Pergunta 1  │ quiz   │       │
│  │ 550e8400...     │ 3           │ Pergunta 2  │ quiz   │       │
│  └─────────────────┴─────────────┴─────────────┴────────┘       │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
🔗 CAMADA 3: ETAPAS (Sistema de Navegação)
┌─────────────────────────────────────────────────────────────────┐
│  stageId → stepNumber → templateId                              │
│                                                                 │
│  "step-1"    ──► 1  ──► "quiz-step-01"                         │
│  "step-5"    ──► 5  ──► "quiz-step-05"                         │
│  "step-21"   ──► 21 ──► "quiz-step-21"                         │
│                                                                 │
│  📍 Identificação do Funil Atual:                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. URL params     ?funnelId=550e8400...               │   │
│  │ 2. localStorage   editor:funnelId                      │   │
│  │ 3. ENV variable   VITE_DEFAULT_FUNNEL_ID               │   │
│  │ 4. Fallback       'default-funnel'                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

🔄 FLUXO DE CARREGAMENTO
═══════════════════════════════════════════════════════════════════

1️⃣ IDENTIFICAÇÃO
   User navega para: /step/5?funnelId=550e8400-e29b-41d4...

2️⃣ EXTRAÇÃO
   ┌─ stageId: "step-5"
   ├─ stepNumber: 5
   ├─ templateId: "quiz-step-05"
   └─ funnelId: "550e8400-e29b-41d4..."

3️⃣ CARREGAMENTO
   Template: /src/config/templates/step-05.json
   Funil: SELECT * FROM funnels WHERE id = '550e8400...'

4️⃣ RENDERIZAÇÃO
   ┌─ Base template (design + estrutura)
   ├─ Customizações do funil (cores, textos)
   └─ Dados salvos do usuário (respostas)

🎨 EXEMPLO DE TEMPLATE (step-05.json)
═════════════════════════════════════════════════════════════════════

{
  "templateVersion": "2.0",
  "metadata": {
    "id": "quiz-step-05",                    ← Template ID único
    "name": "Pergunta sobre Ocasiões",      ← Nome amigável
    "category": "quiz-question",             ← Categoria
    "type": "multiple-choice",               ← Tipo
    "tags": ["quiz", "occasions", "style"]  ← Tags p/ busca
  },
  "design": {
    "primaryColor": "#B89B7A",               ← Dourado terroso
    "secondaryColor": "#432818",             ← Marrom escuro
    "backgroundColor": "#FAF9F7",            ← Creme claro
    "button": {
      "background": "linear-gradient(...)",  ← Gradiente
      "borderRadius": "10px"
    }
  },
  "blocks": [
    {
      "id": "step05-title",                  ← ID único do bloco
      "type": "heading",
      "properties": {
        "text": "Em quais ocasiões você...",
        "level": 1,
        "color": "#432818"
      }
    },
    {
      "id": "step05-options",
      "type": "multiple-choice",
      "properties": {
        "options": [
          { "value": "work", "label": "Trabalho" },
          { "value": "casual", "label": "Casual" },
          { "value": "party", "label": "Festas" }
        ],
        "required": true
      }
    }
  ]
}

🚀 EXEMPLOS DE USO
═════════════════════════════════════════════════════════════════════

// ✅ Carregar template por etapa
const template = await templateService.getTemplateByStep(5);
console.log(template.metadata.name); // "Pergunta sobre Ocasiões"

// ✅ Navegar entre etapas
const navigator = new FunnelNavigator(funnelId);
await navigator.goToStep(5);          // Vai para etapa 5
await navigator.next();               // Vai para etapa 6
await navigator.goToStage("step-10"); // Pula para etapa 10

// ✅ Buscar templates
const quizTemplates = await templateService.searchTemplates("quiz");
const styleTemplates = templates.filter(t =>
  t.metadata.tags.includes("style")
);

// ✅ Identificar funil atual
const funnelId = getFunnelIdFromEnvOrStorage();
const stepNumber = parseStepNumberFromStageId("step-15"); // → 15

🎯 VANTAGENS DO SISTEMA
═════════════════════════════════════════════════════════════════════

✅ REUTILIZAÇÃO
   • Um template pode ser usado em múltiplos funis
   • Personalização individual sem afetar outros

✅ ORGANIZAÇÃO
   • IDs padronizados e previsíveis
   • Estrutura clara e navegável
   • Fácil manutenção e debug

✅ ESCALABILIDADE
   • Novos templates: apenas adicionar JSON
   • Novos funis: criar entrada no banco
   • Sistema suporta crescimento ilimitado

✅ FLEXIBILIDADE
   • Templates base + customizações específicas
   • Múltiplos formatos de ID suportados
   • Compatibilidade com sistema legado

✅ PERFORMANCE
   • Carregamento sob demanda
   • Cache inteligente
   • Otimização automática

🔧 DEBUGGING
═════════════════════════════════════════════════════════════════════

Logs detalhados para troubleshooting:

🔍 FunnelId da URL: quiz-demo-funnel
🔢 StepNumber extraído: step-15 => 15
✅ Template 15 carregado via fetch
🎨 EditorContext: Carregando template automaticamente para step-15
✅ Template step-15 carregado: 8 blocos
📊 Info atual: {
  stepNumber: 15,
  stageId: "step-15",
  templateId: "quiz-step-15",
  funnelId: "quiz-demo-funnel",
  progress: 71.43
}
```
