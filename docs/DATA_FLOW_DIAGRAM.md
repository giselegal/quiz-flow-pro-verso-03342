# 📊 DIAGRAMA DE FLUXO DE DADOS

## 🔄 Fluxo Completo: Editor → Supabase → Produção

\`\`\`mermaid
graph TD
    A[👤 Usuário no Editor] -->|Edita blocos| B[💾 Cache L1 Memory]
    B -->|Clica Salvar| C{🌐 Online?}
    C -->|Sim| D[☁️ Supabase funnels.config]
    C -->|Não| E[📦 Cache L2 IndexedDB]
    D -->|Invalidação| F[🔄 Broadcast outras tabs]
    D -->|Persistido| G[📊 Dados no Banco]
    
    H[👤 Clica Publicar] -->|1. Salva tudo| D
    H -->|2. Marca published| I[✅ funnels.is_published = true]
    I -->|3. Atualiza versão| J[📈 funnels.version++]
    
    K[🏗️ Build/Deploy] -->|npm run export| L[📂 public/templates/*.json]
    L -->|Commit + Push| M[🚀 Produção]
    
    N[👥 Usuários Finais] -->|Acessa| O{🌐 Online?}
    O -->|Sim| G
    O -->|Não| L
    
    style A fill:#e1f5ff
    style D fill:#ffe1e1
    style G fill:#e1ffe1
    style L fill:#fff4e1
    style M fill:#f0e1ff
\`\`\`

## 🎯 Hierarquia de Fontes

\`\`\`mermaid
graph LR
    A[🔍 getPrimary] --> B{Cache L1?}
    B -->|Hit| Z[✅ Retorna dados]
    B -->|Miss| C{USER_EDIT Supabase?}
    C -->|Encontrou| D[💾 Atualiza Cache]
    D --> Z
    C -->|Não encontrou| E{ADMIN_OVERRIDE?}
    E -->|Encontrou| D
    E -->|Não encontrou| F{TEMPLATE_DEFAULT public/?}
    F -->|Encontrou| D
    F -->|Não encontrou| G{FALLBACK .ts?}
    G -->|Encontrou| D
    G -->|Não encontrou| H[❌ Array vazio]
    
    style B fill:#e1f5ff
    style C fill:#ffe1e1
    style F fill:#fff4e1
    style Z fill:#e1ffe1
\`\`\`

## 💾 Sistema de Cache Multi-Camadas

\`\`\`mermaid
graph TD
    A[🎮 Aplicação] --> B[L1: Memory Cache]
    B --> C[L2: IndexedDB]
    C --> D[L3: Supabase]
    D --> E[L4: public/ JSON]
    
    B -.->|TTL 5min| B
    C -.->|TTL 5min| C
    E -.->|Estático| E
    
    F[🔄 Invalidação] -->|Limpa| B
    F -->|Limpa| C
    F -->|Notifica| G[📡 BroadcastChannel]
    G -->|Outras tabs| H[🔄 Reload]
    
    style B fill:#e1f5ff
    style C fill:#ffe1e1
    style D fill:#e1ffe1
    style E fill:#fff4e1
\`\`\`

## 🚀 Fluxo de Publicação

\`\`\`mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant E as 🎨 Editor
    participant C as 💾 Cache
    participant S as ☁️ Supabase
    participant P as 📦 Produção
    
    U->>E: Edita blocos
    E->>C: Atualiza L1 (Memory)
    
    U->>E: Clica "Salvar"
    E->>S: POST funnels.config.steps
    S->>C: Invalida cache
    S-->>E: ✅ Salvo
    
    U->>E: Clica "Publicar"
    E->>E: ensureAllDirtyStepsSaved()
    E->>S: UPDATE is_published=true
    S->>S: Incrementa version
    S->>S: Define published_at
    S-->>E: ✅ Publicado
    
    Note over E,S: Produção usa dados do Supabase
    
    rect rgb(240, 240, 240)
        Note right of S: Deploy (Manual/CI/CD)
        S->>P: export:templates
        P->>P: Gera public/*.json
        P->>P: Build + Deploy
    end
\`\`\`

## 🎮 Modos de Visualização

\`\`\`mermaid
graph TD
    A[🎮 Botões do Editor] --> B{Modo?}
    
    B -->|Editar| C[✏️ canvasMode=edit]
    C --> D[Fonte: Memory Cache]
    D --> E[state.editor.stepBlocks]
    
    B -->|Visualizar Editor| F[👁️ preview+live]
    F --> G[Fonte: Supabase]
    G --> H[funnels.config.steps]
    
    B -->|Visualizar Publicado| I[🚀 preview+production]
    I --> J[Fonte: Supabase]
    J --> K[WHERE is_published=true]
    
    style C fill:#e1f5ff
    style F fill:#ffe1e1
    style I fill:#e1ffe1
\`\`\`

---

**Legenda de Cores:**
- 🔵 Azul: Cache/Memória
- 🔴 Vermelho: Supabase/Online
- 🟢 Verde: Resultado/Sucesso
- 🟡 Amarelo: Arquivos Estáticos
- �� Roxo: Produção
