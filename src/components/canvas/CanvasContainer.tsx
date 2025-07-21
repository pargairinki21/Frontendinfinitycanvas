// import React, { useRef, useState, useEffect } from 'react';
// import ChatPanel from '../chat/ChatPanel';
// import ToolNode from './ToolNode';
// import {
//     FaRegCircle,
//     FaRegSquare,
//     FaRegStar,
//     FaRegHeart,
//     FaRegSmile,
//     FaRegKeyboard,
//     FaCircle,
//     FaSquare,
//     FaStar,
//     FaHeart,
//     FaSmile,
//     FaArrowUp,
//     FaArrowDown,
//     FaArrowLeft,
//     FaArrowRight,
//     FaUndo,
//     FaWpforms, // <-- Add this import for the form icon
//   } from 'react-icons/fa';

//   // Define initial tool nodes
//   const INITIAL_NODES = [
//     { id: 1, x: -300, y: -150, label: 'Form Finder', color: '#22c55e' },
//     { id: 2, x: 300, y: 200, label: 'Tool B', color: '#3b82f6' },
//   ];

//   // Predefined chat for Form Finder
//   const FORM_FINDER_CHAT = [
//     { id: 1, sender: 'assistant', text: 'Here is information about Form Finder.' },
//     { id: 2, sender: 'user', text: 'What can I do with it?' },
//     { id: 3, sender: 'assistant', text: 'You can use Form Finder to quickly locate and fill out forms.' },
//   ];

//   export default function CanvasContainer() {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [position, setPosition] = useState({ x: 0, y: 0 });
//     const [scale, setScale] = useState(1);
//     const [isDragging, setIsDragging] = useState(false);
//     const [startDrag, setStartDrag] = useState<{ x: number; y: number } | null>(null);
//     const [nodes, setNodes] = useState(INITIAL_NODES);
//     const [draggedTool, setDraggedTool] = useState<null | { id: number; color: string }>(null);
//     const [isOverPanel, setIsOverPanel] = useState(false);
//     const [panelShadowColor, setPanelShadowColor] = useState<string | null>(null);
//     const [droppedPanelShadowColor, setDroppedPanelShadowColor] = useState<string | null>(null);
//     const [droppedToolLabel, setDroppedToolLabel] = useState<string>('Welcome to Your AI Space');
//     const [droppedToolMessage, setDroppedToolMessage] = useState<string>('');
//     const [droppedMessages, setDroppedMessages] = useState<any[] | null>(null);
//     // State for selected tools bar
//     const [selectedTools, setSelectedTools] = useState<{ label: string; color: string; icon: any }[]>([]);
  
//     const handleMouseDown = (e: React.MouseEvent) => {
//       if ((e.target as HTMLElement).dataset.draggable === 'true') return;
//       setIsDragging(true);
//       setStartDrag({ x: e.clientX, y: e.clientY });
//     };
  
//     const handleMouseUp = () => {
//       setIsDragging(false);
//       setStartDrag(null);
//     };
  
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isDragging || !startDrag) return;
//       const dx = e.clientX - startDrag.x;
//       const dy = e.clientY - startDrag.y;
//       setStartDrag({ x: e.clientX, y: e.clientY });
//       setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
//     };
  
//     const handleWheel = (e: WheelEvent) => {
//       if (e.ctrlKey) {
//         e.preventDefault();
//         const delta = -e.deltaY * 0.001;
//         setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 2));
//       }
//     };
  
//     useEffect(() => {
//       window.addEventListener('mousemove', handleMouseMove);
//       window.addEventListener('mouseup', handleMouseUp);
//       window.addEventListener('wheel', handleWheel, { passive: false });
//       return () => {
//         window.removeEventListener('mousemove', handleMouseMove);
//         window.removeEventListener('mouseup', handleMouseUp);
//         window.removeEventListener('wheel', handleWheel);
//       };
//     }, [isDragging, startDrag]);

//     // Helper to get ChatPanel bounding box
//     const chatPanelRef = useRef<HTMLDivElement>(null);

//     // When dragging, check if over ChatPanel
//     useEffect(() => {
//       if (!draggedTool) {
//         setIsOverPanel(false);
//         setPanelShadowColor(null);
//         return;
//       }
//       const handleMouseMove = (e: MouseEvent) => {
//         if (!chatPanelRef.current) return;
//         const rect = chatPanelRef.current.getBoundingClientRect();
//         if (
//           e.clientX >= rect.left &&
//           e.clientX <= rect.right &&
//           e.clientY >= rect.top &&
//           e.clientY <= rect.bottom
//         ) {
//           setIsOverPanel(true);
//           setPanelShadowColor(draggedTool.color);
//         } else {
//           setIsOverPanel(false);
//           setPanelShadowColor(null);
//         }
//       };
//       window.addEventListener('mousemove', handleMouseMove);
//       return () => window.removeEventListener('mousemove', handleMouseMove);
//     }, [draggedTool]);

