import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  emoji: string;
  scale: number;
  duration: number;
}

interface EnchantedBackgroundProps {
  phase: 'intro' | 'quiz' | 'strategic' | 'results';
  intensity?: number;
}

export const EnchantedBackground: React.FC<EnchantedBackgroundProps> = ({
  phase,
  intensity = 0.5,
}) => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  const phaseConfig = {
    intro: {
      emojis: ['✨', '🌟', '💫', '⭐'],
      count: 3,
      colors: ['#B89B7A', '#A78BFA'],
    },
    quiz: {
      emojis: ['💭', '🤔', '💡', '🧠'],
      count: 2,
      colors: ['#6366F1', '#B89B7A'],
    },
    strategic: {
      emojis: ['🎯', '💎', '🚀', '⚡'],
      count: 4,
      colors: ['#aa6b5d', '#F97316'],
    },
    results: {
      emojis: ['🎉', '🎊', '🌟', '✨'],
      count: 6,
      colors: ['#10B981', '#34D399'],
    },
  };

  useEffect(() => {
    const config = phaseConfig[phase];
    const elementCount = Math.floor(config.count * intensity);

    const newElements: FloatingElement[] = [];
    for (let i = 0; i < elementCount; i++) {
      newElements.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: config.emojis[Math.floor(Math.random() * config.emojis.length)],
        scale: 0.5 + Math.random() * 0.5,
        duration: 3 + Math.random() * 4,
      });
    }

    setFloatingElements(newElements);

    const interval = setInterval(() => {
      setFloatingElements(prev => {
        const updated = prev.map(el => ({
          ...el,
          y: (el.y - 1) % 120,
          x: el.x + Math.sin(Date.now() * 0.001 + el.id) * 0.1,
        }));
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [phase, intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {floatingElements.map(element => (
          <motion.div
            key={element.id}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `scale(${element.scale})`,
            }}
            initial={{ opacity: 0, y: '100vh' }}
            animate={{
              opacity: 0.2,
              y: '-10vh',
              rotate: [0, 5, -5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            {element.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface MorphingProgressProps {
  progress: number;
  phase: 'normal' | 'strategic' | 'complete';
}

export const MorphingProgress: React.FC<MorphingProgressProps> = ({ progress, phase }) => {
  const phaseColors = {
    normal: 'from-[#B89B7A] to-[#A1835D]', // Cores da marca: bege principal para bege escuro
    strategic: 'from-[#aa6b5d] to-[#B89B7A]', // Cores da marca: terracota para bege
    complete: 'from-[#B89B7A] to-[#D4B79F]', // Cores da marca: bege principal para bege claro
  };

  return (
    <div style={{ backgroundColor: '#E5DDD5' }}>
      <motion.div
        className={`h-full bg-gradient-to-r ${phaseColors[phase]} relative`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{ x: [-100, 200] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ width: '100px' }}
        />

        {/* Pulse on strategic questions */}
        {phase === 'strategic' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
