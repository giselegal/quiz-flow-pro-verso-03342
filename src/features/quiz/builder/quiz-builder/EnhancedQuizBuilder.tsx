import QuizBuilder from './QuizBuilder';

/**
 * EnhancedQuizBuilder é um wrapper para o componente QuizBuilder
 * que pode adicionar funcionalidades extras como análises, ferramentas
 * avançadas de edição, e outras melhorias.
 */
const EnhancedQuizBuilder: React.FC = () => {
  return (
    <div className="enhanced-quiz-builder">
      <QuizBuilder />
    </div>
  );
};

export default EnhancedQuizBuilder;
