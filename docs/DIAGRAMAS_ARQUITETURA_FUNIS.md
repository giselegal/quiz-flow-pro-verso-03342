```mermaid
graph TB
    subgraph "🎯 SISTEMA DE FUNIS - ARQUITETURA COMPLETA"
        subgraph "📱 Frontend (React)"
            A[App.tsx] --> B[Router]
            B --> C[/admin - Dashboard]
            B --> D[/editor - MainEditor]
            B --> E[/quiz - Produção]
        end
        
        subgraph "🧠 Contextos"
            F[FunnelsProvider]
            G[EditorProvider]
            H[AuthProvider]
        end
        
        subgraph "📋 Templates Base"
            I[FUNNEL_TEMPLATES<br/>- quiz-estilo-completo<br/>- quiz-estilo<br/>- quiz-personalidade<br/>- funil-21-etapas]
            J[QUIZ_STYLE_21_STEPS_TEMPLATE<br/>step-1 → step-21<br/>Blocos detalhados]
        end
        
        subgraph "🆔 Sistema de IDs"
            K[URL Parameter<br/>?funnel=ID]
            L[LocalStorage<br/>editor:funnelId]
            M[Environment<br/>VITE_DEFAULT_FUNNEL_ID]
            N[Fallback<br/>default-funnel]
        end
        
        subgraph "🛠️ Services"
            O[templateService.ts<br/>Clonagem e conversão]
            P[funnelTemplateService.ts<br/>Criação de funis]
            Q[funnelService.ts<br/>CRUD operations]
        end
        
        subgraph "💾 Persistência"
            R[(Supabase)]
            S[LocalStorage Cache]
            T[Memory State]
        end
        
        subgraph "🎨 Components"
            U[AdminSidebar]
            V[QuizFlowPage]
            W[PropertiesPanel]
            X[QuizStepRenderer]
        end
    end
    
    %% Conexões principais
    D --> F
    F --> I
    F --> J
    F --> O
    
    K --> F
    L --> F
    M --> F
    N --> F
    
    O --> P
    P --> Q
    Q --> R
    
    F --> S
    F --> T
    
    D --> V
    V --> W
    V --> X
    C --> U
    
    %% Estilos
    classDef frontend fill:#e1f5fe
    classDef context fill:#f3e5f5
    classDef template fill:#e8f5e8
    classDef service fill:#fff3e0
    classDef storage fill:#fce4ec
    classDef component fill:#f1f8e9
    
    class A,B,C,D,E frontend
    class F,G,H context
    class I,J template
    class O,P,Q service
    class R,S,T storage
    class U,V,W,X component
```

## 🔄 FLUXO DE CRIAÇÃO DE FUNIL

```mermaid
sequenceDiagram
    participant User as 👤 Usuário
    participant Dash as 📊 Dashboard
    participant TS as 🛠️ TemplateService
    participant DB as 💾 Supabase
    participant Editor as ✏️ Editor
    participant FC as 🧠 FunnelsContext
    
    User->>Dash: 1. Clica "Criar Funil"
    Dash->>Dash: 2. Exibe templates
    User->>Dash: 3. Seleciona template
    Dash->>TS: 4. createFunnelFromTemplate(templateId)
    
    TS->>DB: 5. Busca template base
    TS->>DB: 6. Cria registro do funil
    TS->>DB: 7. Clona páginas com novos IDs
    TS->>Dash: 8. Retorna novo funnelId
    
    Dash->>Editor: 9. Redirect /editor?funnel=newId
    Editor->>FC: 10. Inicializa contexto
    FC->>FC: 11. getFunnelIdFromEnvOrStorage()
    FC->>FC: 12. getTemplateBlocks() com CLONE
    FC->>Editor: 13. Blocos únicos carregados
    Editor->>User: 14. Editor pronto para uso
```

## 🔧 PROCESSO DE CLONAGEM (CORREÇÃO DO PONTO CEGO)

```mermaid
graph LR
    subgraph "❌ ANTES (Problema)"
        A1[Template Original] --> B1[Funil 1]
        A1 --> C1[Funil 2]
        A1 --> D1[Funil 3]
        B1 -.-> E1[Mutação compartilhada]
        C1 -.-> E1
        D1 -.-> E1
    end
    
    subgraph "✅ DEPOIS (Solução)"
        A2[Template Original] --> F[cloneBlocks()]
        F --> G[Funil 1 - Clone único]
        F --> H[Funil 2 - Clone único] 
        F --> I[Funil 3 - Clone único]
        G --> J[Dados isolados]
        H --> K[Dados isolados]
        I --> L[Dados isolados]
    end
    
    classDef problema fill:#ffebee,stroke:#f44336
    classDef solucao fill:#e8f5e8,stroke:#4caf50
    
    class A1,B1,C1,D1,E1 problema
    class A2,F,G,H,I,J,K,L solucao
```

## 📊 ESTRUTURA DE DADOS

```mermaid
erDiagram
    FUNNEL_TEMPLATES {
        string templateId PK
        string name
        string description
        FunnelStep[] defaultSteps
    }
    
    QUIZ_STYLE_21_STEPS_TEMPLATE {
        string stepId PK
        Block[] blocks
    }
    
    FUNNEL_INSTANCE {
        string funnelId PK
        string templateId FK
        string name
        string userId
        boolean published
        datetime created
        datetime updated
    }
    
    FUNNEL_PAGE {
        string pageId PK
        string funnelId FK
        string pageType
        int pageOrder
        string title
        json blocks
        json metadata
    }
    
    BLOCK {
        string id PK
        string type
        int order
        json content
        json properties
    }
    
    FUNNEL_TEMPLATES ||--|| FUNNEL_INSTANCE : "creates"
    QUIZ_STYLE_21_STEPS_TEMPLATE ||--|| FUNNEL_PAGE : "clones_to"
    FUNNEL_INSTANCE ||--o{ FUNNEL_PAGE : "contains"
    FUNNEL_PAGE ||--o{ BLOCK : "has"
```
