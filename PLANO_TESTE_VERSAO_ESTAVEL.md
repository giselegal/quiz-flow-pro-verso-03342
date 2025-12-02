# 🧪 PLANO DE TESTE - VERSÃO ESTÁVEL DO EDITOR

**Data**: 2 de dezembro de 2025  
**Versão Estável Identificada**: `15d24cd75` (30 nov 2025)  
**Diferenças da versão atual**: 440 arquivos, +43,368/-36,307 linhas  

---

## ⚠️ IMPORTANTE: BACKUP ANTES DE TESTAR

A versão atual tem **440 arquivos modificados** em relação à versão estável. É CRÍTICO fazer backup!

---

## 📋 CHECKLIST PRÉ-TESTE

### 1. Backup Completo
```bash
# Criar branch de backup da versão atual
git checkout -b backup-antes-teste-estavel-$(date +%Y%m%d-%H%M%S)
git push origin backup-antes-teste-estavel-$(date +%Y%m%d-%H%M%S)

# Voltar ao main
git checkout main
```

### 2. Salvar Estado Atual
```bash
# Criar stash com todas as mudanças
git stash push -u -m "Estado atual antes de testar versão estável"
```

### 3. Documentar Estado Atual
```bash
# Salvar lista de arquivos modificados
git diff --stat HEAD 15d24cd75 > /tmp/diff-atual-vs-estavel.txt

# Salvar lista de commits entre versões
git log --oneline 15d24cd75..HEAD > /tmp/commits-atual-vs-estavel.txt
```

---

## 🚀 PROCEDIMENTO DE TESTE

### Método 1: Teste Temporário (Recomendado)

```bash
# 1. Ir para versão estável SEM modificar o main
git checkout 15d24cd75

# 2. Verificar que está detached
git status
# Deve mostrar: "HEAD detached at 15d24cd75"

# 3. Limpar cache do Vite
rm -rf node_modules/.vite

# 4. Verificar dependências (opcional)
npm install

# 5. Iniciar servidor
npm run dev

# 6. Testar no navegador
# Abrir: http://localhost:8080/editor

# 7. Após testar, voltar ao main
git checkout main

# 8. Recuperar stash se necessário
git stash list
git stash pop
```

### Método 2: Branch de Teste (Mais Seguro)

```bash
# 1. Criar branch de teste a partir da versão estável
git checkout -b teste-editor-estavel-15d24cd75 15d24cd75

# 2. Limpar cache
rm -rf node_modules/.vite

# 3. Instalar dependências
npm install

# 4. Iniciar servidor
npm run dev

# 5. Testar funcionalidades

# 6. Voltar ao main
git checkout main

# 7. Deletar branch de teste (se não funcionar)
git branch -D teste-editor-estavel-15d24cd75
```

---

## ✅ TESTES A REALIZAR

### Teste 1: Carregamento Básico ⏱️ 2min

```
✅ Passos:
1. Abrir http://localhost:8080/editor
2. Verificar que a página carrega sem erros
3. Abrir DevTools Console
4. Verificar ausência de erros JavaScript

✅ Critérios de Sucesso:
- [ ] Página carrega em < 5s
- [ ] Sem erros no console
- [ ] Interface visível (4 colunas)
- [ ] Sem tela branca
```

### Teste 2: Carregamento de Template ⏱️ 3min

```
✅ Passos:
1. Na interface do editor
2. Verificar se há um template carregado
3. Verificar lista de steps no painel esquerdo
4. Clicar em diferentes steps

✅ Critérios de Sucesso:
- [ ] Template carrega automaticamente
- [ ] Lista de steps aparece
- [ ] Ao clicar em step, canvas atualiza
- [ ] Blocos do step aparecem no canvas
```

### Teste 3: Biblioteca de Blocos ⏱️ 2min

```
✅ Passos:
1. Localizar painel "Biblioteca de Blocos" (2ª coluna)
2. Verificar lista de tipos de blocos
3. Verificar categorização (Perguntas, Resultados, UI)

✅ Critérios de Sucesso:
- [ ] Biblioteca visível
- [ ] 9 tipos de blocos listados
- [ ] Blocos organizados por categoria
- [ ] Cards com visual limpo
```

