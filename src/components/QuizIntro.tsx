
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface QuizIntroProps {
  onStart: (name: string) => void;
  title: string;
  description: string;
}

const QuizIntro: React.FC<QuizIntroProps> = ({ onStart, title, description }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-playfair text-[#432818] text-center mb-4">
          {title}
        </h1>
        <p className="text-[#8F7A6A] text-center mb-8">
          {description}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#432818] mb-2">
              Seu nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full px-4 py-2 border border-[#B89B7A]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:border-transparent"
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Começar Quiz
          </Button>
        </form>
      </div>
    </div>
  );
};

export default QuizIntro;
