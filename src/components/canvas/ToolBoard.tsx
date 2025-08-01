// src/components/canvas/ToolBoard.tsx
import React, { useState, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tool } from '../shared/types';
import { ALL_TOOLS } from '../shared/constants'; // Make sure ALL_TOOLS is correctly imported
import { useDraggable } from './hooks/useDraggable'; // Import the new useDraggable hook

// --- ToolCard Component (no changes needed) ---
// If you have this in a separate file, ensure it's correctly imported.
// Keeping it here for completeness of the ToolBoard file.
const ToolCard = memo(({ tool, onClick, isSelected }: { tool: Tool; onClick: (tool: Tool, rect: DOMRect) => void; isSelected: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (cardRef.current) {
      onClick(tool, cardRef.current.getBoundingClientRect());
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`bg-white/10 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transform transition-all duration-100 ease-out border border-white/20
        ${isSelected ? 'border-2 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : ''}
       `}
      onClick={handleClick}
      ref={cardRef}
    >
      <tool.icon size={26} color={tool.color} />
      <span className="text-sm font-medium mt-2 text-center text-white">
        {tool.label}
      </span>
    </motion.div>
  );
});


// --- ToolBoard Component (Modified) ---

type ToolBoardProps = {
  heading: string;
  notchTools: Tool[]; // Tools currently in the notch
  onToolClick: (tool: Tool, rect: DOMRect) => void;
  
  // New props required by useDraggable:
  currentPosition: { x: number; y: number }; // The board's current position on the infinite canvas
  onDragEnd: (newPosition: { x: number; y: number }) => void; // Callback to update parent state
  isPanMode: boolean; // Indicates if the canvas is in pan mode (to disable dragging)
  panOffset: { x: number; y: number }; // Current pan offset of the canvas
  scale: number; // Current scale of the canvas
};

export default memo(function ToolBoard({
  heading,
  notchTools,
  onToolClick,
  currentPosition, // Destructure new prop
  onDragEnd,       // Destructure new prop
  isPanMode,       // Destructure new prop
  panOffset,       // Destructure new prop
  scale,           // Destructure new prop
}: ToolBoardProps) {
  const visibleTools = ALL_TOOLS.filter(tool => !notchTools.some(nt => nt.label === tool.label));

  // Use the new useDraggable hook to manage this ToolBoard's position and dragging state
  const { position, isDragging, handleMouseDown } = useDraggable({
    initialPosition: currentPosition, // Pass the initial/current position
    onDragEnd,                         // Pass the callback to update parent state
    isPanMode,                         // Pass canvas pan mode to conditionally enable/disable drag
    panOffset,                         // Pass canvas pan offset for correct coordinate calculations
    scale,                             // Pass canvas scale for correct coordinate calculations
  });

  return (
    <motion.div
      className={`glass-border relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-white p-5 flex flex-col min-w-[400px] min-h-[150px]
        ${isDragging ? 'z-50' : 'z-30'} `} // Bring dragged item to front with z-50
      style={{
        position: 'absolute', // Important: Position ToolBoard absolutely within the pan-zoom layer
        left: position.x,      // Set X position from useDraggable
        top: position.y,       // Set Y position from useDraggable
        // Adjust cursor based on whether canvas is in pan mode or if this specific board is being dragged
        cursor: isPanMode ? 'default' : (isDragging ? 'grabbing' : 'grab'),
      }}
      // Attach the handleMouseDown from useDraggable to make this div draggable
      onMouseDown={handleMouseDown}
    >
      <h3 className="text-xl font-semibold mb-4 text-white">{heading}</h3>
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence>
          {visibleTools.map(tool => (
            <ToolCard
              key={tool.label}
              tool={tool}
              onClick={onToolClick}
              isSelected={notchTools.some(t => t.label === tool.label)}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});