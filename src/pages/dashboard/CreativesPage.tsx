/**
 * 🎨 PÁGINA DE CRIATIVOS
 */

import React, { useState, useEffect } from 'react';
import { enhancedUnifiedDataServiceAdapter as EnhancedUnifiedDataService } from '@/analytics/compat/enhancedUnifiedDataServiceAdapter';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const CreativesPage: React.FC = () => (
    <div className="space-y-6">
        <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Criativos</h2>
            <p className="text-gray-600 mb-4">Imagens, vídeos e recursos visuais</p>
            <Button>
                <Plus className="w-4 h-4 mr-2" />
                Upload de Arquivo
            </Button>
        </div>
    </div>
);

export default CreativesPage;