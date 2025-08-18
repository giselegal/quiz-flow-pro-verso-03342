import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StaggeredOptionAnimationsProps {
  children: React.ReactNode[];
  isVisible: boolean;
  questionId?: string;
  className?: string;
}

const StaggeredOptionAnimations: React.FC<StaggeredOptionAnimationsProps> = ({
  children,
  isVisible,
  questionId,
  className = 'grid gap-3 h-full',
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const instanceId = useRef(`options-${Math.random().toString(36).substr(2, 9)}`).current;

  useEffect(() => {
    if (isVisible) {
      // Pequeno delay para garantir transição suave
      const timer = setTimeout(() => setShowOptions(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowOptions(false);
    }
  }, [isVisible, questionId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        mass: 1,
      },
    },
    exit: {
      y: -10,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {showOptions && (
        <motion.div
          key={questionId || instanceId}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={className}
        >
          {children.map((child, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              {child}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { StaggeredOptionAnimations };
