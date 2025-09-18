// src/config/quizRulesConfig.ts
// Configuração centralizada exportada como objeto TypeScript

export const quizRulesConfig = {
    meta: {
        name: "Quiz Rules Configuration",
        version: "2.0.0",
        description: "Configuração centralizada para regras, validação, pontuação e comportamento do quiz",
        lastUpdated: "2025-01-21"
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
        pt: {},
        en: {}
    },
    behaviorPresets: {},
    uiConfig: {
        theme: "modern",
        animations: {
            transitions: true,
            duration: 300
        }
    },
    globalRules: {
        maxSteps: 21,
        enableScoring: true,
        categories: ["lifestyle", "personality", "preferences"]
    }
}; export default quizRulesConfig;