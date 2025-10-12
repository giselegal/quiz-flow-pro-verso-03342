import React from 'react';
import { Sparkles, Heart, Star } from 'lucide-react';

interface StyleCardProps {
    styleType: string;
    description: string;
    colors?: string[];
    features?: string[];
    icon?: React.ReactNode;
    isActive?: boolean;
    className?: string;
}

export default function StyleCard({
    styleType,
    description,
    colors = [],
    features = [],
    icon = <Sparkles className="w-8 h-8 text-[#B89B7A]" />,
    isActive = true,
    className = ''
}: StyleCardProps) {
    return (
        <div
            className={`
                bg-white p-6 rounded-lg shadow-md 
                border-2 transition-all duration-300
                ${isActive ? 'border-[#B89B7A] shadow-lg' : 'border-gray-200'}
                hover:shadow-xl hover:scale-[1.02]
                ${className}
            `}
        >
            {/* Header with Icon */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#B89B7A]/10 rounded-lg">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[#432818]">
                        {styleType}
                    </h3>
                    {isActive && (
                        <span className="text-xs text-[#B89B7A] font-semibold">
                            ✨ Seu estilo
                        </span>
                    )}
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {description}
            </p>

            {/* Color Palette */}
            {colors.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                        Paleta de Cores:
                    </p>
                    <div className="flex gap-2">
                        {colors.map((color, index) => (
                            <div
                                key={index}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Features */}
            {features.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                        Características:
                    </p>
                    <ul className="space-y-1">
                        {features.map((feature, index) => (
                            <li
                                key={index}
                                className="text-xs text-gray-600 flex items-start gap-2"
                            >
                                <span className="text-[#B89B7A] mt-0.5">•</span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
