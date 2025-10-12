import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
    userName?: string;
    styleType: string;
    headline: string;
    subheadline?: string;
    description?: string;
    heroImage?: string;
    className?: string;
}

export default function HeroSection({
    userName,
    styleType,
    headline,
    subheadline,
    description,
    heroImage,
    className = ''
}: HeroSectionProps) {
    return (
        <div className={`text-center mb-10 md:mb-12 ${className}`}>
            {/* Animated Icon */}
            <div className="flex justify-center mb-4 sm:mb-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#B89B7A]/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-[#B89B7A] to-[#a08966] p-4 sm:p-6 rounded-full shadow-lg">
                        <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                </div>
            </div>

            {/* Headline with User Name */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#432818] mb-3 sm:mb-4 tracking-tight">
                {userName ? (
                    <>
                        {userName.split(' ')[0]}, {headline}
                    </>
                ) : (
                    headline
                )}
            </h1>

            {/* Subheadline with Style Type */}
            {subheadline && (
                <p className="text-xl sm:text-2xl text-gray-700 mb-2 font-medium">
                    {subheadline}
                </p>
            )}

            {/* Style Badge */}
            <div className="inline-block bg-gradient-to-r from-[#B89B7A]/20 to-[#a08966]/20 px-6 py-2 rounded-full border-2 border-[#B89B7A]/30 mb-4">
                <p className="text-[#B89B7A] font-bold text-lg">
                    ✨ Estilo {styleType}
                </p>
            </div>

            {/* Description */}
            {description && (
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mt-4">
                    {description}
                </p>
            )}

            {/* Hero Image */}
            {heroImage && (
                <div className="mt-8">
                    <img
                        src={heroImage}
                        alt={`Estilo ${styleType}`}
                        className="max-w-md mx-auto rounded-lg shadow-xl border-4 border-[#B89B7A]/20"
                    />
                </div>
            )}
        </div>
    );
}
