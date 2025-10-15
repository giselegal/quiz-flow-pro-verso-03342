/**
 * 📄 TEMPLATES PAGE - Biblioteca de Templates
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Templates</h2>
        <p className="text-muted-foreground">Biblioteca de templates de quiz</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates Disponíveis</CardTitle>
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
