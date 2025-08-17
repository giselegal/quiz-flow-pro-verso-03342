// import { MainTransition } from './MainTransition'; // Removido, não é mais usado aqui
import QuizFinalTransition from '../QuizFinalTransition';
// import { UserResponse } from '@/types/quiz'; // Removido
// import { Spinner } from '@/components/ui/spinner'; // Removido se não for usado em QuizFinalTransition

interface QuizTransitionManagerProps {
  // showingTransition: boolean; // Removido
  showingFinalTransition: boolean;
  // handleStrategicAnswer: (response: UserResponse) => void; // Removido
  // strategicAnswers: Record<string, string[]>; // Removido
  handleShowResult: () => void;
  // hideCounter?: boolean; // Removido, pois MainTransition não está mais aqui
}

const QuizTransitionManager: React.FC<QuizTransitionManagerProps> = ({
  // showingTransition, // Removido
  showingFinalTransition,
  // handleStrategicAnswer, // Removido
  // strategicAnswers, // Removido
  handleShowResult,
  // hideCounter = false, // Removido
}) => {
  if (showingFinalTransition) {
    return <QuizFinalTransition onShowResult={handleShowResult} />;
  }

  // if (showingTransition) { // Lógica removida, MainTransition é renderizada diretamente em QuizPage
  //   return (
  //     <div className="flex flex-col items-center justify-center h-full">
  //       <MainTransition
  //         onAnswer={handleStrategicAnswer} // Isso estava incorreto, MainTransition não deveria ter onAnswer
  //         strategicAnswers={strategicAnswers}
  //       />
  //       {!hideCounter && (
  //         <div>
  //           {/* ...existing counter logic / JSX... */}
  //         </div>
  //       )}
  //       <Spinner />
  //       <Spinner />
  //     </div>
  //   );
  // }

  return null; // Se não for a transição final, não renderiza nada daqui
};

export { QuizTransitionManager };