//     // When dropping a tool over the ChatPanel, persist the color and label
//     useEffect(() => {
//       // Set color/message when a tool is dropped anywhere on the canvas (drag ends)
//       if (!draggedTool && panelShadowColor) {
//         setDroppedPanelShadowColor(panelShadowColor);
//         if (panelShadowColor && lastDraggedToolLabelRef.current) {
//           setDroppedToolLabel(lastDraggedToolLabelRef.current);
//           // Set a custom message or chat based on the tool label
//           const label = lastDraggedToolLabelRef.current;
//           let message = '';
//           if (label === 'Form Finder') {
//             message = 'Hey, here is your form!';
//             setDroppedMessages(FORM_FINDER_CHAT);
//             setSelectedTools(prev => prev.some(t => t.label === 'Form Finder') ? prev : [...prev, { label: 'Form Finder', color: '#22c55e', icon: FaWpforms }]);
//           } else if (label === 'Tool B') {
//             message = 'You dropped Tool B!';
//             setDroppedMessages(null);
//             setSelectedTools(prev => prev.some(t => t.label === 'Tool B') ? prev : [...prev, { label: 'Tool B', color: '#3b82f6', icon: FaRegSquare }]);
//           } else {
//             message = `You dropped ${label}!`;
//             setDroppedMessages(null);
//           }
//           setDroppedToolMessage(message);
//           // Remove the dropped tool from the canvas
//           setNodes(prevNodes => prevNodes.filter(n => n.label !== label));
//         }
//       }
//     }, [draggedTool, panelShadowColor]);

//     // Track the label of the currently dragged tool
//     const lastDraggedToolLabelRef = React.useRef<string>('Welcome to Your AI Space');
//     useEffect(() => {
//       if (draggedTool) {
//         const tool = nodes.find(n => n.id === draggedTool.id);
//         if (tool) {
//           lastDraggedToolLabelRef.current = tool.label;
//         }
//       }
//     }, [draggedTool, nodes]);
  
//     const updateNodePosition = (id: number, x: number, y: number) => {
//       setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, x, y } : node)));
//     };
  
//     const animatePanTo = (targetX: number, targetY: number) => {
//       const duration = 300;
//       const frameRate = 60;
//       const steps = duration / (1000 / frameRate);
//       const dx = (targetX - position.x) / steps;
//       const dy = (targetY - position.y) / steps;
//       let currentStep = 0;
  
//       const interval = setInterval(() => {
//         currentStep++;
//         setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
//         if (currentStep >= steps) {
//           setPosition({ x: targetX, y: targetY });
//           clearInterval(interval);
//         }
//       }, 1000 / frameRate);
//     };
  
//     const region = (() => {
//       const threshold = 200;
//       const { x, y } = position;
//       if (x < -threshold && y < -threshold) return 'top-left';
//       if (x > threshold && y < -threshold) return 'top-right';
//       if (x > threshold && y > threshold) return 'bottom-right';
//       if (x < -threshold && y > threshold) return 'bottom-left';
//       return 'center';
//     })();
  
