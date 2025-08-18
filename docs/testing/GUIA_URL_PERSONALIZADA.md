# Sistema de URL Personalizada e Preview - Quiz Quest

## 🌐 Funcionalidades Implementadas

### 1. **URL Personalizada de Publicação**

O editor agora permite configurar URLs personalizadas para publicação de quizzes.

#### Como usar:

1. **Salve seu projeto** primeiro usando o botão "Salvar"
2. **Clique em "Publicar"** - abrirá um modal de configuração
3. **Configure sua URL:**
   - **URL Personalizada** (opcional): Seu domínio personalizado (ex: `https://meusite.com`)
   - **Slug da URL**: Nome personalizado para o quiz (ex: `meu-quiz-incrivel`)
4. **Confirme a publicação** - o sistema gerará uma URL única

#### Exemplo de URLs geradas:

```
Domínio padrão: http://localhost:5000/meu-quiz-incrivel
Domínio personalizado: https://meusite.com/meu-quiz-incrivel
```

### 2. **Sistema de Preview**

Visualize seu quiz antes da publicação em uma nova aba.

#### Como usar:

1. **Salve seu projeto** primeiro
2. **Clique em "Preview"** - abrirá uma nova aba
3. **Teste em diferentes dispositivos:**
   - 📱 **Mobile**: Visualização para smartphones
   - 📱 **Tablet**: Visualização para tablets
   - 💻 **Desktop**: Visualização para computadores

#### Recursos do Preview:

- ✅ **Visualização em tempo real** dos componentes
- ✅ **Responsivo** para mobile/tablet/desktop
- ✅ **Interação básica** com elementos
- ✅ **Informações de debug** no rodapé

### 3. **Botão Copiar URL**

Após publicar, aparece automaticamente um botão para copiar a URL do quiz.

## 🔧 Interface Atualizada

### Novos Botões na Barra Superior:

1. **💾 Salvar**: Salva o projeto localmente
2. **👁️ Preview**: Abre preview em nova aba
3. **🌐 Publicar**: Configura URL e publica
4. **📋 Copiar URL**: Copia URL publicada (aparece após publicar)
5. **💾 Auto-Save**: Salvamento automático ativo

### Modal de Publicação:

- 📝 **Nome do Quiz**: Mostra nome atual
- 🌐 **URL Personalizada**: Campo opcional para domínio
- 🔤 **Slug da URL**: Campo para personalizar a URL final
- 📊 **Resumo**: Informações do projeto
- ✅ **Preview da URL**: Mostra URL final antes de publicar

## 💾 Sistema de Persistência

### LocalStorage Keys:

```javascript
// Dados principais
'schema-editor-project-current'; // Projeto atual
'quiz-preview-data'; // Dados temporários para preview

// Projetos publicados
'schema-editor-project-published'; // Estado de publicação
'published-quiz-[slug]'; // Projeto por slug específico
```

### Dados Salvos na Publicação:

```javascript
{
  // Dados do projeto
  funnel: { ... },
  currentPage: { ... },
  blocks: [...],

  // Metadados de publicação
  publishedAt: "2025-01-19T...",
  status: "published",
  url: "https://meusite.com/meu-quiz",
  slug: "meu-quiz",
  customDomain: "https://meusite.com",

  // Configurações
  publishSettings: {
    allowIndexing: true,
    socialSharing: true,
    analytics: true
  }
}
```

## 🎯 Fluxo de Uso Completo

### 1. **Criar/Editar Quiz**

- Adicione componentes arrastando da sidebar
- Configure propriedades no painel direito
- Salve periodicamente o projeto

### 2. **Testar com Preview**

- Clique em "Preview" para abrir nova aba
- Teste responsividade em mobile/tablet/desktop
- Verifique comportamento dos componentes

### 3. **Publicar com URL Personalizada**

- Clique em "Publicar"
- Configure domínio personalizado (opcional)
- Defina slug da URL
- Confirme publicação

### 4. **Compartilhar Quiz**

- Use botão "Copiar URL" para obter link
- Compartilhe URL personalizada
- Monitore analytics (futuro)

## 🔍 Preview - Tipos de Componentes Suportados

### ✅ Componentes Renderizados:

- **quiz-question**: Perguntas com opções e progresso
- **headline**: Títulos e subtítulos
- **text**: Blocos de texto formatado
- **image**: Imagens responsivas
- **pricing**: Ofertas com preços e CTAs

### 🔄 Componentes Genéricos:

- Outros tipos são renderizados com informações básicas
- Sistema expansível para novos componentes

## 🚀 Próximas Melhorias

### Em Desenvolvimento:

- [ ] **Analytics**: Tracking de visualizações e interações
- [ ] **SEO**: Meta tags automáticas por quiz
- [ ] **Social Sharing**: Cards personalizados para redes sociais
- [ ] **Custom Domains**: Integração real com domínios externos
- [ ] **A/B Testing**: Testes de diferentes versões
- [ ] **Export Options**: PDF, HTML estático

### Melhorias do Preview:

- [ ] **Interação completa**: Quiz funcional no preview
- [ ] **Performance metrics**: Tempo de carregamento
- [ ] **Mobile gestures**: Gestos específicos para mobile
- [ ] **Offline mode**: Cache para preview offline

## 🐛 Troubleshooting

### Preview não abre:

1. Certifique-se de ter salvado o projeto primeiro
2. Verifique se o popup não foi bloqueado pelo navegador
3. Limpe localStorage se necessário: `localStorage.clear()`

### URL personalizada não funciona:

1. Verifique se o slug não possui caracteres especiais
2. Confirme que salvou antes de publicar
3. URLs personalizadas requerem configuração de domínio real

### Dados perdidos:

1. Use "Carregar Projeto" para recuperar projetos salvos
2. Verifique localStorage no DevTools
3. Sistema mantém backup automático

---

**Versão**: 2.1.0  
**Data**: Janeiro 2025  
**Status**: ✅ Implementado e funcional
