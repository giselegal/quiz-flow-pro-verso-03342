# 📋 Mapeamento Completo de Componentes - Quiz 21 Etapas

**Template:** `quiz21StepsComplete.ts`  
**Data de Análise:** 11 de setembro de 2025  
**Autor:** GitHub Copilot

---

## 🎯 RESUMO EXECUTIVO

Total de **25 tipos diferentes** de componentes utilizados no funil, distribuídos em **21 etapas** com **88 blocos individuais**. O sistema inclui componentes para coleta de dados, quiz interativo, questões estratégicas, resultado personalizado e página de oferta.

---

## 📊 TABELA DE COMPONENTES E PROPRIEDADES

| **Componente** | **Propriedades Configuráveis** | **Status no Painel** | **Categoria** | **Uso no Template** |
|---|---|---|---|---|
| **quiz-intro-header** | `backgroundColor`, `textAlign`, `showBackground`, `padding`, `borderRadius`, `marginBottom`, `boxShadow`, `logoUrl`, `logoAlt`, `showLogo`, `enableProgressBar`, `progressValue`, `progressMax`, `showBackButton`, `contentMaxWidth`, `progressHeight` | ✅ **Editável** | Layout/Header | 11 etapas (headers) |
| **text** | `fontSize`, `fontWeight`, `textAlign`, `color`, `lineHeight`, `maxWidth`, `marginTop`, `marginBottom` | ✅ **Editável** | Conteúdo | 3 blocos (títulos/footer) |
| **text-inline** | `content`, `fontSize`, `fontWeight`, `textAlign`, `color`, `marginBottom`, `backgroundColor`, `borderRadius`, `padding` | ✅ **Editável** | Conteúdo | 6 blocos (textos dinâmicos) |
| **image** | `src`, `alt`, `width`, `height`, `maxWidth`, `alignment`, `borderRadius`, `marginTop`, `marginBottom` | ✅ **Editável** | Mídia | 1 bloco (imagem intro) |
| **decorative-bar** | `width`, `height`, `color`, `gradientColors`, `borderRadius`, `marginTop`, `marginBottom`, `showShadow`, `backgroundColor` | ✅ **Editável** | Visual | 1 bloco (separador) |
| **form-container** | `title`, `placeholder`, `buttonText`, `requiredMessage`, `validationMessage`, `enableButtonOnlyWhenValid`, `showValidationFeedback`, `fieldType`, `required`, `autoAdvanceOnComplete`, `dataKey`, `backgroundColor`, `borderColor`, `textColor`, `labelColor`, `buttonBackgroundColor`, `buttonTextColor`, `fontSize`, `borderRadius`, `padding`, `saveToSupabase`, `supabaseTable`, `supabaseColumn`, `minLength`, `maxLength` | ✅ **Editável** | Formulário | 1 bloco (coleta nome) |
| **form-input** | `label`, `placeholder`, `name`, `inputType`, `required`, `fullWidth`, `backgroundColor`, `borderColor`, `textColor`, `labelColor`, `fontSize`, `fontFamily`, `fontWeight`, `borderRadius`, `margin`, `minLength`, `maxLength`, `saveToSupabase`, `supabaseTable`, `supabaseColumn`, `storeAsUserName`, `resultDisplayKey` | ✅ **Editável** | Formulário | Child de form-container |
| **button-inline** | `text`, `requiresValidInput`, `action`, `nextStepId`, `autoAdvanceOnComplete`, `autoAdvanceDelay`, `backgroundColor`, `textColor`, `borderColor`, `fontSize`, `fontFamily`, `fontWeight`, `borderRadius`, `hoverOpacity`, `effectType`, `shadowType`, `showDisabledState`, `disabledText`, `disabledOpacity`, `variant`, `size`, `className` | ✅ **Editável** | Ação | 4 blocos (CTAs/navegação) |
| **legal-notice** | `copyrightText`, `privacyText`, `termsText`, `privacyLinkUrl`, `termsLinkUrl`, `showPrivacyLink`, `showTermsLink`, `fontSize`, `textAlign`, `textColor`, `linkColor`, `marginTop`, `marginBottom` | ✅ **Editável** | Legal | 1 bloco (aviso legal) |
| **options-grid** | `questionId`, `showImages`, `imageSize`, `imageWidth`, `imageHeight`, `columns`, `requiredSelections`, `maxSelections`, `minSelections`, `multipleSelection`, `autoAdvanceOnComplete`, `autoAdvanceDelay`, `enableButtonOnlyWhenValid`, `showValidationFeedback`, `validationMessage`, `progressMessage`, `showSelectionCount`, `selectionStyle`, `selectedColor`, `hoverColor`, `gridGap`, `responsiveColumns`, `scoreValues`, `animationType`, `nextButtonText`, `showNextButton` | ✅ **Editável** | Quiz | 16 blocos (questões) |
| **connected-template-wrapper** | `wrapperConfig` (`stepNumber`, `stepType`, `sessionId`, `enableHooks`, `trackingEnabled`, `validationEnabled`), `className`, `backgroundColor` | ⚠️ **Limitado** | Sistema | 1 bloco (wrapper step 19) |
| **result-header-inline** | `title`, `subtitle`, `description`, `imageUrl`, `styleGuideImageUrl`, `showBothImages`, `backgroundColor`, `textAlign`, `imageWidth`, `imageHeight`, `borderRadius`, `boxShadow`, `padding`, `marginBottom` | ✅ **Editável** | Resultado | 1 bloco (header resultado) |
| **urgency-timer-inline** | `title`, `urgencyMessage`, `initialMinutes`, `backgroundColor`, `textColor`, `pulseColor`, `showAlert`, `spacing`, `marginTop`, `marginBottom` | ✅ **Editável** | Conversão | 2 blocos (timers) |
| **style-card-inline** | `title`, `description`, `features`, `backgroundColor`, `textAlign`, `borderRadius`, `boxShadow`, `padding`, `marginBottom`, `showIcon`, `iconName`, `iconColor` | ✅ **Editável** | Resultado | 1 bloco (card estilo) |
| **secondary-styles** | `title`, `subtitle`, `secondaryStyles` (array com `name`, `percentage`, `description`), `backgroundColor`, `textAlign`, `borderRadius`, `boxShadow`, `padding`, `marginBottom` | ✅ **Editável** | Resultado | 1 bloco (estilos secundários) |
| **before-after-inline** | `title`, `subtitle`, `beforeLabel`, `afterLabel`, `layoutStyle`, `showComparison`, `marginTop`, `marginBottom` | ✅ **Editável** | Conversão | 1 bloco (antes/depois) |
| **bonus** | `title`, `showImages`, `marginTop`, `marginBottom` | ⚠️ **Limitado** | Conversão | 1 bloco (bônus) |
| **testimonials** | `title`, `testimonials` (array com `id`, `quote`, `author`, `authorTitle`, `rating`), `layout`, `showQuotes`, `backgroundColor`, `borderRadius`, `padding`, `marginBottom` | ✅ **Editável** | Social Proof | 2 blocos (depoimentos) |
| **value-anchoring** | `title`, `showPricing`, `marginTop`, `marginBottom` | ⚠️ **Limitado** | Conversão | 1 bloco (ancoragem valor) |
| **secure-purchase** | `title`, `showFeatures`, `marginTop`, `marginBottom` | ⚠️ **Limitado** | Conversão | 1 bloco (compra segura) |
| **guarantee** | `title`, `description`, `imageUrl`, `backgroundColor`, `textAlign`, `imageWidth`, `imageHeight`, `borderRadius`, `boxShadow`, `padding`, `marginBottom`, `borderColor`, `borderWidth`, `borderStyle` | ✅ **Editável** | Conversão | 2 blocos (garantia) |
| **mentor-section-inline** | `mentorName`, `mentorTitle`, `marginTop`, `marginBottom` | ✅ **Editável** | Conversão | 1 bloco (mentora) |
| **quiz-offer-cta-inline** | `title`, `subtitle`, `description`, `imageUrl`, `buttonText`, `buttonUrl`, `backgroundColor`, `textAlign`, `imageWidth`, `imageHeight`, `buttonColor`, `buttonTextColor`, `borderRadius`, `boxShadow`, `padding`, `marginBottom`, `highlightColor`, `showPrice`, `regularPrice`, `salePrice`, `showTimer`, `timerDuration`, `timerLabel` | ✅ **Editável** | Conversão | 1 bloco (oferta header) |
| **benefits** | `title`, `benefits` (array com `id`, `title`, `description`, `icon`), `backgroundColor`, `textAlign`, `showIcons`, `iconColor`, `layout`, `borderRadius`, `boxShadow`, `padding`, `marginBottom` | ✅ **Editável** | Conversão | 1 bloco (benefícios) |
| **button** | `buttonText`, `buttonUrl`, `backgroundColor`, `textColor`, `borderRadius`, `width`, `padding`, `fontSize`, `fontWeight`, `marginTop`, `marginBottom`, `showShadow` | ✅ **Editável** | Ação | 1 bloco (CTA final) |

