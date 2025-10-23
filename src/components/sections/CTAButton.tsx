import React from 'react';

// Aceita tanto props do runtime (label/href) quanto as atuais (text/onClick)
interface CTAButtonProps {
    // Novos/Template v3
    label?: string;
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    icon?: React.ReactNode;
    tracking?: { event: string; category: string };

    // Legado/local
    text?: string;
    onClick?: () => void;
    fullWidth?: boolean;
    className?: string;
}

export default function CTAButton({
    label,
    href,
    variant = 'primary',
    size = 'large',
    icon,
    tracking,
    text,
    onClick,
    fullWidth = true,
    className = '',
}: CTAButtonProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    // Normalização de props
    const normalizedText = label || text || 'Saiba mais';
    const normalizedSize = ((): 'sm' | 'md' | 'lg' => {
        switch (size) {
            case 'small': return 'sm';
            case 'medium': return 'md';
            case 'large':
            default: return 'lg';
        }
    })();

    const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
        sm: 'py-3 px-4 text-base',
        md: 'py-4 px-6 text-lg',
        lg: 'py-4 sm:py-6 px-6 sm:px-8 text-lg sm:text-xl',
    };

    const variantClasses: Record<'primary' | 'secondary' | 'outline', string> = {
        primary: 'bg-gradient-to-r from-[#B89B7A] to-[#a08966] text-white shadow-xl',
        secondary: 'bg-white text-[#432818] border-2 border-[#B89B7A] shadow-md',
        outline: 'bg-transparent text-[#432818] border-2 border-[#B89B7A]',
    };

    const baseClass = `
        ${variantClasses[variant]}
        ${sizeClasses[normalizedSize]}
        ${fullWidth ? 'w-full' : 'w-auto'}
        rounded-lg font-bold
        transition-all duration-300 hover:scale-105 transform
        ${className}
    `;

    const content = (
        <span className="flex items-center justify-center gap-3">
            {icon && (
                <span className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                    {icon}
                </span>
            )}
            {normalizedText}
        </span>
    );

    if (href) {
        return (
            <a
                href={href}
                className={baseClass}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            onClick={onClick}
            className={baseClass}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {content}
        </button>
    );
}
