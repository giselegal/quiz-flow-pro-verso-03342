# Checklist de Completude do Editor /quiz-estilo

Estado gerado em: 2025-09-29

## Legenda
- ✅ Implementado e exposto na UI
- ⚠️ Parcial (backend pronto, UI parcial ou faltam campos)
- ❌ Ausente / não implementado

## 1. Estrutura & Carregamento
| Item | Status | Observações |
|------|--------|-------------|
| Carregamento dinâmico de steps (adapter + generator) | ✅ | `quiz21StepsAdapter` + `blockTemplateGenerator` |
| Cache + invalidação em updateStep/updateBlock | ✅ | `invalidateQuizTemplate` chamado pelo service |
| Feature flags (ALL/BLOCKS/QUESTIONS) | ✅ | Modo exibido no status bar |
| Fallback legacy (modo 'legacy') | ✅ | Equivalente a all, rollback rápido |

## 2. Edição de Steps
| Tipo | Campos Editáveis | Status | Observações |
|------|------------------|--------|-------------|
| intro | title (quando presente) | ✅ | |
| question | questionText, opções CRUD, overrides layout/columns/optionStyle | ✅ | Overrides recém adicionados |
| strategic-question | questionText, opções CRUD, overrides layout/columns/optionStyle | ✅ | SelectionMode fixo single (ok) |
| transition / transition-result | title/text/spinner/tempo | ❌ | Precisa painel dedicado |
| result | Conteúdo dinâmico modular (summary/testimonials/guarantee) | ❌ | Só via código; falta UI |
| offer | variants (matchValue, matchOptionId, title, description, buttonText, testimonial) | ✅ | matchOptionId incluído |

## 3. Edição Global
| Item | Status | Observações |
|------|--------|-------------|
| scoring.defaultWeight | ✅ | Painel global |
| scoring.perStep | ✅ | Edição multiline -> objeto |
| progress.countedStepIds | ✅ | Checkbox grid |
| offerMapping.strategicFinalStepId | ✅ | Input + datalist |
| Outros campos offerMapping (futuros) | ❌ | Não existem/sem UI |

## 4. Overrides de Blocks
| Item | Status | Observações |
|------|--------|-------------|
| Block properties override (properties) | ⚠️ | Backend suporta via updateBlock; falta UI lista de blocks |
| Block content override (content merge) | ✅ | Implementado (merge em applyBlockOverrides) |
| Question layout heurística automática | ✅ | Já aplicado por builder |
| Question layout override manual | ✅ | Novos campos no painel |

## 5. Variants Offer
| Item | Status | Observações |
|------|--------|-------------|
| CRUD variants | ✅ | Adicionar/remover/editar |
| matchOptionId | ✅ | Campo exposto |
| Reordenar variants | ❌ | Falta drag & drop / controls |

## 6. Result Layer Modular
| Item | Status | Observações |
|------|--------|-------------|
| Visualizar blocos result-* | ❌ | Não há painel |
| Editar textos placeholders (summary/testimonials/guarantee) | ❌ | Necessário painel future |
| Adicionar/remover seções modulares | ❌ | Requer registry UI |

## 7. UX & Observabilidade
| Item | Status | Observações |
|------|--------|-------------|
| Status hash | ✅ | Exibido em painéis |
| Dynamic Mode Indicator | ✅ | Adicionado status bar |
| Logging estruturado | ✅ | `StructuredLogger` + overlay |
| Diff / Paridade scripts | ✅ | `quiz:verify-blocks` / `quiz:diff-blocks` |

## 8. Publicação & Persistência
| Item | Status | Observações |
|------|--------|-------------|
| Save overrides | ✅ | quiz.save() |
| Publish (alias save) | ✅ | quiz.publish() |
| Version snapshots/UI histórico | ❌ | Não implementado |

## 9. Cobertura Estimada
Percentual aproximado de edição completa do funil: ~80% (crítico funcional) / 55% (se incluir camadas modulares avançadas e transições/result configuráveis).

## 10. Gaps Prioritários
1. Painel Transition/Result (expor blocos e propriedades básicas)
2. UI lista de blocks (para aplicar updateBlock facilmente)
3. Reordenação de variants (UX)
4. Painel para adicionar/remover seções modulares result/offer
5. Versioning snapshots UI

## 11. Próximos Passos Recomendados
| Prioridade | Ação | Justificativa |
|------------|------|---------------|
| Alta | Criar BlocksPanel (listar blocks do step + botão editar) | Desbloqueia overrides avancados |
| Alta | Transition/Result Properties Panel | Completar 100% tipos de step |
| Média | Reordenação de variants | UX e personalização oferta |
| Média | Modules Manager (result/offer sections) | Flexibilidade de layout |
| Baixa | Version History UI | Governança e auditoria |

## 12. Registro de Alterações Relacionadas (Hoje)
- Adicionados: matchOptionId (UI), overrides layout/columns/optionStyle, dynamic mode indicator, merge de content em updateBlock.

---
Gerado automaticamente como parte da tarefa "Checklist final".
