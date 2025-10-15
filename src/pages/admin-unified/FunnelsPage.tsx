/**
 * 🎯 FUNNELS PAGE - Gestão de Funis
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FunnelsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meus Funis</h2>
        <p className="text-muted-foreground">Gerencie seus funis de quiz</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funis Disponíveis</CardTitle>
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
