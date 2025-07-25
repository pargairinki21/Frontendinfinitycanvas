import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tool } from '../../shared/types';

type FlyingIconAnimationProps = {
  flyingIcon: { tool: Tool, from: DOMRect } | null;
  notchRef: React.RefObject<HTMLDivElement>;
  onAnimationComplete: () => void;
};

export function FlyingIconAnimation({ flyingIcon, notchRef, onAnimationComplete }) {
  return (
    <AnimatePresence>
      {flyingIcon && (
        <motion.div
          key="flying-icon"
          className="fixed z-50 rounded-full flex items-center justify-center bg-white/80 shadow-lg"
          initial={{
            left: flyingIcon.from.x,
            top: flyingIcon.from.y,
            width: flyingIcon.from.width,
            height: flyingIcon.from.height,
          }}
          animate={(() => {
            if (notchRef.current) {
              const rect = notchRef.current.getBoundingClientRect();
              return {
                left: rect.x + rect.width / 2 - 16,
                top: rect.y + 16,
                width: 32,
                height: 32,
                scale: 1,
              };
            }
            return {};
          })()}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
          }}
          onAnimationComplete={onAnimationComplete}
        >
          <flyingIcon.tool.icon color={flyingIcon.tool.color} size={20} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}