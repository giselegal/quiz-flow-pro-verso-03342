// src/config/quizRulesConfig.ts
// Configuração centralizada exportada como objeto TypeScript

export const quizRulesConfig = {
    meta: {
        name: "Quiz de Estilo Pessoal - 21 Etapas Completo",
        version: "2.0.0",
        description: "Template completo para descoberta do estilo pessoal com 21 etapas, incluindo coleta de dados, quiz pontuado, questões estratégicas e ofertas.",
        lastUpdated: "2025-01-21",
        templateId: "quiz21StepsComplete",
        funnelId: "quiz-sell-genius",
        author: "Gisele Galvão",
        domain: "quiz-sell-genius.com"
    },
    stepRules: {
        // ETAPA 1: Nome do usuário - botão ativa após digitar nome
        "1": {
            type: "form",
            category: "intro",
            validation: {
                type: "input" as const,
                required: ["userName"] as string[],
                message: "Digite seu nome para continuar",
                minLength: 2,
                maxLength: 50
            },
            behavior: {
                autoAdvance: false,
                showProgress: true,
                allowBack: false
            },
            button: {
                text: "Começar Quiz",
                activationRule: "requiresValidInput",
                style: "primary"
            }
        },
        // ETAPAS 2-11: Quiz pontuado - botão ativa após 3 seleções + auto-avanço
        "2": {
            type: "quiz",
            category: "scoring",
            validation: {
                type: "selection" as const,
                required: 3,
                message: "Selecione exatamente 3 opções que mais combinam com você"
            },
            behavior: {
                autoAdvance: true,
                autoAdvanceDelay: 800,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "3": {
            type: "quiz",
            category: "scoring",
            validation: {
                type: "selection" as const,
                required: 3,
                message: "Selecione exatamente 3 opções que mais combinam com você"
            },
            behavior: {
                autoAdvance: true,
                autoAdvanceDelay: 800,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "4": {
            type: "quiz",
            category: "scoring",
            validation: {
                type: "selection" as const,
                required: 3,
                message: "Selecione exatamente 3 opções que mais combinam com você"
            },
            behavior: {
                autoAdvance: true,
                autoAdvanceDelay: 800,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "5": {
            type: "quiz",
            category: "scoring",
            validation: {
                type: "selection" as const,
                required: 3,
                message: "Selecione exatamente 3 opções que mais combinam com você"
            },
            behavior: {
                autoAdvance: true,
                autoAdvanceDelay: 800,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "6": {
            type: "quiz",
            category: "scoring",
            validation: {
                type: "selection" as const,
                required: 3,
                message: "Selecione exatamente 3 opções que mais combinam com você"
            },
            behavior: {
                autoAdvance: true,
                autoAdvanceDelay: 800,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "7": {
            type: "quiz",
            category: "scoring",
            validation: {
                type: "selection" as const,
                required: 3,
                message: "Selecione exatamente 3 opções que mais combinam com você"
            },
            behavior: {
                autoAdvance: true,
                autoAdvanceDelay: 800,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "8": {
            type: "quiz",
            category: "scoring",
            validation: {
                type: "selection" as const,
                required: 3,
                message: "Selecione exatamente 3 opções que mais combinam com você"
            },
            behavior: {
                autoAdvance: true,
                autoAdvanceDelay: 800,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "9": {
            type: "quiz",
            category: "scoring",
            validation: {
                type: "selection" as const,
                required: 3,
                message: "Selecione exatamente 3 opções que mais combinam com você"
            },
            behavior: {
                autoAdvance: true,
                autoAdvanceDelay: 800,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "10": {
            type: "quiz",
            category: "scoring",
            validation: {
                type: "selection" as const,
                required: 3,
                message: "Selecione exatamente 3 opções que mais combinam com você"
            },
            behavior: {
                autoAdvance: true,
                autoAdvanceDelay: 800,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "11": {
            type: "quiz",
            category: "scoring",
            validation: {
                type: "selection" as const,
                required: 3,
                message: "Selecione exatamente 3 opções que mais combinam com você"
            },
            behavior: {
                autoAdvance: true,
                autoAdvanceDelay: 800,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Finalizar Quiz",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        // ETAPA 12: Transição - botão ativo (sem opções, só texto)
        "12": {
            type: "transition",
            category: "transition",
            validation: {
                type: "none" as const,
                required: false,
                message: ""
            },
            behavior: {
                autoAdvance: false,
                showProgress: true,
                allowBack: false
            },
            button: {
                text: "Continuar",
                activationRule: "always",
                style: "primary"
            }
        },
        // ETAPAS 13-18: Questões estratégicas - botão ativa após 1 seleção (manual)
        "13": {
            type: "strategic",
            category: "strategic",
            validation: {
                type: "selection" as const,
                required: 1,
                message: "Selecione 1 opção que mais te representa"
            },
            behavior: {
                autoAdvance: false,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "14": {
            type: "strategic",
            category: "strategic",
            validation: {
                type: "selection" as const,
                required: 1,
                message: "Selecione 1 opção que mais te representa"
            },
            behavior: {
                autoAdvance: false,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "15": {
            type: "strategic",
            category: "strategic",
            validation: {
                type: "selection" as const,
                required: 1,
                message: "Selecione 1 opção que mais te representa"
            },
            behavior: {
                autoAdvance: false,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "16": {
            type: "strategic",
            category: "strategic",
            validation: {
                type: "selection" as const,
                required: 1,
                message: "Selecione 1 opção que mais te representa"
            },
            behavior: {
                autoAdvance: false,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "17": {
            type: "strategic",
            category: "strategic",
            validation: {
                type: "selection" as const,
                required: 1,
                message: "Selecione 1 opção que mais te representa"
            },
            behavior: {
                autoAdvance: false,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Próxima Pergunta",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        "18": {
            type: "strategic",
            category: "strategic",
            validation: {
                type: "selection" as const,
                required: 1,
                message: "Selecione 1 opção que mais te representa"
            },
            behavior: {
                autoAdvance: false,
                showProgress: true,
                allowBack: true
            },
            button: {
                text: "Ver Resultado",
                activationRule: "requiresValidSelection",
                style: "primary"
            }
        },
        // ETAPA 19: Botão ativo para resultado
        "19": {
            type: "result",
            category: "result",
            validation: {
                type: "none" as const,
                required: false,
                message: ""
            },
            behavior: {
                autoAdvance: false,
                showProgress: true,
                allowBack: false
            },
            button: {
                text: "Ver Seu Resultado",
                activationRule: "always",
                style: "primary"
            }
        },
        // ETAPA 20: Resultado final
        "20": {
            type: "result",
            category: "result",
            validation: {
                type: "none" as const,
                required: false,
                message: ""
            },
            behavior: {
                autoAdvance: false,
                showProgress: true,
                allowBack: false
            },
            button: {
                text: "Descobrir Mais",
                activationRule: "always",
                style: "primary"
            }
        },
        // ETAPA 21: Oferta final
        "21": {
            type: "offer",
            category: "offer",
            validation: {
                type: "none" as const,
                required: false,
                message: ""
            },
            behavior: {
                autoAdvance: false,
                showProgress: false,
                allowBack: false
            },
            button: {
                text: "Quero Participar",
                activationRule: "always",
                style: "primary"
            }
        }
    },
    globalScoringConfig: {
        categories: [],
        algorithm: {
            type: "weighted",
            normalQuestionWeight: 1,
            strategicQuestionWeight: 2,
            minimumScoreDifference: 5,
            tieBreaker: "mostRecentAnswer"
        },
        resultCalculation: {
            primaryStyle: "dominant",
            secondaryStyles: "top2",
            showPercentages: true,
            roundTo: 0
        }
    },
    validationMessages: {
        pt: {
            step1: {
                "nameRequired": "Por favor, digite seu nome para começar",
                "nameMinLength": "Nome deve ter pelo menos 2 caracteres",
                "nameMaxLength": "Nome deve ter no máximo 50 caracteres"
            },
            quizQuestions: {
                "selectionRequired": "Escolha 3 opções que mais combinam com você",
                "minSelections": "Selecione exatamente 3 opções para continuar",
                "maxSelections": "Selecione apenas 3 opções",
                "styleRequired": "Escolha as opções que refletem seu estilo"
            },
            strategicQuestions: {
                "categoryRequired": "Selecione a opção que mais te representa",
                "styleRequired": "Escolha sua preferência de estilo",
                "oneSelectionRequired": "Selecione apenas 1 opção"
            },
            general: {
                "fieldRequired": "Este campo é obrigatório",
                "invalidFormat": "Formato inválido",
                "serverError": "Erro no servidor, tente novamente",
                "loadingResults": "Calculando seu estilo predominante...",
                "processingAnswers": "Analisando suas respostas..."
            }
        },
        en: {
            step1: {
                "nameRequired": "Please enter your name to start",
                "nameMinLength": "Name must have at least 2 characters",
                "nameMaxLength": "Name must have at most 50 characters"
            },
            quizQuestions: {
                "selectionRequired": "Choose 3 options that best match you",
                "minSelections": "Select exactly 3 options to continue",
                "maxSelections": "Select only 3 options",
                "styleRequired": "Choose options that reflect your style"
            },
            strategicQuestions: {
                "categoryRequired": "Select the option that best represents you",
                "styleRequired": "Choose your style preference",
                "oneSelectionRequired": "Select only 1 option"
            },
            general: {
                "fieldRequired": "This field is required",
                "invalidFormat": "Invalid format",
                "serverError": "Server error, please try again",
                "loadingResults": "Calculating your predominant style...",
                "processingAnswers": "Analyzing your answers..."
            }
        }
    },
    behaviorPresets: {
        // ETAPAS COM AUTO-AVANÇO (após validação): 2-11
        autoAdvanceSteps: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        // ETAPAS COM AVANÇO MANUAL: 1, 12, 13-18, 19-21
        manualAdvanceSteps: [1, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
        // ETAPAS DE PONTUAÇÃO (3 seleções): 2-11
        scoringSteps: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        // ETAPAS ESTRATÉGICAS (1 seleção): 13-18
        strategicSteps: [13, 14, 15, 16, 17, 18],
        // ETAPAS DE TRANSIÇÃO (botão sempre ativo): 12, 19
        transitionSteps: [12, 19],
        // ETAPAS QUE REQUEREM VALIDAÇÃO DE INPUT: 1
        inputValidationSteps: [1],
        // ETAPAS QUE REQUEREM VALIDAÇÃO DE SELEÇÃO: 2-11, 13-18
        selectionValidationSteps: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18],
        // ETAPAS SEM VALIDAÇÃO (botão sempre ativo): 12, 19, 20, 21
        alwaysActiveSteps: [12, 19, 20, 21]
    },
    uiConfig: {
        buttons: {
            primary: {
                backgroundColor: "#007bff",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
            },
            secondary: {
                backgroundColor: "transparent",
                color: "#007bff",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "2px solid #007bff",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
            }
        },
        animations: {
            transitions: true,
            duration: 300,
            easing: "ease-in-out",
            fadeIn: "opacity 0.3s ease-in-out",
            slideIn: "transform 0.3s ease-in-out"
        }
    },
    globalRules: {
        maxSteps: 21,
        enableScoring: true,
        categories: ["elegante", "criativo", "casual", "romantico", "moderno", "classico"],
        // ETAPAS DE PONTUAÇÃO: 2-11 (10 questões com 3 seleções cada)
        scoringSteps: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        // ETAPAS ESTRATÉGICAS: 13-18 (6 questões com 1 seleção cada)
        strategicSteps: [13, 14, 15, 16, 17, 18],
        // ETAPAS DE TRANSIÇÃO: 12 (pós-quiz), 19 (pré-resultado)
        transitionSteps: [12, 19],
        // ETAPA DO RESULTADO: 20
        resultStep: 20,
        // ETAPA DA OFERTA: 21
        offerStep: 21,
        // REQUISITOS DE SELEÇÃO POR TIPO
        selectionsRequired: {
            scoring: 3, // Etapas 2-11: 3 seleções obrigatórias
            strategic: 1, // Etapas 13-18: 1 seleção obrigatória
            transition: 0, // Etapas 12, 19: sem seleções
            result: 0, // Etapa 20: sem seleções
            offer: 0 // Etapa 21: sem seleções
        },
        // REGRAS DE AUTO-AVANÇO
        autoAdvanceRules: {
            // Apenas etapas 2-11 têm auto-avanço após validação
            enabledSteps: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            delay: 800, // 800ms de delay após seleção válida
            requiresValidation: true
        },
        // REGRAS DE VALIDAÇÃO
        validationRules: {
            step1: { type: "input", field: "userName", minLength: 2 },
            steps2to11: { type: "selection", count: 3 },
            step12: { type: "none" },
            steps13to18: { type: "selection", count: 1 },
            steps19to21: { type: "none" }
        }
    }
}; export default quizRulesConfig;