import React from 'react';
import { Shield, Lock } from 'lucide-react';

interface SecurityBadgesProps {
    badges?: Array<{
        icon: React.ReactNode;
        label: string;
    }>;
    className?: string;
}

export default function SecurityBadges({
    badges = [
        { icon: <Shield className="w-4 h-4 text-[#B89B7A]" />, label: 'Compra Segura' },
        { icon: <Lock className="w-4 h-4 text-[#B89B7A]" />, label: 'Dados Protegidos' }
    ],
    className = ''
}: SecurityBadgesProps) {
    return (
        <div className={`flex items-center justify-center gap-6 text-sm text-gray-600 ${className}`}>
            {badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                    {badge.icon}
                    <span>{badge.label}</span>
                </div>
            ))}
        </div>
    );
}
