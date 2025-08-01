/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useRef, useState, useCallback, useMemo } from 'react';
import ChatPanel from '../chat/ChatPanel';
import ToolBoard from './ToolBoard';
import Folder from './Folder'; // Assuming Folder exists and is used elsewhere
import { TopBar } from './ui/TopBar';
// import { BottomBar } from './ui/BottomBar';
import { Notch } from './ui/Notch';
import { FlyingIconAnimation } from './ui/FlyingIconAnimation';
import { FlyingCardAnimation } from './ui/FlyingCardAnimation';
import { Logo } from './ui/Logo';
import { usePanZoom } from './hooks/usePanZoom';
import { useToolInteractions } from './hooks/useToolInteractions';
import { ALL_TOOLS } from '../shared/constants'; // Import ALL_TOOLS as it contains tool info
import { ChatMessage, Tool } from '../shared/types'; // Import types
import NeuralWebCanvas from '../three/NeuralWebCanvas';
import { Toolbar } from '../tools/Toolbar';

// Define initial positions for ToolBoards as a constant
const INITIAL_TOOLBOARD_POSITIONS = {
  catoids: { x: -900, y: -200 },
  sopSection: { x: 900, y: -200 },
  informationRetrieval: { x: -900, y: 300 },
  performance: { x: 900, y: 300 },
};

