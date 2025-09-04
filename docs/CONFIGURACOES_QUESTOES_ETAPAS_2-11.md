# 📊 CONFIGURAÇÕES DAS QUESTÕES - ETAPAS 2-11

## 🎯 **VISÃO GERAL DO SISTEMA**

As **Etapas 2-11** representam o **core do quiz** - 10 questões pontuadas que determinam o estilo predominante do usuário. Cada etapa segue um padrão consistente de configuração com pequenas variações baseadas no tipo de conteúdo.

---

## 🔧 **PADRÃO DE CONFIGURAÇÃO UNIFICADO**

### **Configurações Padrão (Todas as Etapas 2-11)**

```typescript
properties: {
  questionId: 'q{N}_{categoria}',           // Formato: q1_roupa_favorita, q2_personalidade...
  requiredSelections: 3,                   // SEMPRE 3 seleções obrigatórias
  maxSelections: 3,                        // SEMPRE máximo 3 seleções
  minSelections: 3,                        // SEMPRE mínimo 3 seleções
  multipleSelection: true,                 // SEMPRE seleção múltipla habilitada
  autoAdvanceOnComplete: true,             // SEMPRE avança automaticamente
  autoAdvanceDelay: 1500,                  // SEMPRE delay de 1.5 segundos
  enableButtonOnlyWhenValid: true,         // Botão só ativo quando válido
  showValidationFeedback: true,            // Feedback visual de validação
  validationMessage: 'Selecione 3 opções para continuar',
  progressMessage: 'Você selecionou {count} de {required} opções',
  showSelectionCount: true,                // Contador visual das seleções
  selectedColor: '#3B82F6',               // Cor azul para selecionados
  hoverColor: '#EBF5FF',                  // Cor de hover azul claro
  gridGap: 12,                            // Espaçamento entre opções
  responsiveColumns: false,               // Colunas fixas (exceto imagens)
}
```

---

## 📋 **ANÁLISE DETALHADA POR ETAPA**

### **🎯 ETAPA 2 - Questão 1: ROUPAS FAVORITAS**
- **QuestionId**: `q1_roupa_favorita`
- **Tipo**: Grid de imagens (2 colunas)
- **Opções**: 8 estilos de roupas (natural_q1, classico_q1, contemporaneo_q1, etc.)
- **Especial**: `selectionStyle: 'border'` (borda ao selecionar)
- **Imagens**: 300x300px customizadas, responsivas

### **🎯 ETAPA 3 - Questão 2: PERSONALIDADE**
- **QuestionId**: `q2_personalidade`
- **Tipo**: Grid de texto (1 coluna)
- **Opções**: 8 descrições de personalidade
- **Especial**: `selectionStyle: 'background'` (background ao selecionar)
- **Layout**: Vertical, sem imagens

### **🎯 ETAPA 4 - Questão 3: IDENTIFICAÇÃO VISUAL**
- **QuestionId**: `q3_visual_identificacao`
- **Tipo**: Grid de imagens (2 colunas)
- **Opções**: 8 estilos visuais com imagens
- **Especial**: `selectionStyle: 'border'`
- **Imagens**: 300x300px customizadas

### **🎯 ETAPA 5 - Questão 4: DETALHES**
- **QuestionId**: `q4_detalhes`
- **Tipo**: Grid de texto (1 coluna)
- **Opções**: 8 tipos de detalhes preferidos
- **Especial**: `selectionStyle: 'background'`
- **Layout**: Vertical, foco em texto

### **🎯 ETAPA 6 - Questão 5: ESTAMPAS**
- **QuestionId**: `q5_estampas`
- **Tipo**: Grid de imagens (2 colunas)
- **Opções**: 8 tipos de estampas
- **Especial**: `selectionStyle: 'border'`, `responsiveColumns: true`
- **Imagens**: 300x300px, adaptáveis

### **🎯 ETAPA 7 - Questão 6: CASACOS**
- **QuestionId**: `q6_casaco`
- **Tipo**: Grid de imagens (2 colunas)
- **Opções**: 8 estilos de casacos
- **Especial**: `selectionStyle: 'border'`, `responsiveColumns: true`
- **Imagens**: 300x300px de casacos

### **🎯 ETAPA 8 - Questão 7: CALÇAS**
- **QuestionId**: `q7_calca`
- **Tipo**: Grid de imagens (2 colunas)
- **Opções**: 8 estilos de calças
- **Especial**: `selectionStyle: 'border'`, `responsiveColumns: true`
- **Imagens**: 300x300px de calças

### **🎯 ETAPA 9 - Questão 8: SAPATOS**
- **QuestionId**: `q8_sapatos`
- **Tipo**: Grid de imagens (2 colunas)
- **Opções**: 8 tipos de sapatos
- **Especial**: `selectionStyle: 'border'`, `responsiveColumns: true`
- **Imagens**: 300x300px de sapatos

### **🎯 ETAPA 10 - Questão 9: ACESSÓRIOS**
- **QuestionId**: `q9_acessorios`
- **Tipo**: Grid de imagens (2 colunas)
- **Opções**: 8 tipos de acessórios
- **Especial**: `selectionStyle: 'border'`, `responsiveColumns: true`
- **Imagens**: 300x300px de acessórios

