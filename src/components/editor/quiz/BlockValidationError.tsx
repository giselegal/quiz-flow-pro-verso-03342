/**
 * ⚠️ BlockValidationError - Componente para Mostrar Erros de Validação
 * 
 * Exibe erros de validação de forma visual no bloco.
 * 
 * @version 1.0.0
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface BlockValidationErrorProps {
    /** Lista de erros */
    errors: string[];
    /** Classes CSS adicionais */
    className?: string;
}

export function BlockValidationError({ errors, className = '' }: BlockValidationErrorProps) {
    if (!errors || errors.length === 0) return null;

    return (
        <div className={`bg-red-50 border-l-4 border-red-500 p-3 mb-2 ${className}`}>
            <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800 mb-1">
                        ⚠️ Erro de Validação
                    </p>
                    <ul className="text-xs text-red-700 space-y-1">
                        {errors.map((error, index) => (
                            <li key={index} className="flex items-start gap-1">
                                <span className="text-red-500">•</span>
                                <span>{error}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default BlockValidationError;