//     return (
//       <div
//         ref={containerRef}
//         className="w-screen h-screen overflow-hidden relative flex items-center justify-center"
//         onMouseDown={handleMouseDown}
//       >
//         {/* Scenic landscape background: mountains and lake */}
//         <img
//           src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
//           alt="Scenic mountains and lake background"
//           className="absolute inset-0 w-full h-full object-cover -z-10"
//           draggable={false}
//         />
//         {/* Blurred circles for glassmorphism effect */}
//         <div className="pointer-events-none select-none">
//           <div className="absolute -left-32 top-1/4 w-72 h-72 bg-teal-200 opacity-30 rounded-full blur-3xl" />
//           <div className="absolute right-0 -top-24 w-80 h-80 bg-teal-100 opacity-20 rounded-full blur-3xl" />
//           <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-teal-300 opacity-20 rounded-full blur-3xl" style={{ transform: 'translateX(-50%)' }} />
//         </div>
//         {/* ChatPanel and nodes container */}
//         <div
//           className="absolute top-1/2 left-1/2 mb-20"
//           style={{
//             transform: `translate(-50%, -58%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
//             transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
//             zIndex: 1,
//           }}
//         >
//           {/* Thin white bar at the top for dropped tools */}
//           <div className="w-full flex items-center gap-3 px-6 py-2 bg-white/90 border-b border-white/60 rounded-t-2xl shadow-md" style={{ minHeight: 40, position: 'absolute', top: 0, left: 0, right: 0 }}>
//             {selectedTools.length === 0 ? null : selectedTools.map((tool, idx) => (
//               <span key={tool.label} className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-gray-200 shadow-sm">
//                 <tool.icon color={tool.color} />
//                 <span className="text-gray-700 text-sm font-medium">{tool.label}</span>
//               </span>
//             ))}
//           </div>
//           <div ref={chatPanelRef}>
//             <ChatPanel
//               shadowColor={panelShadowColor || droppedPanelShadowColor}
//               droppedMessage={droppedToolMessage}
//               droppedMessages={droppedMessages}
//               selectedTool={selectedTools.length > 0 ? selectedTools[selectedTools.length - 1] : null}
//             />
//           </div>
//           {/* Render nodes above the panel, as before */}
//           {nodes.map((node) => (
//             <div key={node.id}>
//               <ToolNode
//                 id={node.id}
//                 x={node.x}
//                 y={node.y}
//                 label={node.label}
//                 color={node.color}
//                 onDrag={updateNodePosition}
//                 setDraggedTool={setDraggedTool}
//                 isDragging={draggedTool?.id === node.id}
//               />
//             </div>
//           ))}
//         </div>
//         {/* Bottom control panel fixed at bottom center of window */}
//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-white/10 border border-white/30 rounded-full backdrop-blur-xl shadow-lg px-6 py-3">
//         {/* Top-left: Up arrow rotated -45deg */}
//         <button
//           className={`text-xl flex items-center justify-center rounded-full transition-colors duration-200 ${region === 'top-left' ? 'bg-purple-100 ring-2 ring-purple-400 text-purple-700 opacity-100' : 'text-gray-400 opacity-60'}`}
//           onClick={() => animatePanTo(-400, -400)}
//         >
//           <span style={{ display: 'inline-block', transform: 'rotate(-45deg)' }}><FaArrowUp /></span>
//         </button>
//         {/* Top-right: Up arrow rotated 45deg */}
//         <button
//           className={`text-xl flex items-center justify-center rounded-full transition-colors duration-200 ${region === 'top-right' ? 'bg-purple-100 ring-2 ring-purple-400 text-purple-700 opacity-100' : 'text-gray-400 opacity-60'}`}
//           onClick={() => animatePanTo(400, -400)}
//         >
//           <span style={{ display: 'inline-block', transform: 'rotate(45deg)' }}><FaArrowUp /></span>
//         </button>
//         {/* Home button */}
//         <button
//           className="text-purple-700 hover:text-purple-900 text-xl border-2 border-purple-400 rounded-full bg-white transition-colors duration-200"
//           onClick={() => animatePanTo(0, 0)}
//         >
//           <FaRegCircle />
//         </button>
//         {/* Bottom-right: Down arrow rotated -45deg */}
//         <button
//           className={`text-xl flex items-center justify-center rounded-full transition-colors duration-200 ${region === 'bottom-right' ? 'bg-purple-100 ring-2 ring-purple-400 text-purple-700 opacity-100' : 'text-gray-400 opacity-60'}`}
//           onClick={() => animatePanTo(400, 400)}
//         >
//           <span style={{ display: 'inline-block', transform: 'rotate(-45deg)' }}><FaArrowDown /></span>
//         </button>
//         {/* Bottom-left: Down arrow rotated 45deg */}
//         <button
//           className={`text-xl flex items-center justify-center rounded-full transition-colors duration-200 ${region === 'bottom-left' ? 'bg-purple-100 ring-2 ring-purple-400 text-purple-700 opacity-100' : 'text-gray-400 opacity-60'}`}
//           onClick={() => animatePanTo(-400, 400)}
//         >
//           <span style={{ display: 'inline-block', transform: 'rotate(45deg)' }}><FaArrowDown /></span>
//         </button>
//         {/* Reset button */}
//         <button
//           className="text-gray-400 hover:text-red-500 text-xl flex items-center justify-center rounded-full transition-colors duration-200"
//           onClick={() => {
//             setDroppedPanelShadowColor(null);
//             setDroppedToolLabel('Welcome to Your AI Space');
//             setDroppedToolMessage('');
//             setDroppedMessages(null);
//             setNodes(INITIAL_NODES);
//             setSelectedTools([]);
//           }}
//           title="Reset panel"
//         >
//           <FaUndo />
//         </button>
//         </div>
//       </div>
//     );
//   }
  





// import React, { useRef, useState, useEffect } from 'react';
// import ChatPanel from '../chat/ChatPanel';
// import ToolNode from './ToolNode';
// import {
//   FaArrowUp,
//   FaArrowDown,
//   FaUndo,
//   FaWpforms,
//   FaRegSquare,
// } from 'react-icons/fa';

// /* ─────────────────────────────────────────────────────────── */
// /* Initial nodes + canned chat                                */
// /* ─────────────────────────────────────────────────────────── */
// const INITIAL_NODES = [
//   { id: 1, x: -300, y: -150, label: 'Form Finder', color: '#22c55e' },
//   { id: 2, x: 300, y: 200, label: 'Tool B', color: '#3b82f6' },
// ];

// const FORM_FINDER_CHAT = [
//   { id: 1, sender: 'assistant', text: 'Here is information about Form Finder.' },
//   { id: 2, sender: 'user', text: 'What can I do with it?' },
//   { id: 3, sender: 'assistant', text: 'You can use Form Finder to quickly locate and fill out forms.' },
// ];

// /* ─────────────────────────────────────────────────────────── */

// export default function CanvasContainer() {
//   const containerRef          = useRef<HTMLDivElement>(null);
//   const chatPanelRef          = useRef<HTMLDivElement>(null);
//   const lastToolLabelRef      = useRef<string>('');   // remember label while dragging

//   /* Canvas‑level transforms */
//   const [position, setPosition]       = useState({ x: 0, y: 0 });
//   const [scale,    setScale]          = useState(1);

//   /* Drag‑and‑drop state */
//   const [isDragging, setIsDragging]   = useState(false);
//   const [startDrag,  setStartDrag]    = useState<{ x: number; y: number } | null>(null);
//   const [draggedTool,setDraggedTool]  = useState<null | { id: number; color: string }>(null);

