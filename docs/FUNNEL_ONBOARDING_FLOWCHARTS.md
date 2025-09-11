# 🎯 Fluxogramas de Onboarding para Novos Desenvolvedores

> **Guias visuais para acelerar o onboarding e compreensão do sistema de funis**

Este documento complementa a documentação principal com fluxogramas simplificados e interativos, especificamente projetados para facilitar o onboarding rápido de novos desenvolvedores no Quiz Quest Challenge Verse.

---

## 🚀 **Quick Start - 5 Minutos**

```mermaid
graph LR
    subgraph "🎯 OBJETIVO: Primeiro Funil em 5 min"
        A[👋 Novo Dev] --> B[📖 npm run dev]
        B --> C[🌐 localhost:3000]
        C --> D[📊 /admin/funis]
        D --> E[➕ Criar Funil]
        E --> F[✏️ Editor Aberto]
        F --> G[✅ Success!]
    end
    
    style A fill:#e1f5fe
    style G fill:#e8f5e8
    
    A -.-> H[📚 "Se travou, leia docs"]
    H -.-> I[🔧 Troubleshooting]
```

**🎯 Resultado esperado:** Dev consegue criar e visualizar um funil básico

---

## 📚 **Deep Dive - 30 Minutos**

```mermaid
graph TD
    subgraph "🧠 COMPREENSÃO DA ARQUITETURA"
        A[🏗️ Entender Estrutura] --> B[📁 Explorar /src/core/editor]
        B --> C[🔄 Estudar Contextos]
        C --> D[🛠️ Analisar Serviços]
    end
    
    subgraph "🎮 PRÁTICA HANDS-ON"
        D --> E[✏️ Criar Funil Customizado]
        E --> F[🎨 Modificar Blocos]
        F --> G[💾 Testar Auto-save]
        G --> H[📱 Preview Responsivo]
    end
    
    subgraph "🧪 VALIDAÇÃO"
        H --> I[🔍 Inspecionar Network]
        I --> J[🐛 Testar Fallbacks]
        J --> K[📊 Verificar Métricas]
        K --> L[✅ Dev Expert!]
    end
    
    style L fill:#4caf50,color:white
```

**🎯 Resultado esperado:** Dev compreende arquitetura e pode implementar features

---

## 🔧 **Fluxo de Debug - Quando Algo Dá Errado**

```mermaid
graph TD
    A[🐛 Problema Encontrado] --> B{Qual sintoma?}
    
    B -->|Editor não carrega| C[🔍 Debug Contexto]
    B -->|Dados não salvam| D[🌐 Debug Network]
    B -->|Preview quebrado| E[📋 Debug Templates]
    B -->|Performance lenta| F[📊 Debug Métricas]
    
    C --> C1[Check UnifiedFunnelProvider]
    C --> C2[Check ContextualFunnelService]
    C1 --> C3[✅ Context Fix]
    C2 --> C3
    
    D --> D1[Check AdvancedFunnelStorage]
    D --> D2[Check Context Isolation]
    D1 --> D3[✅ Network Fix]
    D2 --> D3
    
    E --> E1[Check stepTemplateService]
    E --> E2[Check Fallback Templates]
    E1 --> E3[✅ Template Fix]
    E2 --> E3
    
    F --> F1[Check AdvancedAnalytics]
    F --> F2[Check AnalyticsDashboard]
    F1 --> F3[✅ Metrics Fix]
    F2 --> F3
    
    style A fill:#ffebee
    style C3 fill:#e8f5e8
    style D3 fill:#e8f5e8
    style E3 fill:#e8f5e8
    style F3 fill:#e8f5e8
```

---

## 🎨 **Fluxo de Criação Visual - Para Designers/Frontend**

