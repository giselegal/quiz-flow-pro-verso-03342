/**
 * 🎯 EXEMPLO PRÁTICO: Como usar o Builder System no Quiz Quest
 * 
 * Este arquivo mostra como integrar o Builder System no seu projeto atual
 */

// ✨ IMPORTAR O BUILDER SYSTEM
// import { 
//   createQuizQuestion, 
//   createFunnelFromTemplate, 
//   createQuizLayout,
//   QuizBuilderFacade,
//   BUILDER_PRESETS 
// } from '@/core/builder';

// Para fins de exemplo, vamos simular as funções:
const createQuizQuestion = () => ({
    withContentField: (key, value) => ({ withProperty: (prop, val) => ({ build: () => ({ tipo: 'quiz', [key]: value, [prop]: val }) }) })
});
const createFunnelFromTemplate = (template) => ({
    withName: (name) => ({ withAnalytics: (analytics) => ({ autoConnect: () => ({ optimize: () => ({ build: () => ({ template, name, analytics }) }) }) }) })
});
const createQuizLayout = (name) => ({
    withTheme: (theme) => ({ withFullAccessibility: () => ({ optimizeForMobile: () => ({ build: () => ({ name, theme }), generateCSS: () => 'css-gerado' }) }) })
});
const QuizBuilderFacade = {
    createCompleteQuiz: (name) => ({ funnel: { name, tipo: 'quiz-completo' }, layout: { tema: 'moderno' } }),
    createLandingPage: (name) => ({ layout: { name, tipo: 'landing' }, css: 'css-landing' }),
    createLeadQualification: (name) => ({ funnel: { name, tipo: 'lead-qualification' }, layout: { tema: 'minimal' } })
};
const BUILDER_PRESETS = {
    'quiz-product-recommendation': () => ({ tipo: 'quiz-produto' }),
    'lead-magnet-quiz': () => ({ tipo: 'lead-magnet' }),
    'landing-page-hero': () => ({ tipo: 'landing-hero' })
};

// 🎯 EXEMPLO 1: Criar uma pergunta de quiz
export function criarPerguntaRapida() {
    const pergunta = createQuizQuestion()
        .withContentField('question', 'Qual seu nível de experiência?')
        .withContentField('options', ['Iniciante', 'Intermediário', 'Avançado', 'Expert'])
        .withProperty('required', true)
        .withProperty('questionType', 'single-choice')
        .build();

    console.log('✅ Pergunta criada:', pergunta);
    return pergunta;
}

// 🔄 EXEMPLO 2: Criar um funil completo
export function criarFunilDeLeads() {
    const funil = createFunnelFromTemplate('lead-qualification')
        .withName('Qualificação de Leads - Marketing')
        .withAnalytics({
            trackingEnabled: true,
            events: ['step_start', 'step_complete', 'lead_captured']
        })
        .autoConnect() // Conecta as etapas automaticamente
        .optimize()    // Aplica otimizações automáticas
        .build();

    console.log('✅ Funil criado:', funil);
    return funil;
}

// 🎨 EXEMPLO 3: Criar layout responsivo
export function criarLayoutQuiz() {
    const layout = createQuizLayout('Quiz de Produto')
        .withTheme('modern-blue')           // Tema azul moderno
        .withFullAccessibility()           // Acessibilidade completa
        .optimizeForMobile()              // Otimizado para mobile
        .build();

    const css = layout.generateCSS();   // Gera CSS automaticamente

    console.log('✅ Layout criado:', layout);
    console.log('🎨 CSS gerado:', css);
    return { layout, css };
}

// 🚀 EXEMPLO 4: Usar presets prontos
export function usarPresetsProntos() {
    // Quiz de recomendação de produto
    const quizProduto = BUILDER_PRESETS['quiz-product-recommendation']();

    // Quiz lead magnet
    const leadMagnet = BUILDER_PRESETS['lead-magnet-quiz']();

    // Landing page
    const landingPage = BUILDER_PRESETS['landing-page-hero']();

    console.log('✅ Presets criados:', {
        quizProduto,
        leadMagnet,
        landingPage
    });

    return {
        quizProduto,
        leadMagnet,
        landingPage
    };
}

// 🎯 EXEMPLO 5: Para usar no seu EditorPro atual
export function integrarComEditorAtual() {
    // Quando usuário clicar em "Adicionar Pergunta"
    const adicionarPergunta = (tipo: string) => {
        let componente;

        switch (tipo) {
            case 'multipla-escolha':
                componente = createQuizQuestion()
                    .fromTemplate('multiple-choice')
                    .withContentField('question', 'Nova pergunta...')
                    .build();
                break;

            case 'captura-email':
                componente = createQuizQuestion()
                    .fromTemplate('email-capture')
                    .withContentField('title', 'Deixe seu email')
                    .withContentField('description', 'Para receber o resultado')
                    .build();
                break;

            case 'texto-livre':
                componente = createQuizQuestion()
                    .fromTemplate('text-input')
                    .withContentField('question', 'Descreva sua experiência...')
                    .withContentField('placeholder', 'Digite aqui...')
                    .build();
                break;

            default:
                componente = createQuizQuestion()
                    .fromTemplate('simple-question')
                    .build();
        }

        console.log(`✅ Componente ${tipo} criado:`, componente);
        return componente;
    };

    return { adicionarPergunta };
}

// 🎯 EXEMPLO 6: Facade simplificado
export function usarFacadeSimplificado() {
    // Criar quiz completo em 1 linha!
    const quizCompleto = QuizBuilderFacade.createCompleteQuiz('Meu Primeiro Quiz');

    // Criar landing page em 1 linha!
    const landingPage = QuizBuilderFacade.createLandingPage('Minha Landing');

    // Criar qualificação de leads em 1 linha!
    const leadQualification = QuizBuilderFacade.createLeadQualification('Qualificação de Prospects');

    console.log('✅ Tudo criado com facade:', {
        quizCompleto,
        landingPage,
        leadQualification
    });

    return {
        quizCompleto,
        landingPage,
        leadQualification
    };
}

// 🎯 COMO INTEGRAR NO SEU COMPONENTE REACT
/*
export const ExemploComponenteReact = () => {
  const [quiz, setQuiz] = useState(null);

  const criarNovoQuiz = () => {
    // Use o builder ao invés de criar manualmente
    const novoQuiz = QuizBuilderFacade.createCompleteQuiz('Quiz do Usuário');
    setQuiz(novoQuiz);
  };

  return (
    <div>
      <button onClick={criarNovoQuiz}>
        Criar Quiz com Builder
      </button>
      
      {quiz && (
        <div>
          <h3>Quiz criado:</h3>
          <pre>{JSON.stringify(quiz.funnel, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
*/

// ✨ EXECUTAR EXEMPLOS
export function executarTodosExemplos() {
    console.log('🚀 Executando exemplos do Builder System...');

    // Execute cada exemplo
    criarPerguntaRapida();
    criarFunilDeLeads();
    criarLayoutQuiz();
    usarPresetsProntos();
    usarFacadeSimplificado();

    console.log('✅ Todos os exemplos executados com sucesso!');
}

// Para testar, execute:
// executarTodosExemplos();
