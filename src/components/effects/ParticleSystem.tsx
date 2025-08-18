import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
}

interface ParticleSystemProps {
  trigger: boolean;
  origin: { x: number; y: number };
  type: 'selection' | 'celebration' | 'strategic';
  onComplete?: () => void;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  trigger,
  origin,
  type,
  onComplete,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticles = () => {
    const particleCount = type === 'celebration' ? 20 : type === 'strategic' ? 15 : 8;
    const colors = {
      selection: ['#B89B7A', '#A78BFA', '#C4B5FD'],
      celebration: ['#F59E0B', '#EAB308', '#FDE047', '#84CC16'],
      strategic: ['#aa6b5d', '#F97316', '#F59E0B', '#EAB308'],
    };

    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: origin.x + (Math.random() - 0.5) * 100,
        y: origin.y + (Math.random() - 0.5) * 100,
        size: Math.random() * 8 + 4,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        velocity: {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200 - 50,
        },
        life: 1,
      });
    }

    setParticles(newParticles);
  };

  useEffect(() => {
    if (trigger) {
      createParticles();

      const interval = setInterval(() => {
        setParticles(prev =>
          prev
            .map(particle => ({
              ...particle,
              x: particle.x + particle.velocity.x * 0.016,
              y: particle.y + particle.velocity.y * 0.016,
              velocity: {
                x: particle.velocity.x * 0.98,
                y: particle.velocity.y * 0.98 + 300 * 0.016, // gravity
              },
              life: particle.life - 0.02,
            }))
            .filter(particle => particle.life > 0)
        );
      }, 16);

      const timeout = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.life,
              filter: `drop-shadow(0 0 ${particle.size}px ${particle.color}40)`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
