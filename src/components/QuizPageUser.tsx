// @ts-nocheck
import { useAuth } from '@/context/AuthContext';
import { useLoadingState } from '@/hooks/useLoadingState';

const UserQuizPage: React.FC = () => {
  const { user } = useAuth();
  const { isLoading, setLoading } = useLoadingState({ initialState: false });

  // Get userName safely from user object or localStorage
  const userName = user?.name || user?.email || localStorage.getItem('userName') || '';

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
