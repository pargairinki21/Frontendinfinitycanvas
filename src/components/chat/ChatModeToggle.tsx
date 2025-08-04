import React from 'react';
import { motion } from 'framer-motion';
import { ChatMode } from './hooks/useDynamicChat';

interface ChatModeToggleProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  className?: string;
}

const modeConfig = {
  static: {
    label: 'Static',
    icon: '📌',
    description: 'Fixed position, stays in place',
  },
  dynamic: {
    label: 'Dynamic',
    icon: '🔄',
    description: 'Moves with canvas transformations',
  },
  'canvas-layer': {
    label: 'Canvas Layer',
    icon: '🎨',
    description: 'Part of the canvas, scales with zoom',
  },
};

export default function ChatModeToggle({
  currentMode,
  onModeChange,
  className = '',
}: ChatModeToggleProps) {
  const modes: ChatMode[] = ['static', 'dynamic', 'canvas-layer'];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="text-white/80 text-sm font-medium mb-2">Chat Mode</div>
      
      <div className="flex flex-col gap-1">
        {modes.map((mode) => {
          const config = modeConfig[mode];
          const isActive = currentMode === mode;
          
          return (
            <motion.button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white/90'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">{config.icon}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium">{config.label}</span>
                <span className="text-xs opacity-70">{config.description}</span>
              </div>
              
              {isActive && (
                <motion.div
                  className="ml-auto w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
} 