```mermaid
graph LR
    subgraph "🎨 DESIGN THINKING"
        A[💡 Ideia de Funil] --> B[📝 Definir Etapas]
        B --> C[🎯 Escolher Template]
        C --> D[🖌️ Customizar Visual]
    end
    
    subgraph "⚡ IMPLEMENTAÇÃO"
        D --> E[✏️ Abrir Editor]
        E --> F[🧱 Gerenciar Blocos]
        F --> G[⚙️ Configurar Propriedades]
        G --> H[📱 Testar Responsividade]
    end
    
    subgraph "🚀 PUBLICAÇÃO"
        H --> I[💾 Salvar Mudanças]
        I --> J[👀 Preview Final]
        J --> K[📢 Publicar]
        K --> L[📈 Monitorar Métricas]
    end
    
    style A fill:#f3e5f5
    style L fill:#e8f5e8
```

**🎯 Foco:** Interface intuitiva, drag & drop, preview em tempo real

---

## 🛠️ **Fluxo de Backend/Services - Para Desenvolvedores Backend**

```mermaid
graph TD
    subgraph "📊 DATA LAYER"
        A[🏗️ Schema Design] --> B[💾 Supabase Tables]
        B --> C[🔄 Migration Scripts]
        C --> D[🧪 Database Tests]
    end
    
    subgraph "⚙️ SERVICE LAYER"
        D --> E[🛠️ Service Implementation]
        E --> F[✅ Validation Logic]
        F --> G[🔄 CRUD Operations]
        G --> H[🛡️ Error Handling]
    end
    
    subgraph "🌐 API LAYER"
        H --> I[📡 API Endpoints]
        I --> J[🔐 Authentication]
        J --> K[📊 Rate Limiting]
        K --> L[📈 Monitoring]
    end
    
    subgraph "🧪 TESTING"
        L --> M[🧪 Unit Tests]
        M --> N[🔗 Integration Tests]
        N --> O[🚀 E2E Tests]
        O --> P[✅ Production Ready]
    end
    
    style P fill:#4caf50,color:white
```

**🎯 Foco:** Robustez, escalabilidade, testes automatizados

---

## 📊 **Fluxo de Métricas/Observabilidade - Para DevOps/SRE**

```mermaid
graph LR
    subgraph "📊 COLETA DE DADOS"
        A[📈 Métricas de Uso] --> B[🐛 Error Tracking]
        B --> C[⚡ Performance Metrics]
        C --> D[👥 User Analytics]
    end
    
    subgraph "🔍 MONITORAMENTO"
        D --> E[📊 Dashboards]
        E --> F[🚨 Alertas]
        F --> G[📧 Notifications]
        G --> H[🔧 Auto-remediation]
    end
    
    subgraph "🎯 OTIMIZAÇÃO"
        H --> I[📈 Trend Analysis]
        I --> J[🔧 Performance Tuning]
        J --> K[🚀 Capacity Planning]
        K --> L[✅ SLA Compliance]
    end
    
    style L fill:#4caf50,color:white
```

**🎯 Foco:** Observabilidade completa, alertas proativos, otimização contínua

---

## 🎯 **Roles & Responsabilidades**

```mermaid
graph TB
    subgraph "👨‍💼 PRODUCT MANAGER"
        PM1[📋 Define Requirements]
        PM2[🎯 Set Priorities]
        PM3[📊 Track Metrics]
    end
    
    subgraph "🎨 UI/UX DESIGNER"
        UX1[💡 Design Experience]
        UX2[🎨 Create Mockups]
        UX3[🧪 User Testing]
    end
    
    subgraph "👨‍💻 FRONTEND DEV"
        FE1[⚛️ React Components]
        FE2[🎨 Styling]
        FE3[📱 Responsiveness]
    end
    
    subgraph "👩‍💻 BACKEND DEV"
        BE1[🏗️ Services]
        BE2[💾 Database]
        BE3[📡 APIs]
    end
    
    subgraph "🧪 QA ENGINEER"
        QA1[🧪 Test Cases]
        QA2[🤖 Automation]
        QA3[🐛 Bug Reports]
    end
    
    subgraph "🚀 DEVOPS"
        DO1[🐳 Deployment]
        DO2[📊 Monitoring]
        DO3[🔧 Infrastructure]
    end
    
    PM1 --> UX1
    UX2 --> FE1
    FE1 --> BE1
    BE3 --> QA1
    QA3 --> DO1
    DO2 --> PM3
    
    style PM3 fill:#e8f5e8
    style UX3 fill:#e8f5e8
    style FE3 fill:#e8f5e8
    style BE3 fill:#e8f5e8
    style QA3 fill:#e8f5e8
    style DO3 fill:#e8f5e8
```

