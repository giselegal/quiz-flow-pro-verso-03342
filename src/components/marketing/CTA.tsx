import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, LucideIcon } from 'lucide-react';

interface CTAButton {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: 'primary' | 'secondary' | 'outline';
}

interface CTAProps {
    title: string;
    subtitle?: string;
    buttons: CTAButton[];
    className?: string;
}

export const CTA: React.FC<CTAProps> = ({ title, subtitle, buttons, className = '' }) => {
    const MotionButton = motion(Button);

    const getButtonClasses = (variant?: string) => {
        switch (variant) {
            case 'primary':
                return 'btn-neon text-white text-lg px-10 py-4 rounded-xl shadow-neon hover:shadow-neon transition-all';
            case 'outline':
                return 'border-2 border-white text-white hover:bg-white hover:text-[#0a0f1f] px-8 py-4 text-lg font-semibold';
            case 'secondary':
                return 'bg-white text-[#0a0f1f] hover:bg-slate-100 px-8 py-4 text-lg font-semibold';
            default:
                return 'btn-neon text-white text-lg px-10 py-4 rounded-xl shadow-neon hover:shadow-neon transition-all';
        }
    };

    return (
        <section className={`py-24 bg-gradient-blue-pink ${className}`}>
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-title">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {buttons.map((button, index) => {
                        const Icon = button.icon || (button.variant === 'secondary' ? ArrowRight : Zap);
                        return (
                            <MotionButton
                                key={index}
                                size="lg"
                                onClick={button.onClick}
                                className={getButtonClasses(button.variant)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Icon className="mr-2 h-5 w-5" />
                                {button.label}
                            </MotionButton>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