//   /* Board state */
//   const [nodes, setNodes]                     = useState(INITIAL_NODES);
//   const [selectedTools, setSelectedTools]     = useState<{ label: string; color: string; icon: any }[]>([]);
//   const [panelShadowColor,setPanelShadowColor]= useState<string | null>(null);

//   /* ChatPanel props */
//   const [droppedToolMessage, setDroppedToolMessage] = useState('');
//   const [droppedMessages,    setDroppedMessages]    = useState<any[] | null>(null);

//   /* ───────────────────────── Mouse handlers (pan / zoom) */
//   const handleMouseDown = (e: React.MouseEvent) => {
//     if ((e.target as HTMLElement).dataset.draggable === 'true') return;
//     setIsDragging(true);
//     setStartDrag({ x: e.clientX, y: e.clientY });
//   };

//   const handleMouseMoveGlobal = (e: MouseEvent) => {
//     if (!isDragging || !startDrag) return;
//     const dx = e.clientX - startDrag.x;
//     const dy = e.clientY - startDrag.y;
//     setStartDrag({ x: e.clientX, y: e.clientY });
//     setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
//   };

//   const handleMouseUpGlobal = () => {
//     setIsDragging(false);
//     setStartDrag(null);
//   };

//   const handleWheelGlobal = (e: WheelEvent) => {
//     if (!e.ctrlKey) return;
//     e.preventDefault();
//     const delta = -e.deltaY * 0.001;
//     setScale(prev => Math.min(Math.max(prev + delta, 0.5), 2));
//   };

//   useEffect(() => {
//     window.addEventListener('mousemove', handleMouseMoveGlobal);
//     window.addEventListener('mouseup',    handleMouseUpGlobal);
//     window.addEventListener('wheel',      handleWheelGlobal, { passive: false });
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMoveGlobal);
//       window.removeEventListener('mouseup',    handleMouseUpGlobal);
//       window.removeEventListener('wheel',      handleWheelGlobal);
//     };
//   }, [isDragging, startDrag]);

//   /* ───────────────────────── Check when a dragged tool hovers ChatPanel */
//   const [isOverPanel, setIsOverPanel] = useState(false);

//   useEffect(() => {
//     if (!draggedTool) { setIsOverPanel(false); setPanelShadowColor(null); return; }

//     const hover = (e: MouseEvent) => {
//       if (!chatPanelRef.current) return;
//       const rect = chatPanelRef.current.getBoundingClientRect();
//       const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
//                      e.clientY >= rect.top  && e.clientY <= rect.bottom;
//       setIsOverPanel(inside);
//       setPanelShadowColor(inside ? draggedTool.color : null);
//     };
//     window.addEventListener('mousemove', hover);
//     return () => window.removeEventListener('mousemove', hover);
//   }, [draggedTool]);

//   /* ───────────────────────── React when drag ENDS */
//   useEffect(() => {
//     if (draggedTool) return;     // still dragging
//     if (!panelShadowColor) return; // dropped elsewhere

//     /* a tool was dropped ON the panel */
//     const label = lastToolLabelRef.current;
//     let message = '';

//     if (label === 'Form Finder') {
//       message = 'Hey, here is your form!';
//       setDroppedMessages(FORM_FINDER_CHAT);
//       setSelectedTools(prev =>
//         prev.some(t => t.label === 'Form Finder')
//           ? prev
//           : [...prev, { label: 'Form Finder', color: '#22c55e', icon: FaWpforms }]
//       );
//     } else if (label === 'Tool B') {
//       message = 'You dropped Tool B!';
//       setDroppedMessages(null);
//       setSelectedTools(prev =>
//         prev.some(t => t.label === 'Tool B')
//           ? prev
//           : [...prev, { label: 'Tool B', color: '#3b82f6', icon: FaRegSquare }]
//       );
//     } else {
//       message = `You dropped ${label}!`;
//       setDroppedMessages(null);
//     }

//     setDroppedToolMessage(message);
//     setNodes(prev => prev.filter(n => n.label !== label)); // remove from board
//   }, [draggedTool, panelShadowColor]);

//   /* ───────────────────────── Helpers */
//   const updateNodePosition = (id: number, x: number, y: number) =>
//     setNodes(prev => prev.map(n => (n.id === id ? { ...n, x, y } : n)));

//   const animatePanTo = (targetX: number, targetY: number) => {
//     const duration = 300;
//     const steps    = duration / (1000 / 60);
//     const dx       = (targetX - position.x) / steps;
//     const dy       = (targetY - position.y) / steps;
//     let  i         = 0;
//     const frame = () => {
//       i++;
//       setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
//       if (i < steps) requestAnimationFrame(frame);
//       else setPosition({ x: targetX, y: targetY });
//     };
//     requestAnimationFrame(frame);
//   };

//   const region = (() => {
//     const t = 200;
//     const { x, y } = position;
//     if (x < -t && y < -t) return 'top-left';
//     if (x >  t && y < -t) return 'top-right';
//     if (x >  t && y >  t) return 'bottom-right';
//     if (x < -t && y >  t) return 'bottom-left';
//     return 'center';
//   })();

