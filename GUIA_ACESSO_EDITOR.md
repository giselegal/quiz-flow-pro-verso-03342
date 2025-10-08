# 🚀 GUIA RÁPIDO: Como Acessar o Editor Quiz-Estilo

**Atualizado:** 08/10/2025  
**Status:** ✅ Editor 100% Funcional

---

## ⚡ ACESSO RÁPIDO

### 1️⃣ Iniciar Servidor
```bash
cd /workspaces/quiz-quest-challenge-verse
npm run dev
```

### 2️⃣ Abrir Editor (Recomendado)
```
http://localhost:8080/editor/quiz-estilo-production
```

**Pronto!** 🎉 O editor está funcional e pronto para uso.

---

## 🔗 TODAS AS ROTAS DISPONÍVEIS

### 🌟 **Opção 1: Editor de Produção** (RECOMENDADO)
```
URL: http://localhost:8080/editor/quiz-estilo-production
```
**Por que usar:**
- ✅ Interface mais completa
- ✅ Preview em tempo real
- ✅ Validações automáticas
- ✅ Publicação direta
- ✅ Mais estável

---

### 🎨 **Opção 2: Editor Modular 4 Colunas**
```
URL: http://localhost:8080/editor/quiz-estilo-modular-pro
```
**Por que usar:**
- ✅ Layout de 4 colunas
- ✅ Edição avançada de propriedades
- ✅ Melhor para edições complexas
- ✅ Painel de propriedades expandido

---

### 📝 **Opção 3: Editor WYSIWYG**
```
URL: http://localhost:8080/editor/quiz-estilo
```
**Por que usar:**
- ✅ Edição visual direta
- ✅ Sistema legado integrado
- ✅ Compatibilidade total
- ✅ Interface familiar

---

### 🧩 **Opção 4: Editor Template Engine**
```
URL: http://localhost:8080/editor/quiz-estilo-template-engine
```
**Por que usar:**
- ✅ Sistema de templates
- ✅ Componentes reutilizáveis
- ✅ Versionamento avançado
- ✅ Para desenvolvedores

---

## 🎯 FLUXO DE TRABALHO

### Editar um Step

1. **Acessar o editor** em uma das rotas acima
2. **Selecionar step** na lista (step-01 a step-21)
3. **Editar conteúdo:**
   - Títulos
   - Textos
   - Opções
   - Imagens
   - Botões
4. **Ver preview** em tempo real
5. **Salvar rascunho** (não afeta produção)
6. **Publicar** quando estiver pronto

---

## 🔧 O QUE VOCÊ PODE EDITAR

### ✅ Todos os 21 Steps

#### **Step-01: Introdução**
- Título
- Pergunta do formulário
- Placeholder
- Texto do botão
- Imagem de fundo

#### **Steps 02-11: Perguntas do Quiz**
- Número da pergunta
- Texto da pergunta
- 8 opções de estilo:
  - Natural
  - Clássico
  - Contemporâneo
  - Elegante
  - Romântico
  - Sexy
  - Dramático
  - Criativo
- Imagens das opções
- Seleções obrigatórias (requiredSelections)

#### **Steps 13-18: Perguntas Estratégicas**
- Texto da pergunta
- Opções de resposta
- Mapeamento para ofertas

#### **Steps 10, 12, 19: Transições**
- Texto de transição
- Duração (ms)
- Botão continuar (opcional)

#### **Step-20: Resultado**
- Texto com variável {userName}
- Cartão de resultado por estilo
- Imagens personalizadas

#### **Step-21: Ofertas**
- 4 variações obrigatórias:
  - Romântico + Orçamento Baixo
  - Romântico + Orçamento Alto
  - Dramático + Orçamento Baixo
  - Dramático + Orçamento Alto
- Título da oferta
- Descrição
- Texto do botão
- Depoimento (quote + autor)

---

## ✅ VALIDAÇÕES AUTOMÁTICAS

O editor **valida automaticamente**:

### 1. IDs de Estilo
- Impede IDs inválidos
- Sugere IDs corretos
- Aliases sem acento (romantico = romântico)

### 2. Navegação (nextStep)
- Garante que steps conectam corretamente
- Previne loops infinitos
- Valida step de destino existe

### 3. OfferMap Completo
- Exige 4 variações no step-21
- Valida estrutura de testimonials
- Garante todos os campos obrigatórios

