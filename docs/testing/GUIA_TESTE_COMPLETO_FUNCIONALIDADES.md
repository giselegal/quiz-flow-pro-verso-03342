# 🧪 GUIA DE TESTE COMPLETO - FUNCIONALIDADES

## 📋 **CHECKLIST DE TESTES**

### **✅ 1. DASHBOARD → CRIAR NOVO FUNIL → TESTAR NAVEGAÇÃO**

#### **Passos para Testar:**

```
1. Acesse: http://localhost:8080/admin
2. Localize o painel "Painel de Funis"
3. Teste os botões de templates:
   • "Usar Template" no funil principal (21 etapas)
   • "Duplicar" para criar cópia
   • "Novo Funil Personalizado" (botão verde)
4. Verificar navegação automática para /editor
5. Confirmar ID do funil na URL
```

#### **O que Observar:**

- ✅ Interface do dashboard carrega corretamente
- ✅ Templates são exibidos com descrições
- ✅ Botões respondem aos cliques
- ✅ Toast de confirmação aparece
- ✅ Navegação para editor funciona
- ✅ URL muda para /editor/[id-do-funil]

#### **Possíveis Problemas:**

- ❌ Erro de carregamento da página
- ❌ Botões não respondem
- ❌ Navegação não funciona
- ❌ Toast não aparece

---

### **✅ 2. EDITOR → ADICIONAR COMPONENTES → TESTAR PROPRIEDADES**

#### **Passos para Testar:**

```
1. No editor, localize a sidebar esquerda
2. Teste as abas:
   • "Blocos" - lista de componentes
   • "Páginas" - lista das 21 etapas
3. Drag & Drop de componentes:
   • Arraste um "TextInlineBlock" para o canvas
   • Arraste um "OptionsGridBlock" para o canvas
   • Arraste um "ButtonInlineBlock" para o canvas
4. Teste edição de propriedades:
   • Clique em um componente no canvas
   • Verifique se sidebar direita mostra propriedades
   • Edite texto, cores, estilos
   • Confirme mudanças em tempo real
```

#### **O que Observar:**

- ✅ Sidebar esquerda exibe componentes organizados
- ✅ Drag & drop funciona suavemente
- ✅ Componentes são adicionados ao canvas
- ✅ Sidebar direita mostra propriedades do componente selecionado
- ✅ Mudanças aparecem em tempo real no canvas
- ✅ Edição inline de textos funciona

#### **Possíveis Problemas:**

- ❌ Drag & drop não funciona
- ❌ Componentes não aparecem no canvas
- ❌ Propriedades não carregam
- ❌ Edições não são aplicadas

---

### **✅ 3. EDITOR → TESTAR 21 ETAPAS → VALIDAR RESPONSIVIDADE**

#### **Passos para Testar:**

```
1. Na aba "Páginas" (sidebar esquerda):
   • Clique em cada etapa (1-21)
   • Verifique se o canvas muda para cada etapa
   • Confirme nomes descritivos das etapas
2. Teste responsividade:
   • Use os controles de dispositivo (mobile/tablet/desktop)
   • Verifique layout em cada modo
   • Teste sidebars responsivas
3. Navegação entre etapas:
   • Use setas de navegação (se disponível)
   • Teste busca/filtro de etapas
```

#### **O que Observar:**

- ✅ Todas as 21 etapas são listadas
- ✅ Clique em etapa muda o canvas
- ✅ Nomes das etapas são descritivos
- ✅ Layout responsivo funciona bem
- ✅ Sidebars se adaptam ao dispositivo
- ✅ Navegação entre etapas é fluida

#### **Possíveis Problemas:**

- ❌ Etapas faltando ou não carregam
- ❌ Canvas não muda ao selecionar etapa
- ❌ Layout quebra em mobile
- ❌ Sidebars não se adaptam

---

### **✅ 4. EDITOR → TESTAR SALVAMENTO → VERIFICAR PERSISTÊNCIA**

