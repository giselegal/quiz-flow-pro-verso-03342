import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
    name: string;
    role?: string;
    quote: string;
    avatar?: string;
    rating?: number;
    className?: string;
}

export default function TestimonialCard({
    name,
    role,
    quote,
    avatar,
    rating = 5,
    className = ''
}: TestimonialCardProps) {
    return (
        <div className={`bg-white p-6 rounded-lg shadow-md border border-[#B89B7A]/20 ${className}`}>
            {/* Rating Stars */}
            {rating > 0 && (
                <div className="flex gap-1 mb-3">
                    {[...Array(rating)].map((_, index) => (
                        <Star
                            key={index}
                            className="w-4 h-4 fill-[#B89B7A] text-[#B89B7A]"
                        />
                    ))}
                </div>
            )}

            {/* Quote */}
            <blockquote className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 italic">
                "{quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                {avatar && (
                    <img
                        src={avatar}
                        alt={name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#B89B7A]/20"
                    />
                )}
                <div>
                    <p className="font-semibold text-[#432818] text-sm">{name}</p>
                    {role && (
                        <p className="text-xs text-gray-600">{role}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
