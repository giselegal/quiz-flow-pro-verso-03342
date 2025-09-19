// import EditorFixedSimple from '../../legacy/pages/EditorFixedSimple';

const EditorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/20 to-white">
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-brand-brightBlue to-brand-brightPink rounded-full mb-6 shadow-lg">
              <span className="text-3xl font-bold text-white">E</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-brightBlue to-brand-brightPink bg-clip-text text-transparent mb-4">
              Editor QuizFlow Pro
            </h1>
            <p className="text-xl text-brand-darkBlue/70 mb-8">
              Sistema de edição visual em manutenção temporária
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-brand-brightBlue/20">
            <h2 className="text-2xl font-semibold text-brand-darkBlue mb-4">
              🔧 Manutenção em Progresso
            </h2>
            <p className="text-brand-darkBlue/80 mb-6">
              Estamos aprimorando o editor visual para oferecer a melhor experiência de criação de quizzes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/admin'}
                className="px-6 py-3 bg-gradient-to-r from-brand-brightBlue to-brand-brightPink text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Voltar ao Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/admin/quiz'}
                className="px-6 py-3 border-2 border-brand-brightBlue text-brand-brightBlue font-semibold rounded-lg hover:bg-brand-brightBlue/10 transition-all"
              >
                Gerenciar Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
