import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChatMode } from './hooks/useDynamicChat';
import ChatPanel from './ChatPanel';

interface DynamicChatWrapperProps {
  mode: ChatMode;
  canvasPanPos: { x: number; y: number };
  canvasScale: number;
  onMouseDown: (e: React.MouseEvent) => void;
  shadowColor?: string | null;
  messages: any[];
  typing: boolean;
  selectedTool: any;
  onAskSubmit: (input: string) => void;
}

export default function DynamicChatWrapper({
  mode,
  canvasPanPos,
  canvasScale,
  onMouseDown,
  shadowColor,
  messages,
  typing,
  selectedTool,
  onAskSubmit,
}: DynamicChatWrapperProps) {
  const chatRef = useRef<HTMLDivElement>(null);

  // Different positioning strategies based on mode
  const getPositioning = () => {
    switch (mode) {
      case 'static':
        // Fixed position, doesn't move with canvas
        return {
          className: 'fixed inset-0 flex items-center justify-center pointer-events-none z-40',
          style: {},
        };

      case 'dynamic':
        // Moves with canvas but maintains relative positioning
        return {
          className: 'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none',
          style: {
            transform: `translate(-50%, -50%) translate(${canvasPanPos.x}px, ${canvasPanPos.y}px) scale(${canvasScale})`,
          },
        };

      case 'canvas-layer':
        // Part of the canvas layer, moves with pan/zoom
        return {
          className: 'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none',
          style: {},
        };

      default:
        return {
          className: 'fixed inset-0 flex items-center justify-center pointer-events-none z-40',
          style: {},
        };
    }
  };

  const positioning = getPositioning();

  return (
    <motion.div
      className={positioning.className}
      style={positioning.style}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pointer-events-auto" ref={chatRef} onMouseDown={onMouseDown}>
        <ChatPanel
          shadowColor={shadowColor}
          messages={messages}
          typing={typing}
          selectedTool={selectedTool}
          onAskSubmit={onAskSubmit}
        />
      </div>
    </motion.div>
  );
} 