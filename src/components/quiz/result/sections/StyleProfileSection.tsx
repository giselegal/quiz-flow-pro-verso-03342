import React from 'react';
import StyleCard from '../blocks/StyleCard';
import { Palette, Heart, Sparkles } from 'lucide-react';

interface ProfileData {
    styleType: string;
    description: string;
    colors: string[];
    characteristics: string[];
}

interface StyleProfileSectionProps {
    profileData: ProfileData;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    className?: string;
}

export default function StyleProfileSection({
    profileData,
    title = 'Seu Perfil de Estilo',
    subtitle,
    icon = <Palette className="w-8 h-8 text-[#B89B7A]" />,
    className = ''
}: StyleProfileSectionProps) {
    return (
        <div className={`bg-gradient-to-br from-[#B89B7A]/5 to-[#a08966]/5 p-6 sm:p-8 rounded-lg shadow-md mb-10 ${className}`}>
            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                    <div className="p-3 bg-white rounded-full shadow-md">
                        {icon}
                    </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#432818] mb-2">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-gray-600 text-base">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Style Card */}
            <div className="max-w-2xl mx-auto">
                <StyleCard
                    styleType={profileData.styleType}
                    description={profileData.description}
                    colors={profileData.colors}
                    features={profileData.characteristics}
                    isActive={true}
                />
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    <Sparkles className="w-4 h-4 inline mr-1 text-[#B89B7A]" />
                    Este perfil foi criado especialmente para você
                </p>
            </div>
        </div>
    );
}
