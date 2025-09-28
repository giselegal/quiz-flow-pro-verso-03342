/**
 * 👥 PÁGINA DE PARTICIPANTES
 */

import React from 'react';
import { EnhancedUnifiedDataService } from '@/services/core/EnhancedUnifiedDataService'; from 'react';
import ParticipantsTable from '@/components/dashboard/ParticipantsTable';

const ParticipantsPage: React.FC = () => (
    <div className="space-y-6">
        <ParticipantsTable />
    </div>
);

export default ParticipantsPage;