//   /* ───────────────────────── Static TOP BAR component */
//   const TopBar = () => (
//     selectedTools.length === 0 ? null : (
//       <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
//         <div className="relative px-5 py-2 bg-white/90 border border-white/60 rounded-full shadow-lg backdrop-blur">
//           {/* notch */}
//           <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-8 h-4 bg-white/90 rounded-b-[16px] shadow-lg" />
//           {/* chips */}
//           <div className="flex gap-3">
//             {selectedTools.map(tool => (
//               <span key={tool.label} className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-gray-200 shadow-sm">
//                 <tool.icon color={tool.color} />
//                 <span className="text-gray-700 text-sm font-medium">{tool.label}</span>
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   );

//   /* ───────────────────────── JSX */
//   return (
//     <div
//       ref={containerRef}
//       className="w-screen h-screen overflow-hidden relative flex items-center justify-center"
//       onMouseDown={handleMouseDown}
//     >
//       {/* STATIC TOP BAR */}
//       <TopBar />

//       {/* background image */}
//       <img
//         src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
//         alt="Scenic mountains and lake background"
//         className="absolute inset-0 w-full h-full object-cover -z-10"
//         draggable={false}
//       />

//       {/* blurred decorative circles */}
//       <div className="pointer-events-none select-none">
//         <div className="absolute -left-32 top-1/4 w-72 h-72 bg-teal-200 opacity-30 rounded-full blur-3xl" />
//         <div className="absolute right-0 -top-24 w-80 h-80 bg-teal-100 opacity-20 rounded-full blur-3xl" />
//         <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-teal-300 opacity-20 rounded-full blur-3xl" style={{ transform: 'translateX(-50%)' }} />
//       </div>

//       {/* PANNABLE / ZOOMABLE LAYER */}
//       <div
//         className="absolute top-1/2 left-1/2 mb-20"
//         style={{
//           transform: `translate(-50%, -58%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
//           transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
//           zIndex: 1,
//         }}
//       >
//         {/* Chat panel */}
//         <div ref={chatPanelRef}>
//           <ChatPanel
//             shadowColor    ={panelShadowColor}
//             droppedMessage ={droppedToolMessage}
//             droppedMessages={droppedMessages}
//             selectedTool   ={selectedTools.at(-1) ?? null}
//           />
//         </div>

//         {/* Tool nodes */}
//         {nodes.map(node => (
//           <ToolNode
//             key={node.id}
//             id={node.id}
//             x={node.x}
//             y={node.y}
//             label={node.label}
//             color={node.color}
//             onDrag={updateNodePosition}
//             setDraggedTool={tool => {
//               if (tool) lastToolLabelRef.current = node.label;
//               setDraggedTool(tool);
//             }}
//             isDragging={draggedTool?.id === node.id}
//           />
//         ))}
//       </div>

//       {/* BOTTOM CONTROL PANEL (unchanged) */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-white/10 border border-white/30 rounded-full backdrop-blur-xl shadow-lg px-6 py-3">
//         {/* top‑left */}
//         <button className={`text-xl flex items-center justify-center rounded-full transition-colors duration-200 ${region==='top-left'?'bg-purple-100 ring-2 ring-purple-400 text-purple-700 opacity-100':'text-gray-400 opacity-60'}`} onClick={() => animatePanTo(-400,-400)}><span style={{transform:'rotate(-45deg)'}}><FaArrowUp/></span></button>
//         {/* top‑right */}
//         <button className={`text-xl flex items-center justify-center rounded-full transition-colors duration-200 ${region==='top-right'?'bg-purple-100 ring-2 ring-purple-400 text-purple-700 opacity-100':'text-gray-400 opacity-60'}`} onClick={() => animatePanTo(400,-400)}><span style={{transform:'rotate(45deg)'}}><FaArrowUp/></span></button>
//         {/* home */}
//         <button className="text-purple-700 hover:text-purple-900 text-xl border-2 border-purple-400 rounded-full bg-white transition-colors duration-200" onClick={() => animatePanTo(0,0)}>🏠</button>
//         {/* bottom‑right */}
//         <button className={`text-xl flex items-center justify-center rounded-full transition-colors duration-200 ${region==='bottom-right'?'bg-purple-100 ring-2 ring-purple-400 text-purple-700 opacity-100':'text-gray-400 opacity-60'}`} onClick={() => animatePanTo(400,400)}><span style={{transform:'rotate(-45deg)'}}><FaArrowDown/></span></button>
//         {/* bottom‑left */}
//         <button className={`text-xl flex items-center justify-center rounded-full transition-colors duration-200 ${region==='bottom-left'?'bg-purple-100 ring-2 ring-purple-400 text-purple-700 opacity-100':'text-gray-400 opacity-60'}`} onClick={() => animatePanTo(-400,400)}><span style={{transform:'rotate(45deg)'}}><FaArrowDown/></span></button>
//         {/* reset */}
//         <button className="text-gray-400 hover:text-red-500 text-xl flex items-center justify-center rounded-full transition-colors duration-200" onClick={() => {
//           setPanelShadowColor(null);
//           setDroppedToolMessage('');
//           setDroppedMessages(null);
//           setNodes(INITIAL_NODES);
//           setSelectedTools([]);
//         }} title="Reset panel"><FaUndo/></button>
//       </div>
//     </div>
//   );
// }





