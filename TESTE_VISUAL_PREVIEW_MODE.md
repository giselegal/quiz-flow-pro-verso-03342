# Teste Visual - Modo PREVIEW no Editor

## Data: 2025-10-30

## Objetivo
Validar que o modo PREVIEW do editor está funcionando corretamente com:
- ✅ Regras de seleção (minSelections, maxSelections)
- ✅ Validação de formulários
- ✅ Navegação entre steps (Next/Back)
- ✅ Cálculo e exibição de resultados

## Pré-requisitos
- Editor aberto em: `http://localhost:8080/editor?template=quiz21StepsComplete`
- Dev server rodando
- Correções aplicadas (threshold virtualização, result-congrats)

## Passos do Teste

### 1. Validação Visual - Step-01
**Ações:**
1. Abrir editor no step-01
2. Verificar se logo (intro-logo) está visível
3. Verificar se título e descrição renderizam corretamente
4. Confirmar que formulário de nome está presente

**Resultado Esperado:**
- ✅ Logo visível (132x55px)
- ✅ Título com HTML inline e cor #B89B7A
- ✅ Imagem de introdução carregada
- ✅ Campo de input "Como posso te chamar?"
- ✅ Botão "Quero Descobrir meu Estilo Agora!"

### 2. Alternar para Modo PREVIEW
**Ações:**
1. Clicar no botão "Preview" no topo do Canvas
2. Verificar que a interface muda para modo interativo
3. Confirmar que não há mais seleção de blocos (modo edit desativado)

**Resultado Esperado:**
- ✅ Botão "Preview" ativo (variant="default")
- ✅ Blocos não são mais selecionáveis
- ✅ Interface idêntica ao modo edit, mas interativa

### 3. Testar Navegação - Step-01 → Step-02
**Ações:**
1. No modo preview, preencher campo de nome com "Maria"
2. Clicar no botão "Quero Descobrir meu Estilo Agora!"
3. Verificar se avança para step-02

**Resultado Esperado:**
- ✅ Campo aceita texto
- ✅ Botão avança apenas se nome preenchido (validação)
- ✅ Navega para step-02 automaticamente
- ✅ Nome "Maria" é salvo no sessionData

### 4. Validar Regras de Seleção - Step-02
**Ações:**
1. Verificar barra de progresso (2/21 steps)
2. Ler instrução: "QUAL O SEU TIPO DE ROUPA FAVORITA?"
3. Verificar opções com imagens (8 opções em grid 2 colunas)
4. Tentar avançar sem selecionar nada → deve bloquear
5. Selecionar apenas 1 opção → deve bloquear (requer 3)
6. Selecionar 2 opções → ainda deve bloquear
7. Selecionar 3 opções → botão "Avançar" deve habilitar
8. Clicar em "Avançar"

**Resultado Esperado:**
- ✅ Barra de progresso mostra 2/21 (≈9.5%)
- ✅ Título e subtítulo visíveis
- ✅ 8 opções com imagens carregadas
- ✅ Seleção de opções funciona (visual de selected)
- ✅ Validação de minSelections=3 funcionando
- ✅ Botão "Avançar" desabilitado até 3 seleções
- ✅ Botão "Voltar" sempre habilitado
- ✅ Navega para step-03 após 3 seleções

### 5. Testar Navegação Reversa - Step-03 → Step-02
**Ações:**
1. No step-03, clicar em "Voltar"
2. Verificar se volta para step-02
3. Confirmar que seleções anteriores estão mantidas

**Resultado Esperado:**
- ✅ Botão "Voltar" funciona
- ✅ Retorna para step-02
- ✅ 3 opções previamente selecionadas ainda visíveis
- ✅ sessionData mantém estado

### 6. Navegar até Step-20 (Resultado)
**Ações:**
1. Completar steps 02-11 (perguntas de estilo)
2. Ver transição no step-12
3. Completar steps 13-18 (perguntas estratégicas)
4. Ver transição no step-19
5. Chegar no step-20 (resultado)

**Resultado Esperado:**
- ✅ Navegação fluida entre todos os steps
- ✅ Validações funcionando em cada step
- ✅ Transições renderizam corretamente
- ✅ Step-20 renderiza sem "Virtualização ativa"