### 4. Formulário (step-01)
- Exige campo userName
- Valida campo obrigatório
- Garante estrutura correta

---

## 🚀 PUBLICAR PARA PRODUÇÃO

### Passo a Passo:

1. **Editar steps** no editor
2. **Validar** - editor valida automaticamente
3. **Salvar rascunho** - clique em "Salvar Rascunho"
4. **Review** - revise todas as alterações
5. **Publicar** - clique em "Publicar para Produção"
6. **Confirmar** - confirme a publicação
7. **Testar** - quiz abre em nova aba

### ⚠️ ATENÇÃO
```
A publicação substitui IMEDIATAMENTE o quiz em /quiz-estilo
Certifique-se de testar no preview antes de publicar!
```

---

## 📊 VER QUIZ EM PRODUÇÃO

### Acessar Quiz Publicado
```
http://localhost:8080/quiz-estilo
```

### Preview com Dados de Teste
```
http://localhost:8080/quiz-estilo?preview=true
```

---

## 🧪 TESTAR ALTERAÇÕES

### Antes de Publicar:

1. **Use o preview** no editor
2. **Navegue por todos os steps**
3. **Teste o formulário** (step-01)
4. **Teste as opções** (steps 02-11)
5. **Teste as transições** (steps 10, 12, 19)
6. **Veja o resultado** (step-20)
7. **Veja a oferta** (step-21)

### Depois de Publicar:

1. **Abra o quiz** em /quiz-estilo
2. **Complete o fluxo** do início ao fim
3. **Teste em mobile** (responsive)
4. **Teste performance** (carregamento)

---

## ❓ FAQ - PERGUNTAS FREQUENTES

### P: Qual editor devo usar?
**R:** Use `/editor/quiz-estilo-production` (mais completo e estável)

### P: As alterações aparecem imediatamente?
**R:** Preview SIM, produção NÃO (precisa publicar)

### P: Posso desfazer uma publicação?
**R:** Não diretamente, mas pode editar novamente e republicar

### P: Quantos steps posso editar?
**R:** Todos os 21 steps (100% editáveis)

### P: O editor valida erros?
**R:** SIM! 4 validadores automáticos previnem erros

### P: Posso adicionar novos steps?
**R:** Não nesta versão (21 steps fixos)

### P: Posso mudar a ordem dos steps?
**R:** Não recomendado (quebra navegação)

### P: Posso adicionar novas opções de estilo?
**R:** SIM! Basta adicionar nas opções

### P: Como adicionar imagens?
**R:** Cole a URL da imagem no campo de imagem

### P: Onde ficam os rascunhos salvos?
**R:** No banco de dados local (persistente)

---

## 🔧 TROUBLESHOOTING

### Editor não carrega?
```bash
# 1. Parar servidor
Ctrl + C

# 2. Limpar cache
npm run clean

# 3. Reinstalar
npm install

# 4. Reiniciar
npm run dev
```

### Alterações não aparecem?
```
1. Limpe o cache do navegador (Ctrl + Shift + R)
2. Verifique se salvou o rascunho
3. Verifique se publicou para produção
```

### Erro de validação?
```
1. Leia a mensagem de erro (indica o problema)
2. Corrija o campo indicado
3. Tente salvar novamente
```

### Quiz não abre em /quiz-estilo?
```
1. Verifique se servidor está rodando
2. Acesse http://localhost:8080/quiz-estilo
3. Verifique console do navegador (F12)
```

---

## 📞 SUPORTE

### Problemas Comuns
- ✅ Editor não carrega → Reiniciar servidor
- ✅ Alterações não salvam → Verificar validações
- ✅ Preview não atualiza → Limpar cache
- ✅ Publicação falha → Ver console de erros

### Logs Úteis
```bash
# Ver logs do servidor
npm run dev

# Ver erros no navegador
F12 → Console
```

---

## 🎉 PRONTO PARA USAR!

O editor está **100% funcional** e pronto para:
- ✅ Editar todos os 21 steps
- ✅ Preview em tempo real
- ✅ Validações automáticas
- ✅ Salvar rascunhos
- ✅ Publicar para produção

### Começar Agora:
```bash
npm run dev
```

```
http://localhost:8080/editor/quiz-estilo-production
```

**Boa edição! 🚀**

---

*Guia criado: Fase 6 - Testes End-to-End*  
*Data: 08/10/2025*
