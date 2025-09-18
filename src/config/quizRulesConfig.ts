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
        "1": {
            type: "form",
            category: "intro",
            validation: {
                type: "input" as const,
                required: ["userName"] as string[], // Remove readonly para compatibilidade
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
        autoAdvanceSteps: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // ✅ APENAS 2-11 COM AUTO-AVANÇO
        manualAdvanceSteps: [1, 13, 14, 15, 16, 17, 18, 20, 21], // ✅ ADICIONADAS ETAPAS 13-18
        scoringSteps: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        validationRequiredSteps: [1]
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
        scoringSteps: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Etapas 2-11: 10 questões pontuadas
        strategicSteps: [13, 14, 15, 16, 17, 18], // Etapas 13-18: 6 questões estratégicas
        transitionSteps: [12, 19], // Etapas de transição
        resultStep: 20, // Etapa do resultado
        offerStep: 21, // Etapa da oferta
        selectionsRequired: {
            scoring: 3, // 3 seleções obrigatórias nas questões pontuadas
            strategic: 1 // 1 seleção obrigatória nas questões estratégicas
        }
    }
}; export default quizRulesConfig;