#### **Passos para Testar:**

```
1. Faça alterações no funil:
   • Adicione componentes
   • Edite textos e propriedades
   • Mude configurações
2. Teste auto-save:
   • Aguarde 10 segundos após mudança
   • Verifique indicador de "Salvando..."
   • Confirme mudança para "Salvo"
3. Teste salvamento manual:
   • Clique no botão "Salvar"
   • Aguarde confirmação
4. Teste persistência:
   • Recarregue a página (F5)
   • Verifique se mudanças permanecem
   • Navegue para dashboard e volte
   • Confirme estado mantido
```

#### **O que Observar:**

- ✅ Auto-save funciona automaticamente
- ✅ Indicadores visuais de salvamento
- ✅ Botão salvar responde
- ✅ Toast de confirmação aparece
- ✅ Dados persistem após recarregar
- ✅ Estado mantido entre navegações

#### **Possíveis Problemas:**

- ❌ Auto-save não funciona
- ❌ Salvamento manual falha
- ❌ Dados se perdem ao recarregar
- ❌ Indicadores visuais não funcionam

---

## 🔧 **FUNCIONALIDADES AVANÇADAS PARA TESTAR**

### **Barra Superior do Editor:**

```
[← Dashboard] [Desfazer] [Refazer] | [Templates] [Versões] [Relatórios] [A/B Test] [Analytics] [Diagnóstico] | [Salvar] [Publicar]
```

#### **Testes Adicionais:**

1. **Templates**: Clique e verifique modal de seleção
2. **Versões**: Teste criação de nova versão
3. **Analytics**: Abra dashboard de métricas
4. **Diagnóstico**: Execute verificação do sistema
5. **Voltar Dashboard**: Teste navegação de retorno

---

## 🚨 **INDICADORES DE SUCESSO**

### **✅ Teste 100% Aprovado Se:**

- Dashboard carrega e templates funcionam
- Navegação dashboard ↔ editor é fluida
- Todos os componentes podem ser adicionados
- Propriedades são editáveis em tempo real
- Todas as 21 etapas são acessíveis
- Layout responsivo funciona bem
- Auto-save e salvamento manual funcionam
- Dados persistem entre sessões

### **⚠️ Requer Atenção Se:**

- Alguma funcionalidade demora para responder
- Layout quebra em dispositivos específicos
- Salvamento ocasionalmente falha
- Algumas etapas não carregam completamente

### **❌ Falha Crítica Se:**

- Dashboard não carrega
- Navegação está quebrada
- Componentes não podem ser adicionados
- Salvamento não funciona
- Muitas etapas estão inacessíveis

---

## 📊 **RELATÓRIO DE TESTE**

### **Data do Teste:** 26 de Julho de 2025

### **Versão:** Sistema completo integrado

### **Testador:** GitHub Copilot + Usuário

### **Resultados Esperados:**

- ✅ Sistema 100% funcional
- ✅ Todas as funcionalidades operacionais
- ✅ Interface responsiva e intuitiva
- ✅ Persistência de dados robusta

---

## 🔍 **COMANDOS DE DEBUG (Se Necessário)**

### **Console do Navegador:**

```javascript
// Verificar estado do funil
console.log('Estado atual:', localStorage.getItem('schema-driven-funnel'));

// Verificar componentes carregados
console.log('Componentes no canvas:', document.querySelectorAll('[data-block-id]').length);

// Forçar salvamento
if (window.forceSave) window.forceSave();

// Verificar conectividade
fetch('/api/health').then(r => console.log('API Status:', r.status));
```

### **Logs Úteis:**

- 🔍 Console do navegador para erros JavaScript
- 🌐 Network tab para requests HTTP
- 💾 Application tab para localStorage
- ⚡ Performance tab para timing

---

**🎯 Este guia garante que todas as funcionalidades críticas sejam testadas sistematicamente!**