### Teste 4: Canvas de Edição ⏱️ 3min

```
✅ Passos:
1. Localizar canvas central (3ª coluna)
2. Verificar blocos renderizados
3. Clicar em um bloco
4. Verificar seleção visual

✅ Critérios de Sucesso:
- [ ] Canvas renderiza blocos
- [ ] Blocos clicáveis
- [ ] Seleção visual funciona
- [ ] Blocos têm preview correto
```

### Teste 5: Painel de Propriedades ⏱️ 3min

```
✅ Passos:
1. Selecionar um bloco no canvas
2. Verificar painel de propriedades (4ª coluna)
3. Modificar uma propriedade (ex: texto)
4. Verificar atualização no canvas

✅ Critérios de Sucesso:
- [ ] Painel abre ao selecionar bloco
- [ ] Propriedades do bloco aparecem
- [ ] Campos editáveis funcionam
- [ ] Canvas atualiza em tempo real
```

### Teste 6: Navegação de Steps ⏱️ 2min

```
✅ Passos:
1. No painel de steps (1ª coluna)
2. Clicar em diferentes steps
3. Verificar mudança de conteúdo no canvas
4. Verificar contador de blocos por step

✅ Critérios de Sucesso:
- [ ] Navegação entre steps funciona
- [ ] Canvas atualiza ao mudar step
- [ ] Contador de blocos correto
- [ ] Step selecionado destacado
```

### Teste 7: Edição de Blocos (CRUD) ⏱️ 5min

```
✅ Passos:
1. Selecionar um bloco
2. Modificar propriedades (texto, imagem, etc)
3. Verificar atualização
4. (Opcional) Tentar adicionar novo bloco
5. (Opcional) Tentar deletar bloco

✅ Critérios de Sucesso:
- [ ] Edição de propriedades funciona
- [ ] Mudanças refletem no canvas
- [ ] Estado interno atualiza
- [ ] Sem erros no console
```

### Teste 8: Undo/Redo ⏱️ 2min

```
✅ Passos:
1. Fazer uma edição (modificar texto)
2. Pressionar Ctrl+Z (ou Cmd+Z)
3. Verificar que edição foi desfeita
4. Pressionar Ctrl+Shift+Z (redo)
5. Verificar que edição foi refeita

✅ Critérios de Sucesso:
- [ ] Undo funciona (Ctrl+Z)
- [ ] Redo funciona (Ctrl+Shift+Z)
- [ ] Histórico mantém até 50 entradas
- [ ] Sem erros ao desfazer/refazer
```

### Teste 9: Estado Sujo (isDirty) ⏱️ 2min

```
✅ Passos:
1. Carregar template limpo
2. Fazer uma modificação
3. Verificar indicador de "não salvo" (se houver)
4. Tentar sair da página
5. Verificar aviso de mudanças não salvas (se implementado)

✅ Critérios de Sucesso:
- [ ] Estado sujo detectado
- [ ] Indicador visual aparece
- [ ] (Opcional) Aviso ao sair
```

### Teste 10: Performance ⏱️ 3min

```
✅ Passos:
1. Abrir DevTools > Performance
2. Navegar entre múltiplos steps rapidamente
3. Fazer várias edições seguidas
4. Verificar tempo de resposta

✅ Critérios de Sucesso:
- [ ] Navegação fluida (< 200ms)
- [ ] Edições responsivas (< 100ms)
- [ ] Sem travamentos
- [ ] FPS estável (> 30fps)
```

---

## 📊 TEMPLATE DE RELATÓRIO DE TESTE

Após realizar os testes, preencher:

