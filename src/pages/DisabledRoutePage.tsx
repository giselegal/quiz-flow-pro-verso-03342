import React from 'react';
import { Link } from 'wouter';
import { ACTIVE_FUNNEL_ID } from '@/config/featureFlags';

export default function DisabledRoutePage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md text-center">
                <h1 className="text-2xl font-semibold mb-3">Página temporariamente indisponível</h1>
                <p className="text-muted-foreground mb-6">
                    Este módulo do dashboard/admin está desativado neste ambiente.
                </p>
                <Link href={`/editor/${ACTIVE_FUNNEL_ID}`}>
                    <a className="inline-block px-4 py-2 rounded bg-primary text-white">Ir para o Editor</a>
                </Link>
            </div>
        </div>
    );
}
