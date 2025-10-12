// @ts-nocheck
import { useAuth } from '@/contexts';
import { useLoadingState } from '@/hooks/useLoadingState';
import { StorageService } from '@/services/core/StorageService';

const UserQuizPage: React.FC = () => {
  const { user } = useAuth();
  const { isLoading, setLoading } = useLoadingState({ initialState: false });

  // Get userName via StorageService com fallback
  let userName = user?.name || user?.email || '';
  if (!userName) {
    try {
      userName =
        StorageService.safeGetString('userName') ||
        StorageService.safeGetString('quizUserName') ||
        '';
    } catch {
      try {
        userName = StorageService.safeGetString('userName') || '';
      } catch {
        userName = '';
      }
    }
  }

  // Handle potential null values
  const safeUserName = userName || undefined;

  const handleSomeFunction = (param1: string, param2?: string) => {
    // Implementation with proper parameter handling
    console.log('Function called with:', param1, param2);
  };

  return (
    <div className="quiz-page">
      <h1>Quiz Page</h1>
      <p>Welcome, {userName}</p>
      {isLoading && <div>Loading...</div>}
      <button onClick={() => handleSomeFunction('test', safeUserName)}>Start Quiz</button>
    </div>
  );
};

export default UserQuizPage;
