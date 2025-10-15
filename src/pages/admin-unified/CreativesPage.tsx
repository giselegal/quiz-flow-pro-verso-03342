/**
 * 🎨 CREATIVES PAGE - Banco de Materiais Criativos
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreativesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Materiais Criativos</h2>
        <p className="text-muted-foreground">Banco de imagens e assets</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Assets</CardTitle>
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