### **🎯 ETAPA 11 - Questão 10: TECIDOS**
- **QuestionId**: `q10_tecidos`
- **Tipo**: Grid de texto (1 coluna)
- **Opções**: 8 características de tecidos
- **Especial**: `selectionStyle: 'background'`
- **Layout**: Última questão, texto descritivo

---

## ⚙️ **SISTEMA DE PONTUAÇÃO**

### **ScoreValues Padrão**
Cada questão possui um sistema de pontuação baseado nos 8 estilos:

```typescript
scoreValues: {
  natural_qN: 1,        // Estilo Natural
  classico_qN: 1,       // Estilo Clássico
  contemporaneo_qN: 1,  // Estilo Contemporâneo
  elegante_qN: 1,       // Estilo Elegante
  romantico_qN: 1,      // Estilo Romântico
  sexy_qN: 1,           // Estilo Sexy
  dramatico_qN: 1,      // Estilo Dramático
  criativo_qN: 1,       // Estilo Criativo
}
```

### **Lógica de Cálculo**
- **3 seleções por questão** × **10 questões** = **30 pontos totais**
- Cada escolha adiciona **1 ponto** ao estilo correspondente
- O estilo com **maior pontuação final** determina o resultado
- Sistema de **balanceamento automático** evita empates

---

## 📱 **REGRAS DE VALIDAÇÃO**

### **Validação de Seleção**
```typescript
// Regras aplicadas em tempo real
requiredSelections: 3,    // Exatamente 3 seleções obrigatórias
maxSelections: 3,         // Não permite mais de 3 seleções
enableButtonOnlyWhenValid: true,  // Botão só ativo com 3 seleções
showValidationFeedback: true,     // Feedback visual contínuo
```

### **Auto-Avanço Inteligente**
```typescript
// Configuração de avanço automático
autoAdvanceOnComplete: true,      // Avança quando válido
autoAdvanceDelay: 1500,          // Delay de 1.5s para revisão
```

---

## 🎨 **PADRÕES VISUAIS**

### **Estilos de Seleção**
1. **`border`**: Para questões com imagens (Etapas 2, 4, 6-10)
   - Borda azul ao selecionar
   - Melhor para conteúdo visual

2. **`background`**: Para questões de texto (Etapas 3, 5, 11)
   - Background azul ao selecionar
   - Melhor para texto puro

### **Layout Responsivo**
- **Imagens**: `columns: 2` com `responsiveColumns: true`
- **Texto**: `columns: 1` com layout vertical
- **Gap**: `gridGap: 12px` consistente

---

## 🔄 **FLUXO DE NAVEGAÇÃO**

### **Progressão Automática**
1. Usuário seleciona **3 opções**
2. Validação instantânea ativa
3. **Delay de 1.5s** para revisão
4. **Auto-avanço** para próxima etapa
5. Dados salvos automaticamente

### **Controles Manuais**
- **Botão "Próximo"**: Só ativo quando válido
- **Botão "Anterior"**: Sempre disponível
- **Progresso visual**: Barra de 0% a 100%

---

## 📊 **MÉTRICAS DE CONFIGURAÇÃO**

### **Estatísticas do Sistema**
- **10 questões pontuadas** (Etapas 2-11)
- **80 opções totais** (8 por questão)
- **8 categorias de estilo** consistentes
- **30 pontos de decisão** do usuário
- **1.5s delay padrão** para UX otimizada

### **Padrões de Identificação**
- **QuestionId**: `qN_{categoria}` onde N = 1-10
- **OptionId**: `{estilo}_qN` onde estilo = natural|classico|etc
- **Nomeação**: Consistente em todas as etapas

---

## ✅ **CHECKLIST DE VALIDAÇÃO**

### **Configuração Correta**
- [ ] `requiredSelections: 3` em todas as etapas
- [ ] `multipleSelection: true` habilitado
- [ ] `autoAdvanceOnComplete: true` ativo
- [ ] `scoreValues` com 8 estilos mapeados
- [ ] `questionId` único e consistente

### **UX Optimizada**
- [ ] `autoAdvanceDelay: 1500` padronizado
- [ ] Feedback visual de validação
- [ ] Contador de seleções ativo
- [ ] Cores consistentes (#3B82F6)

### **Responsividade**
- [ ] Layouts adaptáveis por tipo de conteúdo
- [ ] Imagens otimizadas (300x300px)
- [ ] Grid responsivo onde necessário

---

## 🎯 **RESUMO EXECUTIVO**

As **Etapas 2-11** implementam um sistema de quiz **altamente consistente** e **otimizado**, onde:

1. **Todas as questões** seguem o padrão **3 seleções obrigatórias**
2. **Auto-avanço em 1.5s** garante fluxo contínuo
3. **Sistema de pontuação uniforme** com 8 estilos
4. **Validação em tempo real** com feedback visual
5. **Layouts adaptativos** baseados no tipo de conteúdo

O sistema está **100% configurado** e pronto para uso no **ModernPropertiesPanel**, garantindo **editabilidade completa** de todas as propriedades via interface visual.
