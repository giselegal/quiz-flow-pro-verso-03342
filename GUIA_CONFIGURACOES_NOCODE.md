# 🎛️ **CONFIGURAÇÕES NOCODE - GUIA DO USUÁRIO**

## 📍 **ONDE ACESSAR AS CONFIGURAÇÕES**

O usuário consegue configurar **TUDO** relacionado ao sistema híbrido que implementamos através de interfaces visuais, sem precisar tocar em código. Aqui estão todos os locais:

---

## 🚀 **1. PAINEL PRINCIPAL DE CONFIGURAÇÃO DE ETAPAS**

### **📍 Localização**: `/admin/no-code-config` → Aba **"Etapas"**

### **🎯 O que pode ser configurado:**

#### **Auto-avanço por Etapa:**
- ✅ **Ativar/Desativar** auto-avanço para cada uma das 21 etapas
- ⏱️ **Definir delay** personalizado (500ms a 5000ms)
- 📊 **Ver estatísticas** em tempo real (quantas etapas com auto-avanço vs manual)

#### **Comportamentos Visuais:**
- 📈 **Mostrar/Ocultar barra de progresso** por etapa
- ↩️ **Permitir/Bloquear** botão "Voltar" por etapa

#### **Validações Personalizadas:**
- 🔍 **Tipo de validação**: Input, Seleção ou Nenhuma
- ✔️ **Campos obrigatórios**: Sim/Não
- 🔢 **Seleções mínimas/máximas** (para perguntas de múltipla escolha)
- 📝 **Tamanho mínimo** de texto (para campos de entrada)
- 💬 **Mensagens personalizadas** de validação

#### **Interface Visual:**
- 📋 **Lista de todas as 21 etapas** com status visual
- 🎨 **Abas organizadas** (Comportamento / Validação)
- 💾 **Salvar individual** ou **salvar todas** as configurações
- 🔄 **Restaurar padrões** com um clique

---

## 🎨 **2. PAINEL DE PROPRIEDADES DOS COMPONENTES**

### **📍 Localização**: **Editor Visual** → **Painel de Propriedades** (direita)

### **🎯 O que pode ser configurado:**
- 🔧 **Propriedades específicas** de cada bloco/componente
- 📝 **Textos dinâmicos** com interpolação `{userName}`
- 🎨 **Estilos visuais** (cores, fontes, layouts)
- ⚡ **Comportamentos** específicos do componente

### **🧩 Variações Disponíveis:**
- `NoCodePropertiesPanel` - Interface completa com todas as propriedades
- `UniversalNoCodePanel` - Interface universal categorizada
- `EnhancedNoCodePropertiesPanel` - Versão moderna com undo/redo

---

## ⚙️ **3. EDITOR NOCODE INTEGRADO**

### **📍 Localização**: **Editor Principal** → **Botão "Configurações NOCODE"**

### **🎯 O que pode ser configurado:**
- 🔗 **Conexões entre etapas** (fluxo de navegação)
- 🌐 **Configurações globais** do funil
- 👁️ **Preview em tempo real** das mudanças

---

## 🌍 **4. CONFIGURAÇÕES GLOBAIS DO SISTEMA**

### **📍 Localização**: `/admin/no-code-config` → **Outras Abas**

### **🎯 Configurações Disponíveis:**

#### **🏷️ Header (Cabeçalho):**
- 🎨 Logo, cores, tipografia
- 📱 Responsividade e layout

#### **🔍 SEO e Metadados:**
- 📈 Título, descrição, keywords
- 📸 Open Graph, imagens sociais

#### **🌐 Domínio Personalizado:**
- 🔗 URL customizada
- 🔒 Certificados SSL automáticos

#### **📊 Tracking e Analytics:**
- 📍 Facebook Pixel, Google Analytics
- 🎯 Conversões e métricas

#### **🎨 Temas e Branding:**
- 🎨 Cores primárias e secundárias
- 🖼️ Imagens de fundo
- ✨ Animações e efeitos

---

## 💡 **5. COMO USAR O SISTEMA HÍBRIDO**

### **🔄 Hierarquia de Prioridade (Automática):**

1. **Override JSON específico** - Configurações manuais via interface NoCode
2. **Master JSON** - Template global (`quiz21-complete.json`)
3. **TypeScript Fallback** - Configurações padrão do sistema

### **🎯 Fluxo de Uso Típico:**

1. **Acesse** `/admin/no-code-config`
2. **Clique na aba "Etapas"**
3. **Selecione uma etapa** (1-21) na lista à esquerda
4. **Configure comportamentos** na aba "Comportamento":
   - Auto-avanço: ON/OFF
   - Delay: 500ms - 5000ms
   - Progresso: Mostrar/Ocultar
   - Voltar: Permitir/Bloquear
5. **Configure validações** na aba "Validação":
   - Tipo: Input/Seleção/Nenhuma
   - Obrigatório: Sim/Não
   - Regras específicas por tipo
6. **Clique "Salvar"** para aplicar à etapa específica
7. **OU clique "Salvar Todas"** para aplicar em lote

### **🔧 Configurações Técnicas Automáticas:**

O sistema automaticamente:
- ✅ **Carrega configurações** na ordem de prioridade
- 💾 **Salva overrides** no localStorage (pode ser backend)
- 🔄 **Atualiza componentes** em tempo real
- 🎯 **Aplica regras** aos `OptionsGridBlock` e outros componentes
- 📊 **Mantém cache** para performance

---

## 📋 **6. CONFIGURAÇÕES PADRÃO IMPLEMENTADAS**

### **🚀 Auto-avanço Habilitado:**
- **Etapas 2-11** (perguntas do quiz) → 1500ms de delay
- Usuário seleciona opções → avança automaticamente

### **⏸️ Avanço Manual:**
- **Etapa 1** (coleta de nome) → Usuário deve clicar "Avançar"
- **Etapas 13-18** (questões estratégicas) → Usuário deve clicar "Avançar"
- **Etapas 12, 19-21** (transições, resultado, oferta) → Usuário controla

### **✅ Validações Inteligentes:**
- **Etapa 1**: Input obrigatório, mínimo 2 caracteres
- **Etapas 2-11**: 3 seleções obrigatórias
- **Etapas 13-18**: 1 seleção obrigatória

---

## 🎉 **RESULTADO FINAL**

### **✨ Para o Usuário Final (Administrador):**
- 🎛️ **Interface visual completa** para configurar tudo
- 📱 **Sem código necessário** - 100% NoCode
- ⚡ **Mudanças em tempo real** - aplicação imediata
- 🔄 **Sistema robusto** com fallbacks automáticos

### **🚀 Para o Sistema:**
- 📊 **JSON como fonte de verdade** (como solicitado)
- 🔗 **Integração perfeita** com componentes React
- 💾 **Persistência automática** de configurações
- ⚡ **Performance otimizada** com cache inteligente

---

## 🔗 **LINKS DIRETOS DE ACESSO**

- 🎛️ **Configuração de Etapas**: `http://localhost:8080/admin/no-code-config` (aba "Etapas")
- 🏠 **Dashboard Principal**: `http://localhost:8080/admin/dashboard`  
- ⚙️ **Editor Principal**: `http://localhost:8080/admin/editor`
- 🎨 **Todas as Configurações**: `http://localhost:8080/admin/no-code-config`

**🎯 O usuário tem controle TOTAL sobre o comportamento das 21 etapas do quiz através de uma interface visual moderna e intuitiva!**