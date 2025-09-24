/**
 * 🧪 PÁGINA DE TESTES A/B
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ABTestsPage: React.FC = () => (
    <div className="space-y-6">
        <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Testes A/B</h2>
            <p className="text-gray-600 mb-4">Experimentos e otimizações de conversão</p>
            <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Teste
            </Button>
        </div>
    </div>
);

export default ABTestsPage;