/**
 * 🧪 AB TESTS PAGE - Gestão de Testes A/B
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ABTestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Testes A/B</h2>
        <p className="text-muted-foreground">Configure e analise testes A/B</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testes Ativos</CardTitle>
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
