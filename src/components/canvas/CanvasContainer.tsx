import { useRef, useState, useEffect } from 'react';
import ChatPanel from '../chat/ChatPanel';
import ToolNode from './ToolNode';
import {
    FaRegCircle,
    FaRegSquare,
    FaRegStar,
    FaRegHeart,
    FaRegSmile,
    FaRegKeyboard,
    FaCircle,
    FaSquare,
    FaStar,
    FaHeart,
    FaSmile,
  } from 'react-icons/fa';

  export default function CanvasContainer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [startDrag, setStartDrag] = useState<{ x: number; y: number } | null>(null);
    const [nodes, setNodes] = useState([
      { id: 1, x: -300, y: -150, label: 'Tool A' },
      { id: 2, x: 300, y: 200, label: 'Tool B' },
    ]);
  
    const handleMouseDown = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).dataset.draggable === 'true') return;
      setIsDragging(true);
      setStartDrag({ x: e.clientX, y: e.clientY });
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
      setStartDrag(null);
    };
  
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !startDrag) return;
      const dx = e.clientX - startDrag.x;
      const dy = e.clientY - startDrag.y;
      setStartDrag({ x: e.clientX, y: e.clientY });
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    };
  
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 2));
      }
    };
  
    useEffect(() => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('wheel', handleWheel);
      };
    }, [isDragging, startDrag]);
  
    const updateNodePosition = (id: number, x: number, y: number) => {
      setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, x, y } : node)));
    };
  
    const animatePanTo = (targetX: number, targetY: number) => {
      const duration = 300;
      const frameRate = 60;
      const steps = duration / (1000 / frameRate);
      const dx = (targetX - position.x) / steps;
      const dy = (targetY - position.y) / steps;
      let currentStep = 0;
  
      const interval = setInterval(() => {
        currentStep++;
        setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        if (currentStep >= steps) {
          setPosition({ x: targetX, y: targetY });
          clearInterval(interval);
        }
      }, 1000 / frameRate);
    };
  
    const region = (() => {
      const threshold = 200;
      const { x, y } = position;
      if (x < -threshold && y < -threshold) return 'top-left';
      if (x > threshold && y < -threshold) return 'top-right';
      if (x > threshold && y > threshold) return 'bottom-right';
      if (x < -threshold && y > threshold) return 'bottom-left';
      return 'center';
    })();
  
    return (
      <div
        ref={containerRef}
        className="w-screen h-screen overflow-hidden bg-[#f1ede9] relative"
        onMouseDown={handleMouseDown}
      >
        {/* Bottom control panel */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-white shadow-lg rounded-full px-6 py-3 border border-gray-200">
          {[
            {
              icon: region !== 'top-left' ? FaCircle : FaRegCircle,
              onClick: () => animatePanTo(-400, -400),
            },
            {
              icon: region !== 'center' ? FaSquare : FaRegSquare,
              onClick: () => animatePanTo(0, 0),
            },
            {
              icon: region !== 'top-right' ? FaStar : FaRegStar,
              onClick: () => animatePanTo(400, -400),
            },
            {
              icon: region !== 'bottom-right' ? FaHeart : FaRegHeart,
              onClick: () => animatePanTo(400, 400),
            },
            {
              icon: region !== 'bottom-left' ? FaSmile : FaRegSmile,
              onClick: () => animatePanTo(-400, 400),
            },
            {
              icon: FaRegKeyboard,
              onClick: () => {},
            },
          ].map(({ icon: Icon, onClick }, index) => (
            <button
              key={index}
              className="text-gray-700 hover:text-purple-600 text-xl"
              onClick={onClick}
            >
              <Icon />
            </button>
          ))}
        </div>
  
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <ChatPanel />
          {nodes.map((node) => (
            <ToolNode
              key={node.id}
              id={node.id}
              x={node.x}
              y={node.y}
              label={node.label}
              onDrag={updateNodePosition}
            />
          ))}
        </div>
      </div>
    );
  }
  