export default function CanvasContainer() {
  const chatRef = useRef<HTMLDivElement>(null);
  const notchRef = useRef<HTMLDivElement>(null);

  const {
    pos: canvasPanPos,
    scale: canvasScale,
    dragging: isCanvasDragging,
    isPanMode,
    setPos: setCanvasPanPos,
    setIsPanMode,
    onMouseDown: onCanvasMouseDown,
    snapTo,
  } = usePanZoom({ x: 0, y: 0 }, 1);

  const [askInput, setAskInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' },
  ]);
  const [chatTyping, setChatTyping] = useState<boolean>(false);

  const {
    notchTools,
    selectedTool,
    flyingIcon,
    flyingCard,
    shadowColor,
    setNodes,
    setFlyingIcon,
    setFlyingCard,
    handleToolDrop,
    handleRemoveNotchTool,
    handleSelectNotchTool,
    handleAskSomething,
    handleNodeDragStart,
    resetCanvas: resetToolInteractionsState,
  } = useToolInteractions(chatRef, setChatMessages, setChatTyping, []);

  const [toolBoardPositions, setToolBoardPositions] = useState<{ [key: string]: { x: number; y: number } }>(
    INITIAL_TOOLBOARD_POSITIONS
  );

  const handleToolBoardDragEnd = useCallback((boardKey: string, newPos: { x: number; y: number }) => {
    setToolBoardPositions(prev => ({
      ...prev,
      [boardKey]: newPos,
    }));
  }, []);

  const resetToolBoardPositions = useCallback(() => {
    setToolBoardPositions(INITIAL_TOOLBOARD_POSITIONS);
    setCanvasPanPos({x:0, y:0});
  }, [setCanvasPanPos]);

  const combinedReset = useCallback(() => {
    resetToolInteractionsState();
    resetToolBoardPositions();
  }, [resetToolInteractionsState, resetToolBoardPositions]);

  const getToolBoardProps = useCallback((heading: string, boardKey: keyof typeof INITIAL_TOOLBOARD_POSITIONS) => {
    return {
      heading,
      notchTools,
      onToolClick: (tool: Tool, rect: DOMRect) => {
        if (notchTools.some(t => t.label === tool.label)) return;
        setFlyingCard({ tool, from: rect });
      },
      currentPosition: toolBoardPositions[boardKey],
      onDragEnd: (newPos: { x: number; y: number }) => handleToolBoardDragEnd(boardKey, newPos),
      isPanMode,
      panOffset: canvasPanPos,
      scale: canvasScale,
    };
  }, [notchTools, setFlyingCard, toolBoardPositions, handleToolBoardDragEnd, isPanMode, canvasPanPos, canvasScale]);

  // --- New Handler to Stop Propagation ---
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className="w-screen h-screen overflow-hidden relative select-none"
      onMouseDown={onCanvasMouseDown} // Canvas pan/zoom handler
      style={{
        cursor: isPanMode ? (isCanvasDragging ? 'grabbing' : 'grab') : 'default',
        background: 'none',
      }}
    >
      {/* Neural Web Background */}
      <div className="absolute inset-0 -z-20 select-none pointer-events-none">
        <NeuralWebCanvas />
      </div>
      <div className="absolute inset-0 bg-black/20 -z-10 pointer-events-none select-none" />

      {/* Logo - Top Left Corner */}
      <Logo />

      {/* Notch (Top Bar) - Add onMouseDown to stop propagation */}
      <Notch
        notchRef={notchRef}
        notchTools={notchTools}
        selectedTool={selectedTool} // <--- Pass this
        onSelectTool={handleSelectNotchTool}
        onRemoveTool={handleRemoveNotchTool}
        onMouseDown={stopPropagation} // <--- Pass the stopPropagation handler
      />
      {/* Flying Animations (no change needed here as they are temporary/non-interactive) */}
      <FlyingIconAnimation
        flyingIcon={flyingIcon}
        notchRef={notchRef}
        onAnimationComplete={() => {
          if (flyingIcon) {
            handleToolDrop(flyingIcon.tool);
          }
          setFlyingIcon(null);
        }}
      />
      <FlyingCardAnimation
        flyingCard={flyingCard}
        notchRef={notchRef}
        onAnimationComplete={() => {
          if (flyingCard) {
            handleToolDrop(flyingCard.tool);
          }
          setFlyingCard(null);
        }}
      />

      {/* Bottom Bar - Add onMouseDown to stop propagation */}
      {/* <div className="pointer-events-auto" onMouseDown={stopPropagation}> */}
        {/* <BottomBar
          onAskSubmit={handleAskSomething}
          askInputValue={askInput}
          onAskInputChange={setAskInput}
          onSnapToHome={() => snapTo(0, 0)}
          onSnapUp={() => snapTo(canvasPanPos.x, canvasPanPos.y - 300)}
          onSnapRight={() => snapTo(canvasPanPos.x + 300, canvasPanPos.y)}
          onSnapDown={() => snapTo(canvasPanPos.x, canvasPanPos.y + 300)}
          onSnapLeft={() => snapTo(canvasPanPos.x - 300, canvasPanPos.y)}
          onResetCanvas={combinedReset}
          isPanMode={isPanMode}
          onTogglePanMode={() => setIsPanMode(v => !v)}
        /> */}
      {/* </div> */}
      {/* PANNABLE CANVAS LAYER - (no change here, individual ToolBoards handle their own drag stop) */}
      <div
        className="absolute left-1/2 top-1/2 origin-center"
        style={{
          transform: `translate(-50%,-50%) translate(${canvasPanPos.x}px,${canvasPanPos.y}px) scale(${canvasScale})`,
          pointerEvents: 'auto',
        }}
      >
        <ToolBoard {...getToolBoardProps("Catoids", "catoids")} />
        <ToolBoard {...getToolBoardProps("SOP Section", "sopSection")} />
        <ToolBoard {...getToolBoardProps("Information Retrival", "informationRetrieval")} />
        <ToolBoard {...getToolBoardProps("Performance", "performance")} />
      </div>

      {/* ChatPanel - Add onMouseDown to the inner pointer-events-auto div to stop propagation */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40 mb-24">
        <div className="pointer-events-auto" ref={chatRef} onMouseDown={stopPropagation}> {/* <--- Add this */}
          <ChatPanel
            shadowColor={shadowColor}
            messages={chatMessages}
            typing={chatTyping}
            selectedTool={selectedTool}
            onAskSubmit={handleAskSomething}
          />
        </div>
      </div>

      {/* Toolbar - Positioned below the chat panel with more gap */}
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 pointer-events-none z-40">
        <div className="pointer-events-auto" onMouseDown={stopPropagation}>
          <Toolbar />
        </div>
      </div>
    </div>
  );
}