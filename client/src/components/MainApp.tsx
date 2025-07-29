
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import QuizDashboard from './quiz/QuizDashboard';

export default function MainApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<QuizDashboard />} />
      </Routes>
    </div>
  );
}
