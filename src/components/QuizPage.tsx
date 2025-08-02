
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLoadingState } from '@/hooks/useLoadingState';

const QuizPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useLoadingState(false);
  
  // Get userName safely from user object or localStorage
  const userName = user?.userName || user?.name || localStorage.getItem('userName') || '';
  
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
      {loading && <div>Loading...</div>}
      <button onClick={() => handleSomeFunction('test', safeUserName)}>
        Start Quiz
      </button>
    </div>
  );
};

export default QuizPage;
