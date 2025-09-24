/**
 * 🔗 PÁGINA DE INTEGRAÇÕES
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Zap } from 'lucide-react';

const IntegrationsPage: React.FC = () => (
    <div className="space-y-6">
        <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Integrações</h2>
            <p className="text-gray-600 mb-4">Conecte com ferramentas externas</p>
            <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Integração
            </Button>
        </div>
    </div>
);

export default IntegrationsPage;