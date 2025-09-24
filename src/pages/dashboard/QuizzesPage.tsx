/**
 * 📝 PÁGINA DE QUIZZES
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const QuizzesPage: React.FC = () => (
    <div className="space-y-6">
        <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Quizzes</h2>
            <p className="text-gray-600 mb-4">Gerencie seus quizzes e formulários interativos</p>
            <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Quiz
            </Button>
        </div>
    </div>
);

export default QuizzesPage;