### 7. Validar Renderização Step-20
**Ações:**
1. Verificar blocos atômicos do resultado:
   - result-congrats (emoji 🎉 + saudação)
   - result-main (estilo predominante)
   - result-image (imagem do estilo)
   - result-description (descrição)
   - result-secondary-styles (estilos secundários)
   - result-share (botões de compartilhamento)
   - result-cta (botão de call-to-action)
   - text-inline (transformation-benefits, method-steps)

**Resultado Esperado:**
- ✅ Todos os 11 blocos renderizam corretamente
- ✅ result-congrats usa ResultMainBlock
- ✅ Nome do usuário aparece personalizado
- ✅ Estilo predominante calculado e exibido
- ✅ Porcentagem de compatibilidade visível
- ✅ Descrição completa renderizada
- ✅ Botões de CTA funcionais

### 8. Validar Cálculo de Resultado
**Ações:**
1. Verificar se o resultado foi calculado baseado nas respostas
2. Confirmar que o estilo predominante é um dos 8 estilos
3. Verificar se estilos secundários são exibidos
4. Confirmar que porcentagens são realistas

**Resultado Esperado:**
- ✅ Resultado calculado via computeResult()
- ✅ Estilo predominante: Natural | Clássico | Contemporâneo | Elegante | Romântico | Sexy | Dramático | Criativo
- ✅ Porcentagem entre 20-100%
- ✅ Estilos secundários ordenados por score
- ✅ Contexto de ResultContext funcional

### 9. Alternar entre Edit e Preview
**Ações:**
1. No step-20, clicar em "Edit" (voltar ao modo edição)
2. Verificar que blocos voltam a ser selecionáveis
3. Clicar novamente em "Preview"
4. Confirmar que estado do preview é mantido

**Resultado Esperado:**
- ✅ Alternância entre modos funciona
- ✅ Modo Edit: blocos selecionáveis, DnD ativo
- ✅ Modo Preview: blocos não selecionáveis, quiz funcional
- ✅ sessionData persiste entre alternâncias

### 10. Validar Carregamento sem "Piscar"
**Ações:**
1. Recarregar página do editor (F5)
2. Observar carregamento dos steps
3. Navegar entre steps 01, 02, 20

**Resultado Esperado:**
- ✅ Carregamento suave, sem flash de conteúdo
- ✅ Loader otimizado usa /templates/blocks/ primeiro
- ✅ Não há múltiplas tentativas de fetch visíveis
- ✅ Transições entre steps fluidas

## Critérios de Aceitação

### ✅ Renderização
- [ ] Logo e imagens carregam corretamente
- [ ] Blocos atômicos renderizam sem erros
- [ ] Step-20 não mostra "Virtualização ativa"
- [ ] HTML inline renderiza com estilos

### ✅ Modo Preview
- [ ] Alternância Edit ↔ Preview funciona
- [ ] Quiz é funcional no modo Preview
- [ ] Navegação Next/Back funciona
- [ ] Estado persiste no sessionData

### ✅ Validações
- [ ] minSelections/maxSelections funcionam
- [ ] Formulário de nome valida entrada
- [ ] Botão "Avançar" desabilita sem validação
- [ ] Botão "Voltar" sempre habilitado

### ✅ Resultado
- [ ] Resultado é calculado corretamente
- [ ] Estilo predominante exibido
- [ ] Porcentagens realistas
- [ ] Personalização com nome do usuário

### ✅ Performance
- [ ] Carregamento sem "piscar"
- [ ] Virtualização desativada em steps < 15 blocos
- [ ] Transições suaves entre steps
- [ ] Sem re-renders excessivos

## Problemas Encontrados

### [Registrar aqui durante os testes]

1. **Problema**: _Descrever problema_
   - **Etapa**: Step XX
   - **Comportamento Esperado**: _Descrever_
   - **Comportamento Real**: _Descrever_
   - **Severidade**: Alta | Média | Baixa

2. ...

## Resumo Final

- **Data do Teste**: 2025-10-30
- **Testador**: [Nome]
- **Duração**: [XX minutos]
- **Steps Testados**: 01, 02, 03, 20
- **Bugs Encontrados**: [Número]
- **Status Geral**: ✅ Aprovado | ⚠️ Aprovado com ressalvas | ❌ Reprovado

## Próximos Passos

1. [ ] Corrigir bugs encontrados (se houver)
2. [ ] Adicionar testes automatizados para modo preview
3. [ ] Documentar casos de uso do preview no README
4. [ ] Validar com usuários reais
