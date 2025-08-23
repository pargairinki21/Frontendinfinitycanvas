/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useRef, useState, useCallback, useMemo } from 'react';
import ChatPanel from '../chat/ChatPanel';
import OutputChatPanel from '../chat/OutputChatPanel';
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

import DynamicChatWrapper from '../chat/DynamicChatWrapper';
import { useDynamicChat } from '../chat/hooks/useDynamicChat';
import ChatModeToggle from '../chat/ChatModeToggle';

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
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null);
  const [backendMessage, setBackendMessage] = useState<string | null>(null);


  // ORIGINAL CODE - COMMENTED OUT FOR REFERENCE
  // Dynamic chat functionality
  // const { mode: chatMode, toggleMode: toggleChatMode } = useDynamicChat('canvas-layer');

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
  
  // New state for OutputChatPanel
  const [showOutputPanel, setShowOutputPanel] = useState<boolean>(false);
  const [outputMessages, setOutputMessages] = useState<ChatMessage[]>([]);
  const [outputTyping, setOutputTyping] = useState<boolean>(false);

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
  } = useToolInteractions(chatRef, setChatMessages, setChatTyping, [], setShowOutputPanel, setOutputMessages, setOutputTyping, setCurrentPdfUrl, setBackendMessage);

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

  const userMessages = chatMessages.filter(msg => msg.role === "user");
  const botMessages = outputMessages.filter(msg => msg.role === "assistant");







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

             {/* Notch (Top Bar) - Let it handle its own positioning */}
       <Notch
         notchRef={notchRef}
         notchTools={notchTools}
         selectedTool={selectedTool}
         onSelectTool={handleSelectNotchTool}
         onRemoveTool={handleRemoveNotchTool}
         onMouseDown={stopPropagation}
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
        
                 {/* ChatPanel - Now scales and moves with the canvas
         <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
           <div className="pointer-events-auto" ref={chatRef} onMouseDown={stopPropagation}>
             <ChatPanel
               shadowColor={shadowColor}
               messages={chatMessages}
               typing={chatTyping}
               selectedTool={selectedTool}
               onAskSubmit={handleAskSomething}
             />
           </div>
         </div>

         {/* OutputChatPanel - Positioned to the right of ChatPanel */}
         {/* <div className="absolute left-1/2 top-1/2 transform translate-x-2 -translate-y-1/2 pointer-events-none">
           <div className="pointer-events-auto" onMouseDown={stopPropagation}>
             <OutputChatPanel
               shadowColor={shadowColor}
               messages={outputMessages}
               typing={outputTyping}
               selectedTool={selectedTool}
               isVisible={showOutputPanel}
               onClose={() => setShowOutputPanel(false)}
             />
           </div>
         </div>  */}







        {/* Chat + Output Panel Wrapper */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
           className="flex gap-4 pointer-events-auto"
          ref={chatRef}
           onMouseDown={stopPropagation}
  >
    {/* Main Chat Panel */}
    <ChatPanel
      shadowColor={shadowColor}
      messages={userMessages}
      typing={chatTyping}
      selectedTool={selectedTool}
      onAskSubmit={handleAskSomething}
    />

    {/* Output Panel (only if visible) */}
    {showOutputPanel && (
      <OutputChatPanel
        shadowColor={shadowColor}
        messages={botMessages}
        typing={outputTyping}
        selectedTool={selectedTool}
        isVisible={showOutputPanel}
        pdfUrl={currentPdfUrl}
        backendMessage={backendMessage}
        onClose={() => setShowOutputPanel(false)}
      />
        )}
     </div>
  </div>















         {/* ORIGINAL CODE - COMMENTED OUT FOR REFERENCE */}
         {/* Dynamic ChatPanel - Can be positioned in different modes */}
         {/* {chatMode === 'canvas-layer' && (
           <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <div className="pointer-events-auto" ref={chatRef} onMouseDown={stopPropagation}>
               <ChatPanel
                 shadowColor={shadowColor}
                 messages={chatMessages}
                 typing={chatTyping}
                 selectedTool={selectedTool}
                 onAskSubmit={handleAskSomething}
               />
             </div>
           </div>
         )} */}
       </div>

       {/* ORIGINAL CODE - COMMENTED OUT FOR REFERENCE */}
       {/* Dynamic ChatPanel - Static and Dynamic modes */}
       {/* {(chatMode === 'static' || chatMode === 'dynamic') && (
         <DynamicChatWrapper
           mode={chatMode}
           canvasPanPos={canvasPanPos}
           canvasScale={canvasScale}
           onMouseDown={stopPropagation}
           shadowColor={shadowColor}
           messages={chatMessages}
           typing={chatTyping}
           selectedTool={selectedTool}
           onAskSubmit={handleAskSomething}
         />
       )} */}

       {/* ORIGINAL CODE - COMMENTED OUT FOR REFERENCE */}
       {/* Chat Mode Toggle - Positioned in top right */}
       {/* <div className="fixed top-4 right-4 pointer-events-none z-50">
         <div className="pointer-events-auto">
           <ChatModeToggle
             currentMode={chatMode}
             onModeChange={toggleChatMode}
             className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/20"
           />
         </div>
       </div> */}

      {/* Toolbar - Positioned below the chat panel with more gap */}
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 pointer-events-none z-40">
        <div className="pointer-events-auto" onMouseDown={stopPropagation}>
          <Toolbar />
        </div>
      </div>
    </div>
  );
}









