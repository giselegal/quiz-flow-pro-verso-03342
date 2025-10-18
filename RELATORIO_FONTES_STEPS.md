# Relatório de Fontes por Etapa

- Prioridade de carregamento atual: modular > master(hidratado) > TS fallback
- Etapas com JSON modular: 6 de 21

| Step | Modular | #Blocks | V3 | #Sections(v3) | Master | #Sections(master) | TS Fallback | Fonte Ativa |
|------|---------|---------|----|---------------|--------|-------------------|-------------|-------------|
| step-01 | sim | 5 | sim | 2 | sim | 2 | sim | modular |
| step-02 | sim | 3 | sim | 2 | sim | 2 | sim | modular |
| step-03 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-04 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-05 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-06 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-07 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-08 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-09 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-10 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-11 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-12 | sim | 9 | sim | 1 | sim | 1 | sim | modular |
| step-13 | sim | 2 | sim | 2 | sim | 2 | sim | modular |
| step-14 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-15 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-16 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-17 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-18 | não | 0 | sim | 2 | sim | 2 | sim | master |
| step-19 | sim | 5 | sim | 1 | sim | 1 | sim | modular |
| step-20 | sim | 13 | sim | 12 | sim | 11 | sim | modular |
| step-21 | não | 0 | sim | 2 | sim | 2 | sim | master |

Notas:
- Master JSON está presente por step quando indicado como "sim" e já é hidratado com QUIZ_STEPS no runtime.
- Se Modular = sim, ele sobrepõe Master. Caso não exista modular, o Master é a fonte ativa. O TS fallback é usado apenas se o Master estiver ausente.