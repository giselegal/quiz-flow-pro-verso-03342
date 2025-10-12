import React from 'react';
import TestimonialCard from '../blocks/TestimonialCard';
import { Users, Award, TrendingUp } from 'lucide-react';

interface Testimonial {
    name: string;
    role?: string;
    quote: string;
    avatar?: string;
    rating?: number;
}

interface Stat {
    icon?: React.ReactNode;
    value: string;
    label: string;
}

interface SocialProofSectionProps {
    testimonials: Testimonial[];
    stats?: Stat[];
    title?: string;
    subtitle?: string;
    className?: string;
}

export default function SocialProofSection({
    testimonials,
    stats = [
        { icon: <Users className="w-6 h-6" />, value: '5.000+', label: 'Mulheres Transformadas' },
        { icon: <Award className="w-6 h-6" />, value: '4.9/5', label: 'Avaliação Média' },
        { icon: <TrendingUp className="w-6 h-6" />, value: '95%', label: 'Satisfação' }
    ],
    title = 'O Que Dizem Nossas Alunas',
    subtitle,
    className = ''
}: SocialProofSectionProps) {
    return (
        <div className={`bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg ${className}`}>
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#432818] mb-2">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-gray-600 text-base sm:text-lg">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Stats */}
            {stats && stats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-4 bg-gradient-to-br from-[#B89B7A]/5 to-[#a08966]/5 rounded-lg border border-[#B89B7A]/20"
                        >
                            <div className="flex justify-center text-[#B89B7A] mb-2">
                                {stat.icon}
                            </div>
                            <p className="text-3xl font-bold text-[#432818] mb-1">
                                {stat.value}
                            </p>
                            <p className="text-sm text-gray-600">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                    <TestimonialCard
                        key={index}
                        name={testimonial.name}
                        role={testimonial.role}
                        quote={testimonial.quote}
                        avatar={testimonial.avatar}
                        rating={testimonial.rating}
                    />
                ))}
            </div>
        </div>
    );
}
