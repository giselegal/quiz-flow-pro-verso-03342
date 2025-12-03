import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface HeroProps {
    badge?: string;
    title: string;
    subtitle: string;
    children?: React.ReactNode;
    videoSrc?: string;
    className?: string;
}

export const Hero: React.FC<HeroProps> = ({
    badge,
    title,
    subtitle,
    children,
    videoSrc,
    className = '',
}) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
    };

    const heroVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
        }),
    };

    return (
        <section className={`relative py-28 lg:py-32 overflow-hidden bg-neon-space ${className}`}>
            <div className="absolute inset-0 bg-hero-soft"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
                    <div className="text-center lg:text-left">
                        {badge && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.45 }}
                            >
                                <Badge className="mb-8 badge-translucent hover:bg-[#132036]/80 transition-colors px-4 py-2">
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    {badge}
                                </Badge>
                            </motion.div>
                        )}

                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <motion.h1
                                custom={0}
                                variants={heroVariants}
                                className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 text-white leading-[1.05] tracking-tight font-title"
                            >
                                {title}
                            </motion.h1>

                            <motion.p
                                custom={1}
                                variants={heroVariants}
                                className="text-lg md:text-xl text-slate-300/90 mb-12 leading-relaxed max-w-4xl mx-auto font-light"
                            >
                                {subtitle}
                            </motion.p>
                        </motion.div>

                        {children && <div className="mb-16">{children}</div>}
                    </div>

                    {videoSrc && (
                        <div className="hidden lg:block">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="relative max-w-md ml-auto"
                            >
                                <div className="absolute -inset-6 bg-gradient-to-tr from-[#3bbef3]/30 via-transparent to-[#ea7af6]/40 opacity-70 blur-3xl" />
                                <div className="relative rounded-3xl overflow-hidden border-translucent shadow-soft">
                                    <video
                                        src={videoSrc}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