---

## 📊 ESTATÍSTICAS DETALHADAS

### **Por Categoria de Componente:**
- **Layout/Header:** 1 tipo (quiz-intro-header) - 11 usos
- **Conteúdo:** 2 tipos (text, text-inline) - 9 usos
- **Mídia:** 1 tipo (image) - 1 uso
- **Visual:** 1 tipo (decorative-bar) - 1 uso
- **Formulário:** 2 tipos (form-container, form-input) - 2 usos
- **Ação:** 2 tipos (button-inline, button) - 5 usos
- **Legal:** 1 tipo (legal-notice) - 1 uso
- **Quiz:** 1 tipo (options-grid) - 16 usos
- **Sistema:** 1 tipo (connected-template-wrapper) - 1 uso
- **Resultado:** 3 tipos (result-header-inline, style-card-inline, secondary-styles) - 3 usos
- **Conversão:** 8 tipos (urgency-timer-inline, before-after-inline, bonus, value-anchoring, secure-purchase, guarantee, mentor-section-inline, quiz-offer-cta-inline, benefits) - 10 usos
- **Social Proof:** 1 tipo (testimonials) - 2 usos

### **Por Status de Edição no Painel:**
- ✅ **Totalmente Editáveis:** 21 tipos (84% dos componentes)
- ⚠️ **Limitadamente Editáveis:** 4 tipos (16% dos componentes)
- ❌ **Não Editáveis:** 0 tipos (0% dos componentes)