```markdown
# RELATÓRIO DE TESTE - VERSÃO ESTÁVEL 15d24cd75

**Data do Teste**: ___/___/2025  
**Testador**: _________________  
**Duração Total**: ___ minutos  

## Resultado Geral
- [ ] ✅ PASSOU EM TODOS OS TESTES
- [ ] ⚠️ PASSOU COM RESSALVAS
- [ ] ❌ FALHOU

## Detalhamento

### Teste 1: Carregamento Básico
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Observações: _______________

### Teste 2: Carregamento de Template
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Observações: _______________

### Teste 3: Biblioteca de Blocos
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Observações: _______________

### Teste 4: Canvas de Edição
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Observações: _______________

### Teste 5: Painel de Propriedades
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Observações: _______________

### Teste 6: Navegação de Steps
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Observações: _______________

### Teste 7: Edição de Blocos
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Observações: _______________

### Teste 8: Undo/Redo
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Observações: _______________

### Teste 9: Estado Sujo
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Observações: _______________

### Teste 10: Performance
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Observações: _______________

## Erros Encontrados

### Erro 1
- **Severidade**: [ ] Crítico  [ ] Alto  [ ] Médio  [ ] Baixo
- **Descrição**: _______________
- **Reproduzir**: _______________
- **Console Output**: _______________

### Erro 2
(repetir conforme necessário)

## Conclusão

### Recomendação Final
- [ ] ✅ USAR ESTA VERSÃO (estável e funcional)
- [ ] ⚠️ USAR COM CUIDADO (funciona mas tem issues)
- [ ] ❌ NÃO USAR (instável ou quebrado)
- [ ] 🔄 TESTAR OUTRA VERSÃO

### Próximos Passos
1. _______________
2. _______________
3. _______________
```

---

## 🔄 PLANO B: TESTAR OUTRAS VERSÕES

Se a versão `15d24cd75` NÃO funcionar, testar em ordem:

### 1. Versão `9c3d66511` (Fase 2 - com Persistência)
```bash
git checkout 9c3d66511
rm -rf node_modules/.vite
npm run dev
```

### 2. Versão `3c692541a` (com Drag & Drop)
```bash
git checkout 3c692541a
rm -rf node_modules/.vite
npm run dev
```

### 3. Versão `c501cedb` (Base de muitos reverts)
```bash
git checkout c501cedb
rm -rf node_modules/.vite
npm run dev
```

---

## 🛡️ SEGURANÇA: COMO REVERTER

### Se algo der errado durante o teste:

```bash
# 1. Parar servidor (Ctrl+C)

# 2. Voltar ao main
git checkout main

# 3. Verificar estado
git status

# 4. Recuperar stash
git stash list
git stash pop

# 5. Verificar que está de volta
git log --oneline -1
```

### Se precisar reverter mudanças acidentais:

```bash
# Descartar todas as mudanças não commitadas
git reset --hard HEAD

# Limpar arquivos não rastreados
git clean -fd
```

---

## 📈 CRITÉRIOS DE SUCESSO GLOBAL

Para considerar a versão ESTÁVEL, deve passar em:

- ✅ **Mínimo 7/10 testes** com status PASS
- ✅ **Nenhum erro crítico** (que impeça uso básico)
- ✅ **Testes 1-6 obrigatórios** (funcionalidades core)
- ✅ **Performance aceitável** (< 5s para carregar)

---

## 🎯 EXPECTATIVA REALISTA

### Versão `15d24cd75` provavelmente:

✅ **VAI FUNCIONAR:**
- Carregamento de interface
- Navegação de steps
- Visualização de blocos
- Biblioteca de blocos
- Edição básica de propriedades

⚠️ **PODE TER LIMITAÇÕES:**
- Drag & Drop não implementado (só na Fase 3)
- Persistência em Supabase não implementada (só na Fase 2)
- Auto-save não implementado
- Algumas validações podem não estar completas

❌ **NÃO VAI TER:**
- Save automático em banco
- Templates V4 completos
- Integração com todos os serviços atuais
- Muitos recursos adicionados depois

---

## 📝 NOTAS FINAIS

1. **Este é um teste de arqueologia de código** - estamos voltando 2 dias no tempo
2. **Expect the expected** - a versão pode não ter todos os recursos atuais
3. **Foco no core** - o objetivo é ver se as funcionalidades BÁSICAS funcionam
4. **Documentação é rei** - a versão tem docs completas, use-as!

---

**Tempo Total Estimado**: 30-40 minutos  
**Risco**: Baixo (com backup adequado)  
**Benefício Potencial**: Alto (encontrar versão estável conhecida)  

---

*Plano criado em: 2 de dezembro de 2025*