---

## 🚨 **Troubleshooting Visual Guide**

### **Problema: Editor Não Carrega**

```mermaid
graph TD
    A[❌ Editor não carrega] --> B{Check Console}
    
    B -->|Context Error| C[🔍 UnifiedFunnelProvider missing?]
    B -->|Network Error| D[🌐 AdvancedFunnelStorage connection?]
    B -->|Permission Error| E[🔐 Context isolation issue?]
    
    C --> C1[✅ Add UnifiedFunnelProvider wrapper]
    D --> D1[✅ Check IndexedDB permissions]
    E --> E1[✅ Verify FunnelContext enum]
    
    C1 --> F[✅ Editor loads]
    D1 --> F
    E1 --> F
    
    style A fill:#ffebee
    style F fill:#e8f5e8
```

### **Problema: Context Isolation Issues**

```mermaid
graph TD
    A[❌ Dados vazando entre contextos] --> B{Qual contexto?}
    
    B -->|MY_FUNNELS| C[🎯 useMyFunnelsPersistence]
    B -->|EDITOR| D[✏️ useEditorPersistence]
    B -->|TEMPLATES| E[📋 useTemplatesPersistence]
    
    C --> C1[✅ Verify context namespace]
    D --> D1[✅ Check ContextualFunnelService]
    E --> E1[✅ Validate context isolation]
    
    C1 --> F[✅ Context isolated]
    D1 --> F
    E1 --> F
    
    style A fill:#ffebee
    style F fill:#e8f5e8
```

### **Problema: Auto-save Não Funciona**

```mermaid
graph TD
    A[❌ Auto-save failing] --> B{Check Storage}
    
    B -->|IndexedDB Error| C[🔐 AdvancedFunnelStorage check]
    B -->|Context Error| D[📝 Wrong context isolation]
    B -->|Validation Error| E[🏗️ Schema validation issue]
    
    C --> C1[✅ Verify IndexedDB permissions]
    D --> D1[✅ Check FunnelContext enum]
    E --> E1[✅ Check service validation]
    
    C1 --> F[✅ Auto-save works]
    D1 --> F
    E1 --> F
    
    style A fill:#ffebee
    style F fill:#e8f5e8
```

---

## 🏗️ **Arquitetura Moderna - Para Desenvolvedores Avançados**

```mermaid
graph LR
    subgraph "🖥️ UI LAYER"
        A[FunnelPanelPage] --> B[MyFunnelsPage]
        B --> C[MainEditorUnified]
        C --> D[AnalyticsPage]
    end
    
    subgraph "🎯 CONTEXT LAYER"
        E[FunnelContext.EDITOR] --> F[FunnelContext.MY_FUNNELS]
        F --> G[FunnelContext.TEMPLATES]
        G --> H[useContextualEditorPersistence]
    end
    
    subgraph "⚙️ SERVICE LAYER"
        I[AdvancedFunnelStorage] --> J[ContextualFunnelService]
        J --> K[UnifiedFunnelProvider]
    end
    
    subgraph "💾 DATA LAYER"
        L[(IndexedDB)] --> M[(localStorage)]
        M --> N[(Supabase)]
    end
    
    A --> H
    H --> E
    I --> L
    
    style D fill:#4caf50,color:white
    style K fill:#4caf50,color:white
    style N fill:#4caf50,color:white
```

**🎯 Foco:** Context isolation, advanced storage, modern architecture patterns

---

## 📚 **Learning Path por Experiência**

### **👶 Junior Developer (0-2 anos)**

```mermaid
graph LR
    A[📚 Read Docs] --> B[🎮 Follow Tutorial]
    B --> C[🔍 Explore Codebase]
    C --> D[🧪 Make Small Changes]
    D --> E[💡 Ask Questions]
    E --> F[🚀 First Feature]
    
    style F fill:#4caf50,color:white
```

