// src/components/canvas/ui/Notch.tsx

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tool } from '../../shared/types';
import { X } from 'lucide-react';

type NotchProps = {
  notchRef: React.RefObject<HTMLDivElement>;
  notchTools: Tool[];
  selectedTool: Tool | null;
  onSelectTool: (tool: Tool) => void;
  onRemoveTool: (tool: Tool) => void;
  onMouseDown: (e: React.MouseEvent) => void;
};

export function Notch({
  notchRef,
  notchTools,
  selectedTool,
  onSelectTool,
  onRemoveTool,
  onMouseDown,
}: NotchProps) {
  const isActive = notchTools.length > 0;

  const notchVariants = {
    peeking: { y: '-30%', opacity: 1 },
    fullyVisible: { y: '0%', opacity: 1 },
  };

  const notchTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  };

  const toolItemVariants = {
    hidden: { opacity: 0, scale: 0.5, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  // No longer directly used for the overlay, but kept for clarity if needed elsewhere
  // const overlayVariants = {
  //   hidden: { opacity: 0 },
  //   visible: { opacity: 1 },
  // };

  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 z-40 w-max pointer-events-none"
      onMouseDown={onMouseDown}
    >
      <motion.div
        ref={notchRef}
        className="glass-card flex items-center justify-center
                   shadow-xl pointer-events-auto overflow-hidden
                   rounded-bl-2xl rounded-br-2xl min-w-[6rem] px-5"
        variants={notchVariants}
        initial="peeking"
        animate={isActive ? 'fullyVisible' : 'peeking'}
        transition={notchTransition}
      >
        <div className="flex space-x-2 p-2">
          <AnimatePresence>
            {notchTools.map((tool) => (
              <motion.div
                key={tool.label}
                className={`relative flex flex-col items-center justify-center p-1 cursor-pointer
                            rounded-full bg-white/70 transition-all duration-200 h-10 w-10`}
                variants={toolItemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.2 }}
                onClick={() => onSelectTool(tool)}
                whileHover="hovered" // This state is passed down to children
                whileTap={{ scale: 0.95 }}
                initial="rest"
                animate="rest" // This should be present on the parent to define its default state
                variants={{
                  rest: { scale: 1 },
                  hovered: { scale: 1.2 },
                }}
              >
                {/* Tool Icon */}
                <tool.icon size={18} color={tool.color} />

                {/* Overlay with X icon - appears on hover */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 cursor-pointer"
                    // IMPORTANT: No `initial` or `animate` props here for the child.
                    // Its animation is driven solely by the parent's `whileHover` state.
                    variants={{
                        rest: { opacity: 0, pointerEvents: 'none' }, // Invisible, not interactive
                        hovered: { opacity: 1, pointerEvents: 'auto' }, // Visible, interactive
                    }}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent parent tool's onClick
                        onRemoveTool(tool); // Remove tool
                    }}
                >
                    <X size={18} color="white" /> {/* X icon same size as tool icon, white color for contrast */}
                </motion.div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}