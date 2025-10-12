import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface CTAButtonProps {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function CTAButton({
    text,
    onClick,
    icon,
    variant = 'primary',
    fullWidth = true,
    size = 'lg',
    className = ''
}: CTAButtonProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    const sizeClasses = {
        sm: 'py-3 px-4 text-base',
        md: 'py-4 px-6 text-lg',
        lg: 'py-4 sm:py-6 px-6 sm:px-8 text-lg sm:text-xl'
    };

    const variantClasses = {
        primary: 'bg-gradient-to-r from-[#B89B7A] to-[#a08966] text-white shadow-xl',
        secondary: 'bg-white text-[#432818] border-2 border-[#B89B7A] shadow-md'
    };

    return (
        <button
            onClick={onClick}
            className={`
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${fullWidth ? 'w-full' : 'w-auto'}
                rounded-lg font-bold
                transition-all duration-300 hover:scale-105 transform
                ${className}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="flex items-center justify-center gap-3">
                {icon && (
                    <span className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                        {icon}
                    </span>
                )}
                {text}
            </span>
        </button>
    );
}
