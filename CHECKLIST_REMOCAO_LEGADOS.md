
# Checklist de Remoção de Legados e Duplicidades

## 1. Backup
- [x] Confirmar que todos os arquivos redundantes/legados foram salvos em backup (ex: pasta `cleanup-backup-20250910_*`).

## 2. Mapeamento e Validação
- [x] Listar todos os arquivos/componentes marcados para remoção:
	- src/pages/EditorProSimpleTest.tsx
	- src/pages/EditorTeste.tsx
	- src/pages/QuizEditorShowcase.tsx
	- src/pages/EditorProTestPage.tsx
	- src/pages/EditorWithPreview.tsx
	- src/pages/EditorWithPreview-FINAL.tsx
	- src/pages/QuizEditorProDemo.tsx
	- src/pages/EditorProTestFixed.tsx
	- src/pages/EditorWithPreview-clean.tsx
	- vite.config.js (duplicado)
- [ ] Verificar dependências e importações em outros arquivos.
- [ ] Validar se não há uso em rotas, testes ou scripts.

## 3. Remoção Segura
- [ ] Remover arquivos/componentes redundantes do projeto.
- [ ] Atualizar rotas e referências para evitar erros de importação.
- [ ] Atualizar documentação interna (comentários, READMEs, etc).

## 4. Testes e Validação
- [ ] Rodar testes automatizados e manuais nos fluxos críticos.
- [ ] Validar funcionamento dos editores e renderizadores unificados.
- [ ] Verificar logs e mensagens de erro.

## 5. Revisão Final
- [ ] Revisar o commit de remoção para garantir clareza e rastreabilidade.
- [ ] Compartilhar o relatório de arquivos removidos e impactos esperados.