/* src/components/canvas/CanvasContainer.tsx */
import React, { useRef, useState, useEffect } from 'react';
import ChatPanel from '../chat/ChatPanel';
import ToolNode  from './ToolNode';
import ToolBoard from './ToolBoard';
import {
  FaWpforms,
  FaRegSquare,
  FaRegCircle,
  FaArrowUp,
  FaArrowDown,
  FaUndo,
  FaHome,
  FaUniversity,
  FaMapMarkerAlt,
  FaIdCard,
  FaUserCheck,
  FaRegHandPaper,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── initial data ─── */
const INITIAL_NODES = [
  { id: 1, x: -850, y: -350, label: 'Form Finder', color: '#22c55e' },
  { id: 2, x:  850, y: -350, label: 'Passbook Entry', color: '#3b82f6' },
  { id: 3, x: -850, y:  350, label: 'Change Address', color: '#f59e42' },
  { id: 4, x:  850, y:  350, label: 'ATM Pin Change', color: '#a855f7' },
  { id: 5, x: -500, y:  500, label: 'Aadhar Card Update', color: '#06b6d4' },
  { id: 6, x:  500, y:  500, label: 'KYC Update', color: '#f43f5e' },
];

const FORM_FINDER_CHAT = [
  { id: 1, sender:'assistant', text:'Here is information about Form Finder.' },
  { id: 2, sender:'user',      text:'What can I do with it?' },
  { id: 3, sender:'assistant', text:'You can use Form Finder to quickly locate and fill out forms.' },
];

const TYPING_MSG = { id: 'typing', sender: 'assistant', text: '...' };

export default function CanvasContainer() {
  /* pan / zoom state */
  const [pos,   setPos]   = useState({ x:0, y:0 });
  const [scale, setScale] = useState(1);

  // Chat state for Ask Something box
  const [askInput, setAskInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' },
  ]);
  const [chatTyping, setChatTyping] = useState(false);

  /* nodes & drag */
  const [nodes,    setNodes]    = useState(INITIAL_NODES);
  const [dragTool, setDragTool] = useState<null | { id:number; color:string }>(null);
  const lastLabelRef            = useRef<string>('');

  /* chips for top notch */
  const [notchTools, setNotchTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);

  /* Tool content mapping */
  const TOOL_CONTENT = {
    'Form Finder': 'Here is information about Form Finder.',
    'Passbook Entry': 'Please provide the details for your passbook entry.',
    'Change Address': 'Hey, tell me where you want your address to be updated.',
    'ATM Pin Change': 'Let’s get started with changing your ATM PIN. Please enter your new PIN.',
    'Aadhar Card Update': 'Please provide the details you want to update on your Aadhar card.',
    'KYC Update': 'Let’s update your KYC. Please upload your latest documents.'
  };

  /* ChatPanel props */
  const chatRef       = useRef<HTMLDivElement>(null);
  const [shadowColor, setShadowColor] = useState<string|null>(null);
  const [dropMsg,     setDropMsg    ] = useState('');
  const [dropMsgs,    setDropMsgs   ] = useState<any[]|null>(null);

  /* ─── pan & zoom handlers ─── */
  const [dragging,  setDragging]  = useState(false);
  const [startDrag, setStartDrag] = useState<{x:number;y:number}|null>(null);
  const [isPanMode, setIsPanMode] = useState(false);

  function onMouseDown(e:React.MouseEvent) {
    if (!isPanMode && (e.target as HTMLElement).dataset.draggable === 'true') return; // ignore node drag if not pan mode
    setDragging(true);
    setStartDrag({ x:e.clientX, y:e.clientY });
  }
  function onMouseMove(e:MouseEvent) {
    if (!dragging || !startDrag) return;
    const dx = e.clientX - startDrag.x;
    const dy = e.clientY - startDrag.y;
    setStartDrag({ x:e.clientX, y:e.clientY });
    setPos(p => ({ x:p.x + dx, y:p.y + dy }));
  }
  function onMouseUp()   { setDragging(false); setStartDrag(null); }
  function onWheel(e:WheelEvent) {
    if (!e.ctrlKey) return;
    e.preventDefault();
    setScale(s => Math.min(Math.max(s - e.deltaY * 0.001, 0.5), 2));
  }
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',    onMouseUp);
    window.addEventListener('wheel',      onWheel, { passive:false });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',    onMouseUp);
      window.removeEventListener('wheel',      onWheel);
    };
  }, [dragging, startDrag]);

  /* ─── hover highlight for ChatPanel ─── */
  useEffect(() => {
    if (!dragTool) { setShadowColor(null); return; }
    const hover = (e:MouseEvent) => {
      if (!chatRef.current) return;
      const r = chatRef.current.getBoundingClientRect();
      const inside = e.clientX>=r.left && e.clientX<=r.right && e.clientY>=r.top && e.clientY<=r.bottom;
      setShadowColor(inside ? dragTool.color : null);
    };
    window.addEventListener('mousemove', hover);
    return () => window.removeEventListener('mousemove', hover);
  }, [dragTool]);

  /* ─── drop logic ─── */
  useEffect(() => {
    if (dragTool || !shadowColor) return;
    const label = lastLabelRef.current;
    const toolInfo = [
      { label: 'Form Finder', icon: FaWpforms, color: '#22c55e' },
      { label: 'Passbook Entry', icon: FaRegSquare, color: '#3b82f6' },
      { label: 'Change Address', icon: FaMapMarkerAlt, color: '#f59e42' },
      { label: 'ATM Pin Change', icon: FaUniversity, color: '#a855f7' },
      { label: 'Aadhar Card Update', icon: FaIdCard, color: '#06b6d4' },
      { label: 'KYC Update', icon: FaUserCheck, color: '#f43f5e' },
    ].find(t => t.label === label);
    if (toolInfo) {
      setNotchTools(prev => prev.some(t => t.label === label) ? prev : [...prev, toolInfo]);
      setSelectedTool(toolInfo);
      setChatMessages([{ id: Date.now(), sender: 'assistant', text: '...' }]);
      setChatTyping(true);
      setTimeout(() => {
        setChatMessages([
          { id: Date.now(), sender: 'assistant', text: TOOL_CONTENT[label] }
        ]);
        setChatTyping(false);
      }, 1500);
    }
    setNodes(n => n.filter(node => node.label !== label));
    setDropMsg('');
    setDropMsgs(null);
  }, [dragTool, shadowColor]);

  /* move node */
  const moveNode = (id:number,x:number,y:number) =>
    setNodes(n => n.map(node => node.id===id ? {...node,x,y} : node));

  /* quick snap */
  const snap = (x:number,y:number) => setPos({ x, y });

  /* dynamic notch width */
  const notchW = Math.min(10 + notchTools.length * 50, 220);

  /* ─── JSX ─── */
  return (
    <div
      className="w-screen h-screen overflow-hidden relative select-none"
      onMouseDown={onMouseDown}
      style={{ cursor: isPanMode ? (dragging ? 'grabbing' : 'grab') : 'default', background: '#F8F9FB' }}
    >
      {/* Removed background image */}
      {/* TOP BAR */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="relative w-full flex items-center gap-3 h-[36px] px-8
                        bg-[#cccccc] backdrop-blur
                        rounded-b-[22px]">
          {/* No notch inside the navbar */}
        </div>
      </div>
      {/* Top notch now floats below the navbar */}
      {notchTools.length > 0 && (
        <div style={{width: Math.max(48, notchTools.length * 48)}}
             className="fixed left-1/2 top-[36px] -translate-x-1/2 h-16 bg-[#cccccc] backdrop-blur rounded-b-full flex items-center justify-center z-40">
          <AnimatePresence initial={false}>
            {notchTools.map(tool => (
              <motion.span
                key={tool.label}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: selectedTool?.label === tool.label ? 1.15 : 1, boxShadow: selectedTool?.label === tool.label ? '0 0 0 4px #c4b5fd55' : 'none' }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${selectedTool?.label === tool.label ? 'border-purple-500 bg-white/90' : 'border-transparent bg-white/60'} cursor-pointer transition-all`}
                onClick={() => {
                  setSelectedTool(tool);
                  setChatMessages([{ id: Date.now(), sender: 'assistant', text: TOOL_CONTENT[tool.label] }]);
                }}
              >
                <tool.icon color={tool.color} size={20}/>
                {selectedTool?.label === tool.label && (
                  <button className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full border border-gray-300 text-gray-500 hover:text-red-500 flex items-center justify-center text-xs"
                          onClick={e => {
                            e.stopPropagation();
                            setNotchTools(prev => prev.filter(t => t.label !== tool.label));
                            if (notchTools.length > 1) {
                              // Select another tool if available
                              const next = notchTools.find(t => t.label !== tool.label);
                              setSelectedTool(next);
                              setChatMessages(next ? [{ id: Date.now(), sender: 'assistant', text: TOOL_CONTENT[next.label] }] : [{ id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' }]);
                            } else {
                              setSelectedTool(null);
                              setChatMessages([{ id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' }]);
                            }
                          }}>×</button>
                )}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="relative w-full flex flex-col items-center justify-center gap-2
                        px-8 bg-[#cccccc] backdrop-blur z-10
                        rounded-t-[22px] pt-2 pb-3">
          {/* semicircular notch with home button inside */}
          <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-20 h-12 bg-[#cccccc] rounded-t-full shadow-lg flex items-center justify-center border-x-2 border-t-2 border-purple-200 z-0 overflow-hidden">
            <motion.button
              whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
              whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => snap(0,0)}
              className="w-16 h-8 bg-white rounded-t-full border-2 border-purple-400 flex items-center justify-center text-purple-700 shadow shadow-black/40"
              style={{ outline: 'none', border: 'none' }}
            >
              {/* Home button, no icon */}
            </motion.button>
          </div>
          {/* Ask Something box */}
          <form className="flex justify-start ml-0" onSubmit={e => {
            e.preventDefault();
            if (!askInput.trim()) return;
            const userMsg = { id: Date.now(), sender: 'user', text: askInput };
            setChatMessages(m => [...m, userMsg, TYPING_MSG]);
            const inputLower = askInput.trim().toLowerCase();
            // Find tool name in input
            const tool = Object.keys(TOOL_CONTENT).find(t => inputLower.includes(t.toLowerCase()));
            let toolMessage = '';
            if (tool) {
              toolMessage = TOOL_CONTENT[tool];
              // Add tool to notch and select it, just like dropping
              const toolInfo = [
                { label: 'Form Finder', icon: FaWpforms, color: '#22c55e' },
                { label: 'Passbook Entry', icon: FaRegSquare, color: '#3b82f6' },
                { label: 'Change Address', icon: FaMapMarkerAlt, color: '#f59e42' },
                { label: 'ATM Pin Change', icon: FaUniversity, color: '#a855f7' },
                { label: 'Aadhar Card Update', icon: FaIdCard, color: '#06b6d4' },
                { label: 'KYC Update', icon: FaUserCheck, color: '#f43f5e' },
              ].find(ti => ti.label === tool);
              if (toolInfo) {
                setNotchTools(prev => prev.some(t => t.label === tool) ? prev : [...prev, toolInfo]);
                setSelectedTool(toolInfo);
              }
            } else {
              toolMessage = askInput.toLowerCase().includes('form') ? 'Here is your form' : 'That sounds interesting. Tell me more.';
            }
            setAskInput("");
            setChatTyping(true);
            setTimeout(() => {
              setChatMessages(m => [
                ...m.filter(msg => msg.id !== 'typing'),
                { id: Date.now() + 1, sender: 'assistant', text: toolMessage }
              ]);
              setChatTyping(false);
            }, 1500);
          }}>
            <input
              type="text"
              placeholder="Ask Something..."
              className="w-[320px] max-w-full px-4 py-2 rounded-full border border-gray-300 shadow bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={askInput}
              onChange={e => setAskInput(e.target.value)}
            />
          </form>
          {/* Directional and undo buttons */}
          <div className="flex items-center justify-end gap-3 ml-4">
            <motion.button
              whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
              whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={()=>snap(-400,-300)}
              className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-purple-400 shadow !opacity-100"
              style={{ outline: 'none', border: 'none' }}
            >
              <FaArrowUp/>
            </motion.button>
            {/* @ts-ignore */}
            <motion.button
              whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
              whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={()=>snap(400,-300)}
              className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-purple-400 shadow !opacity-100"
              style={{ outline: 'none', border: 'none' }}
            >
              <FaArrowUp style={{transform:'rotate(90deg)'}}/>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
              whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={()=>snap(400,300)}
              className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-purple-400 shadow !opacity-100"
              style={{ outline: 'none', border: 'none' }}
            >
              <FaArrowDown/>
            </motion.button>
            {/* @ts-ignore */}
            <motion.button
              whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
              whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={()=>snap(-400,300)}
              className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-purple-400 shadow !opacity-100"
              style={{ outline: 'none', border: 'none' }}
            >
              <FaArrowDown style={{transform:'rotate(90deg)'}}/>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
              whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => {
                setNodes(INITIAL_NODES);
                setNotchTools([]);
                setSelectedTool(null);
                setDropMsgs(null);
                setDropMsg('');
                setChatMessages([
                  { id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' },
                ]);
                setChatTyping(false);
              }}
              className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-purple-400 shadow !opacity-100"
              style={{ outline: 'none', border: 'none' }}
            >
              <FaUndo/>
            </motion.button>
            {/* Hand icon for infinite canvas navigation */}
            <motion.button
              whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
              whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => setIsPanMode(v => !v)}
              className={`w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center shadow !opacity-100 ${isPanMode ? 'text-purple-700 ring-2 ring-purple-400' : 'text-purple-400'}`}
              style={{ outline: 'none', border: 'none' }}
              title="Pan Mode"
            >
              <FaRegHandPaper/>
            </motion.button>
          </div>
        </div>
      </div>

      {/* PANNABLE LAYER */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{ transform:`translate(-50%,-50%) translate(${pos.x}px,${pos.y}px) scale(${scale})`, pointerEvents: isPanMode ? 'auto' : 'auto' }}
      >
        {/* ToolBoard is now positioned to the top left and away from the ChatPanel */}
        <div style={{ position: 'absolute', left: -900, top: -200 }}>
          <ToolBoard />
        </div>

        {/* Tool nodes */}
        {nodes.map(node => (
          <ToolNode
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            label={node.label}
            color={node.color}
            onDrag={moveNode}
            isDragging={dragTool?.id === node.id}
            setDraggedTool={tool => {
              if (isPanMode) return; // disable node drag in pan mode
              if (tool) lastLabelRef.current = node.label;
              setDragTool(tool);
            }}
          />
        ))}
      </div>

      {/* ChatPanel is now fixed and centered in the viewport */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
        <div className="pointer-events-auto">
          <ChatPanel
            hideInput
            shadowColor={shadowColor}
            droppedMessage={dropMsg}
            droppedMessages={dropMsgs}
            selectedTool={selectedTool}
            messages={chatMessages}
            typing={chatTyping}
          />
        </div>
      </div>
    </div>
  );
}
