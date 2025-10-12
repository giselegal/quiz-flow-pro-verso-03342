import React from 'react';
import { Shield } from 'lucide-react';

interface GuaranteeCardProps {
    days?: number;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export default function GuaranteeCard({
    days = 7,
    title = 'Garantia de Satisfação Total',
    description = `Você tem ${days} dias para testar o guia. Se não ficar 100% satisfeita, devolvemos seu investimento sem perguntas.`,
    icon = <Shield className="w-12 h-12 text-[#B89B7A] mx-auto mb-4" />
}: GuaranteeCardProps) {
    return (
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow-lg text-center">
            <div className="max-w-2xl mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold text-[#432818] mb-4 tracking-tight">
                    {title}
                </h3>
                <div className="bg-[#B89B7A]/5 border border-[#B89B7A]/20 rounded-lg p-6 mb-6">
                    {icon}
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