**Tempo estimado:** 2-3 dias para produtividade básica

### **👨‍💻 Mid Developer (2-5 anos)**

```mermaid
graph LR
    A[🎯 Understand Architecture] --> B[🏗️ Study Services]
    B --> C[⚡ Implement Feature]
    C --> D[🧪 Write Tests]
    D --> E[📊 Add Metrics]
    E --> F[🎓 Mentor Others]
    
    style F fill:#4caf50,color:white
```

**Tempo estimado:** 1-2 dias para produtividade completa

### **🧙‍♂️ Senior Developer (5+ anos)**

```mermaid
graph LR
    A[🔍 Code Review] --> B[🏗️ Architecture Analysis]
    B --> C[⚡ Performance Optimization]
    C --> D[🚀 Lead Implementation]
    D --> E[📚 Document Patterns]
    E --> F[👑 Technical Lead]
    
    style F fill:#4caf50,color:white
```

**Tempo estimado:** 4-8 horas para liderança técnica

---

## 🎯 **Success Metrics para Onboarding**

```mermaid
graph TB
    subgraph "📊 MÉTRICAS DE SUCESSO"
        A[⏱️ Time to First Value] --> A1[< 5 min: Primeiro funil criado]
        B[🎯 Feature Completion] --> B1[< 2 dias: Primeira feature]
        C[🧪 Code Quality] --> C1[Tests escritos na primeira semana]
        D[📚 Knowledge Transfer] --> D1[Capaz de explicar arquitetura]
    end
    
    subgraph "🎓 NÍVEIS DE PROFICIÊNCIA"
        E[🌱 Beginner] --> E1[Cria funil básico]
        F[⚡ Intermediate] --> F1[Implementa features complexas]
        G[🚀 Advanced] --> G1[Otimiza performance]
        H[👑 Expert] --> H1[Mentora outros devs]
    end
    
    A1 --> E1
    B1 --> F1
    C1 --> G1
    D1 --> H1
    
    style H1 fill:#4caf50,color:white
```

---

## 🔗 **Links Rápidos para Onboarding**

| Fase | Tempo | Documentos | Objetivos |
|------|-------|------------|-----------|
| **🚀 Setup** | 5 min | [README](../README.md) | Ambiente rodando |
| **📚 Overview** | 15 min | [ARCHITECTURE_GUIDE](./ARCHITECTURE_GUIDE.md) | Entender estrutura |
| **🎯 Practice** | 30 min | [FUNNEL_LIFECYCLE_DOCUMENTATION](./FUNNEL_LIFECYCLE_DOCUMENTATION.md) | Criar primeiro funil |
| **⚡ Advanced** | 60 min | [IMPLEMENTACAO_METRICAS_CONCLUIDA](../IMPLEMENTACAO_METRICAS_CONCLUIDA.md) | Implementar feature |

---

## 🎉 **Conclusão**

### ✅ **Sistema de Onboarding Completo**
- 🎯 Fluxogramas para diferentes perfis de desenvolvedor
- ⏱️ Guias de tempo específicos (5min → 60min)
- 🔧 Troubleshooting visual interativo
- 📊 Métricas de sucesso claras

### 🚀 **Para Novos Desenvolvedores**
1. **Comece aqui:** Siga o Quick Start de 5 minutos
2. **Se der problema:** Use o Fluxo de Debug
3. **Para aprofundar:** Siga o Deep Dive de 30 minutos
4. **Para contribuir:** Estude os fluxogramas específicos para seu role

### 📈 **Próximos Passos**
- [ ] Criar vídeos tutoriais baseados nos fluxogramas
- [ ] Implementar onboarding interativo na UI
- [ ] Adicionar badges de progresso para desenvolvedores
- [ ] Criar bot de Slack para dúvidas de onboarding

---

**📝 Documento criado:** `11/09/2025`  
**🎯 Status:** ✅ **Fluxogramas de onboarding implementados e validados**  
**🔧 Última atualização:** `Alinhamento com arquitetura moderna (AdvancedFunnelStorage + Context Isolation)`
