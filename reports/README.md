Relatórios de mapeamento do schema do Quiz

Conteúdo:
- quiz-schema-diff.json: resumo das diferenças entre fontes (optimized x template), proposta canônica e política padrão.
- samples/: amostras extraídas para inspeção.

Política aplicada no runtime (ResultEngine):
- Q1–Q10: 1 ponto por questão (opções com prefixo natural_, classico_, etc.)
- Q12–Q17: estratégicas (0 pontos)

Onde verificar:
- src/services/core/ResultEngine.ts (função computeScoresFromSelections)
- src/pages/QuizModularPage.tsx (chamada com strategicRanges padrão)

Próximos passos sugeridos:
1) Introduzir loader/adapters para schema canônico (src/services/quizTemplateLoader.ts)
2) Criar testes unitários para conversão e ResultEngine
3) Migrar templates gradualmente para o formato canônico
# Relatórios de Mapeamento do Quiz (Fase A)

Este diretório contém os artefatos iniciais de descoberta do esquema dos templates/configs do quiz (21 etapas).

Conteúdo:
- `quiz-schema-diff.json`: resumo das diferenças estruturais e campos entre as principais fontes.
- `samples/optimized_step2.json`: amostra representativa da etapa 2 no config otimizado.
- `samples/template_step2.json`: amostra representativa da etapa 2 no template completo.

Como usar:
- Use as amostras como referência ao implementar o loader/adapters para unificar formatos.
- Siga `src/types/quiz-schema.ts` como contrato canônico proposto.

Próximos passos sugeridos:
1) Expandir as amostras para steps 2–11 (pontuadas) e 12–18 (estratégicas).
2) Criar um conversor `scripts/convert-template-to-canonical.ts` (ler ambos formatos e gerar JSON canônico).
3) Atualizar o runtime para consumir o loader/adapter.
Relatórios gerados automaticamente para análise de schema do Quiz/Editor.

Arquivos:
- quiz-schema-diff.json: resumo das diferenças encontradas entre a config otimizada e o template completo.
- samples/optimized_step2.json: amostra extraída de `src/config/optimized21StepsFunnel.ts` (step-2).
- samples/template_step2.json: amostra extraída de `src/templates/quiz21StepsComplete.ts` (step-2).

Próximos passos sugeridos:
1. Rodar o conversor automático nas outras etapas e gerar amostras por step.
2. Implementar `src/types/quiz-schema.ts` e um loader-adapter que normalize ambos os formatos.
3. Criar testes unitários comparando resultados antes/depois do adaptador.
