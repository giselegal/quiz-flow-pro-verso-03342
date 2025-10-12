import React from 'react';

interface Feature {
    icon?: string;
    label: string;
    value: string;
}

interface FeatureListProps {
    features: Feature[];
    totalLabel?: string;
    totalValue: string;
    title?: string;
}

export default function FeatureList({
    features,
    totalLabel = 'Valor Total',
    totalValue,
    title = 'O Que Você Recebe Hoje'
}: FeatureListProps) {
    return (
        <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md border border-[#B89B7A]/20 max-w-lg mx-auto">
            <h4 className="text-lg sm:text-xl font-semibold text-[#432818] mb-3 sm:mb-4">
                {title}
            </h4>

            <div className="space-y-3 mb-6 text-left">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center p-2.5 sm:p-3 border-b border-gray-100 text-sm sm:text-base"
                    >
                        <span>
                            {feature.icon && `${feature.icon} `}
                            {feature.label}
                        </span>
                        <span className="font-medium">{feature.value}</span>
                    </div>
                ))}

                <div className="flex justify-between items-center p-2.5 sm:p-3 pt-4 font-bold text-base sm:text-lg border-t-2 border-[#B89B7A]">
                    <span>{totalLabel}</span>
                    <div className="relative">
                        <span className="line-through text-gray-500">{totalValue}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
