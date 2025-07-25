import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tool } from '../../shared/types';
import { TOOL_CONTENT } from '../../shared/constants';

type FlyingCardAnimationProps = {
  flyingCard: { tool: Tool, from: DOMRect } | null;
  notchRef: React.RefObject<HTMLDivElement>;
  onAnimationComplete: () => void;
};

export function FlyingCardAnimation({ flyingCard, notchRef, onAnimationComplete }) {
  return (
    <AnimatePresence>
      {flyingCard && (
        <motion.div
          key="flying-card"
          className="fixed z-50 rounded-xl shadow-lg bg-white flex flex-col items-start p-2 gap-1 border border-gray-100"
          initial={{
            left: flyingCard.from.x,
            top: flyingCard.from.y,
            width: flyingCard.from.width,
            height: flyingCard.from.height,
            opacity: 1,
            scale: 1,
          }}
          animate={(() => {
            if (notchRef.current) {
              const rect = notchRef.current.getBoundingClientRect();
              return {
                left: rect.x + rect.width / 2 - 16,
                top: rect.y + 16,
                width: 32 * 2.5, // Adjusted to match the original width during animation
                height: 32 * 1.5, // Adjusted to match the original height during animation
                opacity: 1,
                scale: 1,
              };
            }
            return {};
          })()}
          transition={{
            duration: 0.7,
            ease: [0.4, 0, 0.2, 1]
          }}
          onAnimationComplete={onAnimationComplete}
        >
          <div className="flex items-center gap-2 mb-1 w-full">
            <flyingCard.tool.icon size={18} color={flyingCard.tool.color} />
            <span className="font-semibold text-sm text-gray-700 truncate w-[100px]">{flyingCard.tool.label}</span>
          </div>
          <div className="text-gray-500 text-xs flex-1 w-full truncate">{TOOL_CONTENT[flyingCard.tool.label]}</div>
          <div className="w-full h-1 bg-gray-100 rounded-full mt-auto">
            <div className="h-1 bg-gray-300 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}