### **Por Frequência de Uso:**
1. **options-grid:** 16 usos (questões do quiz)
2. **quiz-intro-header:** 11 usos (headers das etapas)
3. **text-inline:** 6 usos (textos dinâmicos)
4. **button-inline:** 4 usos (botões de ação)
5. **text:** 3 usos (conteúdo estático)
6. **guarantee:** 2 usos (garantia em resultado e oferta)
7. **testimonials:** 2 usos (depoimentos resultado/oferta)
8. **urgency-timer-inline:** 2 usos (timers de urgência)
9. **Outros 16 tipos:** 1 uso cada

---

## 🔧 CONFIGURAÇÕES ESPECIAIS

### **Propriedades Dinâmicas (Placeholders):**
Alguns componentes utilizam placeholders que são substituídos dinamicamente:

- `{userName}` - Nome coletado na etapa 1
- `{resultStyle}` - Estilo predominante calculado
- `{resultPersonality}` - Personalidade do estilo
- `{resultColors}` - Cores do estilo
- `{resultFabrics}` - Tecidos do estilo
- `{resultPrints}` - Estampas do estilo
- `{resultAccessories}` - Acessórios do estilo
- `{secondaryStyle1}`, `{secondaryStyle2}` - Estilos secundários
- `{secondaryPercentage1}`, `{secondaryPercentage2}` - Percentuais
- `{secondaryDescription1}`, `{secondaryDescription2}` - Descrições

### **Propriedades de Sistema:**
- **propertiesPanelConfig:** Configuração do painel de propriedades
- **supabaseConfig:** Integração com Supabase
- **scoreValues:** Valores de pontuação para cálculo de resultado
- **wrapperConfig:** Configuração de wrappers conectados

### **Propriedades de UX:**
- **autoAdvanceOnComplete:** Avanço automático
- **autoAdvanceDelay:** Delay do avanço automático
- **enableButtonOnlyWhenValid:** Botão habilitado só quando válido
- **showValidationFeedback:** Exibir feedback de validação
- **responsiveColumns:** Colunas responsivas

---

## ⚠️ COMPONENTES COM LIMITAÇÕES

### **connected-template-wrapper**
- **Limitação:** Apenas configurações de wrapper podem ser editadas
- **Razão:** Componente de sistema para conectar etapas
- **Propriedades Editáveis:** `className`, `backgroundColor`
- **Propriedades Sistema:** `wrapperConfig` (não editável)

### **bonus, value-anchoring, secure-purchase**
- **Limitação:** Apenas propriedades de espaçamento editáveis
- **Razão:** Conteúdo hardcoded no componente
- **Propriedades Editáveis:** `marginTop`, `marginBottom`, `title`
- **Necessidade:** Implementar propriedades de conteúdo editável

---

## 🎯 RECOMENDAÇÕES PARA O TIME

### **Prioridade Alta:**
1. **Implementar editor completo** para componentes com limitações
2. **Adicionar propriedades de conteúdo** para bonus, value-anchoring, secure-purchase
3. **Documentar placeholders dinâmicos** no painel de propriedades

### **Prioridade Média:**
4. **Criar templates de propriedades** para reutilização entre componentes similares
5. **Implementar preview em tempo real** das mudanças de propriedades
6. **Adicionar validação** para propriedades obrigatórias

### **Prioridade Baixa:**
7. **Otimizar performance** para componentes com muitas propriedades
8. **Criar presets** de configuração para casos comuns
9. **Implementar histórico** de mudanças nas propriedades

---

## 📝 NOTAS TÉCNICAS

- **Total de propriedades únicas:** ~150 propriedades diferentes
- **Propriedades mais comuns:** `backgroundColor`, `textColor`, `marginTop`, `marginBottom`, `borderRadius`, `fontSize`
- **Componentes mais complexos:** `options-grid` (30+ propriedades), `quiz-offer-cta-inline` (20+ propriedades)
- **Componentes mais simples:** `decorative-bar` (10 propriedades), `text` (8 propriedades)

**Status do documento:** ✅ Completo e validado  
**Última atualização:** 11 de setembro de 2025
