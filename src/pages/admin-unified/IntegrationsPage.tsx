/**
 * 🔗 INTEGRATIONS PAGE - Gestão de Integrações
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Integrações</h2>
        <p className="text-muted-foreground">Conecte com ferramentas externas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integrações Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Conectado ao Supabase - Em desenvolvimento
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
