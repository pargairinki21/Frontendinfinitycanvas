/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* src/components/canvas/CanvasContainer.tsx */
import React, { useRef, useState, useEffect } from 'react';
import ChatPanel from '../chat/ChatPanel';
import ToolBoard from './ToolBoard';
import Folder from './Folder';
import {
  FaWpforms,
  FaRegSquare,
  FaArrowUp,
  FaArrowDown,
  FaUndo,
  FaUniversity,
  FaMapMarkerAlt,
  FaIdCard,
  FaUserCheck,
  FaRegHandPaper,
  FaChevronDown, FaChevronUp, FaHome
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { IconType } from 'react-icons';
import ReactDataGrid from 'react-data-grid';
import saveAs from 'file-saver';

type Tool = {
  label: string;
  icon: IconType;
  color: string;
};

/* ─── initial data ─── */
const INITIAL_NODES = [
  { id: 1, x: -850, y: -350, label: 'Form Finder', color: '#22c55e' },
  { id: 2, x:  850, y: -350, label: 'Passbook Entry', color: '#3b82f6' },
  { id: 3, x: -850, y:  350, label: 'Change Address', color: '#f59e42' },
  { id: 4, x:  850, y:  350, label: 'ATM Pin Change', color: '#a855f7' },
  { id: 5, x: -500, y:  500, label: 'Aadhar Card Update', color: '#06b6d4' },
  { id: 6, x:  500, y:  500, label: 'KYC Update', color: '#f43f5e' },
];

const TYPING_MSG = { id: 'typing', sender: 'assistant', text: '...' };

export default function CanvasContainer() {
  /* pan / zoom state */
  const [pos,   setPos]   = useState({ x:0, y:0 });
  const [scale, setScale] = useState(1);

  // Define unique tools for each folder
  const TOOLS_FOR_FOLDERS = {
    tools: [
      { label: 'Form Finder', icon: FaWpforms, color: '#22c55e' },
      { label: 'Change Address', icon: FaMapMarkerAlt, color: '#f59e42' },
      { label: 'ATM Pin Change', icon: FaUniversity, color: '#a855f7' },
      { label: 'Aadhar Card Update', icon: FaIdCard, color: '#06b6d4' },
      { label: 'KYC Update', icon: FaUserCheck, color: '#f43f5e' },
      { label: 'Passbook Entry', icon: FaRegSquare, color: '#3b82f6' },
    ],
    'information-retrieval': [
      { label: 'Document Search', icon: FaWpforms, color: '#0ea5e9' },
      { label: 'FAQ Finder', icon: FaRegSquare, color: '#fbbf24' },
      { label: 'Knowledge Base', icon: FaMapMarkerAlt, color: '#a3e635' },
      { label: 'Data Extractor', icon: FaUniversity, color: '#f472b6' },
      { label: 'Smart Query', icon: FaIdCard, color: '#818cf8' },
      { label: 'Insight Generator', icon: FaUserCheck, color: '#f87171' },
    ],
    sop: [
      { label: 'SOP Builder', icon: FaWpforms, color: '#f59e42' },
      { label: 'Step Tracker', icon: FaRegSquare, color: '#22d3ee' },
      { label: 'Compliance Check', icon: FaMapMarkerAlt, color: '#a3e635' },
      { label: 'Approval Flow', icon: FaUniversity, color: '#f43f5e' },
      { label: 'Template Manager', icon: FaIdCard, color: '#fbbf24' },
      { label: 'Audit Log', icon: FaUserCheck, color: '#a855f7' },
    ],
    performance: [
      { label: 'KPI Dashboard', icon: FaWpforms, color: '#f43f5e' },
      { label: 'Scorecard', icon: FaRegSquare, color: '#22c55e' },
      { label: 'Benchmarking', icon: FaMapMarkerAlt, color: '#3b82f6' },
      { label: 'Trend Analyzer', icon: FaUniversity, color: '#f59e42' },
      { label: 'Goal Setter', icon: FaIdCard, color: '#06b6d4' },
      { label: 'Performance Review', icon: FaUserCheck, color: '#fbbf24' },
    ],
  };

  // Per-folder card state
  const [folderCards, setFolderCards] = useState(() => ({
    tools: [...TOOLS_FOR_FOLDERS.tools],
    'information-retrieval': [...TOOLS_FOR_FOLDERS['information-retrieval']],
    sop: [...TOOLS_FOR_FOLDERS.sop],
    performance: [...TOOLS_FOR_FOLDERS.performance],
  }));

  // Define initial folder positions and names
  const initialFolders = [
    { id: 'tools', name: 'Tools', x: -900, y: -200 },
    { id: 'information-retrieval', name: 'Information Retrieval', x: -900, y: 300 },
    { id: 'sop', name: 'SOP', x: 900, y: -200 },
    { id: 'performance', name: 'Performance', x: 900, y: 300 },
  ];
  const [folders, setFolders] = useState(initialFolders);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function handleFolderPointerDown(e: React.PointerEvent, folderId: string) {
    if (selectedFolderId === folderId) {
      setDraggingId(folderId);
      const folder = folders.find(f => f.id === folderId);
      if (folder) {
        setDragOffset({ x: e.clientX - folder.x, y: e.clientY - folder.y });
      }
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else {
      setSelectedFolderId(folderId);
    }
    e.stopPropagation();
  }

  function handleFolderPointerMove(e: React.PointerEvent, folderId: string) {
    if (draggingId === folderId && dragOffset) {
      setFolders(prev => prev.map(f =>
        f.id === folderId
          ? { ...f, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
          : f
      ));
    }
  }

  function handleFolderPointerUp(e: React.PointerEvent, folderId: string) {
    if (draggingId === folderId) {
      setDraggingId(null);
      setDragOffset(null);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  }

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
  // Update notchTools to store fromFolder
  const [notchTools, setNotchTools] = useState<{ tool: Tool, fromFolder: string }[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [flyingIcon, setFlyingIcon] = useState<{ tool: Tool, from: DOMRect } | null>(null);
  const [flyingCard, setFlyingCard] = useState<{ tool: Tool, from: DOMRect } | null>(null);
  const notchRef = useRef<HTMLDivElement>(null);

  // Add drag state for card-to-notch
  const [draggedCard, setDraggedCard] = useState<{ tool: Tool, fromFolder: string } | null>(null);

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
    if (!isPanMode && (e.target as HTMLElement).dataset.draggable === 'true') return;
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
      setNotchTools(prev => prev.some(t => t.tool.label === label) ? prev : [...prev, { tool: toolInfo, fromFolder: selectedFolderId || 'tools' }]);
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
  }, [dragTool, shadowColor, selectedFolderId]);

  /* quick snap */
  const snap = (x:number,y:number) => setPos({ x, y });

  // Add mode state
  const [expandedMode, setExpandedMode] = useState(false);

  // Excel-like placeholder for expanded mode
  function FakeExcelSheet() {
    // Define columns (A-H)
    const columns = Array.from({ length: 8 }, (_, i) => ({
      key: String.fromCharCode(65 + i),
      name: String.fromCharCode(65 + i),
      resizable: true,
      editable: true,
      width: 60
    }));
    // Define rows (1-20)
    const [rows, setRows] = React.useState(
      Array.from({ length: 20 }, (_, rowIdx) => {
        const row = {};
        for (let col = 0; col < 8; col++) {
          row[String.fromCharCode(65 + col)] = '';
        }
        return row;
      })
    );
    const containerRef = React.useRef<HTMLDivElement>(null);

    // CSV Export/Import helpers
    function exportToCSV() {
      const csv = [columns.map(col => col.name).join(',')]
        .concat(rows.map(row => columns.map(col => row[col.key] || '').join(',')))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'sheet.csv');
    }
    function importFromCSV(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = evt => {
        const text = evt.target.result;
        if (typeof text !== 'string') return;
        const lines = text.split(/\r?\n/);
        const newRows = lines.slice(1).map(line => {
          const values = line.split(',');
          const row = {};
          columns.forEach((col, i) => { row[col.key] = values[i] || ''; });
          return row;
        });
        setRows(newRows);
      };
      reader.readAsText(file);
    }
    // Context menu for row/column add/delete
    const [contextMenu, setContextMenu] = React.useState(null);
    function handleContextMenu(e) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
    function addRow() {
      setRows(r => [...r, Object.fromEntries(columns.map(col => [col.key, '']))]);
      setContextMenu(null);
    }
    function deleteRow() {
      setRows(r => r.slice(0, -1));
      setContextMenu(null);
    }

    return (
      <div
        ref={containerRef}
        className="w-[520px] h-[340px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-auto transition-all duration-500 flex flex-col scrollbar-hide p-0.5 scrollbar-hide"
        style={{ cursor: 'auto' }}
        onContextMenu={handleContextMenu}
      >
        <div className="flex items-center gap-2 mb-1 px-2 pt-1">
          <button className="text-xs px-2 py-1 bg-gray-100 rounded border border-gray-300 hover:bg-gray-200" onClick={exportToCSV}>Export CSV</button>
          <label className="text-xs px-2 py-1 bg-gray-100 rounded border border-gray-300 hover:bg-gray-200 cursor-pointer">
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={importFromCSV} />
          </label>
          <button className="text-xs px-2 py-1 bg-gray-100 rounded border border-gray-300 hover:bg-gray-200" onClick={addRow}>Add Row</button>
          <button className="text-xs px-2 py-1 bg-gray-100 rounded border border-gray-300 hover:bg-gray-200" onClick={deleteRow}>Delete Row</button>
        </div>
        {contextMenu && (
          <div style={{ position: 'fixed', left: contextMenu.x, top: contextMenu.y, zIndex: 1000 }} className="bg-white border border-gray-300 rounded shadow p-2 text-xs">
            <button className="block w-full text-left px-2 py-1 hover:bg-gray-100" onClick={addRow}>Add Row</button>
            <button className="block w-full text-left px-2 py-1 hover:bg-gray-100" onClick={deleteRow}>Delete Row</button>
            <button className="block w-full text-left px-2 py-1 hover:bg-gray-100" onClick={() => setContextMenu(null)}>Close</button>
          </div>
        )}
        <ReactDataGrid
          columns={columns.map(col => ({ ...col, editable: true }))}
          rows={rows}
          onRowsChange={setRows}
          className="rdg-light"
          style={{ height: 300, fontFamily: 'inherit', fontSize: 14 }}
          enableCellSelect={true}
          // Multi-cell selection, keyboard nav, copy/paste are built-in
        />
      </div>
    );
  }

  // Notch drop zone logic
  const handleCardDropToNotch = (tool: Tool, fromFolder: string) => {
    setNotchTools(prev => prev.some(t => t.tool.label === tool.label) ? prev : [...prev, { tool, fromFolder }]);
    setFolderCards(prev => ({
      ...prev,
      [fromFolder]: prev[fromFolder].filter(t => t.label !== tool.label)
    }));
  };

  /* ─── JSX ─── */
  return (
    <div
      className="w-screen h-screen overflow-hidden relative select-none"
      onMouseDown={onMouseDown}
      style={{
        cursor: isPanMode ? (dragging ? 'grabbing' : 'grab') : 'default',
        background: 'none',
      }}
    >
      {/* Restoring the previous Pexels background image */}
      <img
        src="https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&w=1500&q=80"
        alt="Nature background"
        className="absolute inset-0 w-full h-full object-cover -z-20 select-none pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 bg-black/40 -z-10 pointer-events-none select-none" />

      {/* Notch now at the very top of the page */}
      <div
        ref={notchRef}
        style={{
          width: Math.max(48, notchTools.length * 48),
          background: 'rgba(255,255,255,0.22)',
          backdropFilter: 'blur(19px)',
          WebkitBackdropFilter: 'blur(19px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1), inset 0 0 52px 26px rgba(255,255,255,0.26)'
        }}
        className="fixed left-1/2 top-0 -translate-x-1/2 h-16 rounded-b-full flex items-center justify-center z-40"
      >
          <AnimatePresence>
            {notchTools
              .filter(nt => nt && nt.tool && nt.tool.label)
              .map(({ tool, fromFolder }) => (
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
                              setNotchTools(prev => prev.filter(nt => nt && nt.tool && nt.tool.label !== tool.label));
                              setFolderCards(prev => ({
                                ...prev,
                                [fromFolder]: [...(prev[fromFolder] || []), tool]
                              }));
                              if (notchTools.length > 1) {
                                const next = notchTools.find(nt => nt && nt.tool && nt.tool.label !== tool.label);
                                setSelectedTool(next?.tool || null);
                                setChatMessages(next ? [{ id: Date.now(), sender: 'assistant', text: TOOL_CONTENT[next.tool.label] }] : [{ id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' }]);
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

       {/* Flying Icon Animation */}
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
               ease: [0.4, 0, 0.2, 1] // Professional ease-in-out curve
             }}
             onAnimationComplete={() => {
               setNotchTools(prev => prev.some(t => t.tool.label === flyingIcon.tool.label) ? prev : [...prev, { tool: flyingIcon.tool, fromFolder: selectedFolderId || 'tools' }]);
               setSelectedTool(flyingIcon.tool);
               setChatMessages([{ id: Date.now(), sender: 'assistant', text: TOOL_CONTENT[flyingIcon.tool.label] }]);
               setFlyingIcon(null);
             }}
           >
             <flyingIcon.tool.icon color={flyingIcon.tool.color} size={20} />
           </motion.div>
         )}
       </AnimatePresence>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div
          className="relative w-full flex flex-col items-center justify-center gap-2 px-8 z-10 rounded-t-[22px] pt-2 pb-3"
          style={{
            // All background, border, and boxShadow removed for full transparency
          }}
        >
          {/* Ask Something box */}
          <form className="flex justify-start ml-0" onSubmit={e => {
            e.preventDefault();
            if (!askInput.trim()) return;
            const userMsg = { id: Date.now(), sender: 'user', text: askInput };
            setChatMessages(m => [...m, userMsg, TYPING_MSG]);
            const inputLower = askInput.trim().toLowerCase();
            const tool = Object.keys(TOOL_CONTENT).find(t => inputLower.includes(t.toLowerCase()));
            let toolMessage = '';
            if (tool) {
              toolMessage = TOOL_CONTENT[tool];
              const toolInfo = [
                { label: 'Form Finder', icon: FaWpforms, color: '#22c55e' },
                { label: 'Passbook Entry', icon: FaRegSquare, color: '#3b82f6' },
                { label: 'Change Address', icon: FaMapMarkerAlt, color: '#f59e42' },
                { label: 'ATM Pin Change', icon: FaUniversity, color: '#a855f7' },
                { label: 'Aadhar Card Update', icon: FaIdCard, color: '#06b6d4' },
                { label: 'KYC Update', icon: FaUserCheck, color: '#f43f5e' },
              ].find(ti => ti.label === tool);
              if (toolInfo) {
                setNotchTools(prev => prev.some(t => t.tool.label === tool) ? prev : [...prev, { tool: toolInfo, fromFolder: selectedFolderId || 'tools' }]);
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
          {/* Add vertical gap below input */}
          <div className="mt-3" />
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
            {/* Home icon button (moved between up and right arrows) */}
            <motion.button
              whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
              whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => snap(0,0)}
              className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-purple-400 shadow !opacity-100"
              style={{ outline: 'none', border: 'none' }}
              title="Home"
            >
              <FaHome />
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
            {/* Collapse/Expand Chat icon button */}
            <motion.button
              whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
              whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => setExpandedMode((v) => !v)}
              className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-purple-400 shadow !opacity-100 ml-2"
              style={{ outline: 'none', border: 'none' }}
              title={expandedMode ? 'Collapse Chat' : 'Expand Chat'}
            >
              {expandedMode ? <FaChevronDown /> : <FaChevronUp />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* PANNABLE LAYER */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{ transform:`translate(-50%,-50%) scale(${scale})`, pointerEvents: isPanMode ? 'auto' : 'auto' }}
      >
        {folders.map(folder => {
          const isSelected = selectedFolderId === folder.id;
          const folderTools = folderCards[folder.id as keyof typeof folderCards];
          return (
            <div
              key={folder.id}
              style={{ position: 'absolute', left: folder.x, top: folder.y, zIndex: isSelected ? 50 : 10 }}
              className={
                (isSelected
                  ? 'scale-105 shadow-2xl border-2 border-purple-400 ring-4 ring-purple-200/40 transition-transform duration-200 cursor-move '
                  : 'transition-transform duration-200 cursor-pointer ') +
                'rounded-2xl'
              }
              onPointerDown={e => handleFolderPointerDown(e, folder.id)}
              onPointerMove={e => handleFolderPointerMove(e, folder.id)}
              onPointerUp={e => handleFolderPointerUp(e, folder.id)}
            >
              <ToolBoard
                heading={folder.name}
                tools={folderTools}
                flyingCardLabel={null}
                onToolClick={(tool, rect) => {
                  if (!notchTools.some(nt => nt.tool.label === tool.label)) {
                    setNotchTools(prev => [...prev, { tool, fromFolder: folder.id }]);
                    setFolderCards(prev => ({
                      ...prev,
                      [folder.id]: prev[folder.id].filter(t => t.label !== tool.label)
                    }));
                    setSelectedTool(tool);
                    setChatMessages([{ id: Date.now(), sender: 'assistant', text: TOOL_CONTENT[tool.label] || tool.label }]);
                  }
                }}
                onCardDrop={tool => handleCardDropToNotch(tool, folder.id)}
              />
            </div>
          );
        })}
      </div>

      {/* Flying Card Animation */}
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
                  width: 32 * 2.5,
                  height: 32 * 1.5,
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
            onAnimationComplete={() => {
              setFolderCards(prev => ({
                ...prev,
                [selectedFolderId as keyof typeof folderCards]: [...prev[selectedFolderId as keyof typeof folderCards].filter(t => t.label !== flyingCard.tool.label), flyingCard.tool]
              }));
              setSelectedTool(flyingCard.tool);
              setChatMessages([{ id: Date.now(), sender: 'assistant', text: TOOL_CONTENT[flyingCard.tool.label] }]);
              setFlyingCard(null);
            }}
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

      {/* Chat/Excel layout */}
      {expandedMode ? (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none transition-all duration-500">
          <div className="pointer-events-auto flex items-center justify-center">
            <div className="flex flex-row gap-8 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md shadow-xl border border-white/30 p-1.5"
                 style={{
                   // Remove explicit width/height, let content + padding define size
                 }}>
              <div className="flex-shrink-0 h-[340px] w-[520px] flex items-center justify-center">
                <FakeExcelSheet />
              </div>
              <div className="flex-shrink-0 h-[340px] w-[340px] flex items-center justify-center">
                <ChatPanel
                  shadowColor={shadowColor}
                  droppedMessage={dropMsg}
                  droppedMessages={dropMsgs}
                  hideInput={false} // Changed to false for expanded mode
                  selectedTool={selectedTool}
                  messages={chatMessages}
                  typing={chatTyping}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40 mb-8 transition-all duration-500">
          <div className="pointer-events-auto">
            <ChatPanel
              hideInput={false} // Changed to false for expanded mode
              shadowColor={shadowColor}
              droppedMessage={dropMsg}
              droppedMessages={dropMsgs}
              selectedTool={selectedTool}
              messages={chatMessages}
              typing={chatTyping}
            />
          </div>
        </div>
      )}
    </div>
  );
}
