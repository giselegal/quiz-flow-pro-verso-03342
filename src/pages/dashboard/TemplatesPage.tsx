/**
 * 📚 PÁGINA DE TEMPLATES
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const TemplatesPage: React.FC = () => (
    <div className="space-y-6">
        <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Templates</h2>
            <p className="text-gray-600 mb-4">Biblioteca de templates e componentes</p>
            <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Template
            </Button>
        </div>
    </div>
);

export default TemplatesPage;