import { useEffect, useRef, useState } from 'react';

type ToolNodeProps = {
  id: number;
  x: number;
  y: number;
  label: string;
  onDrag: (id: number, x: number, y: number) => void;
};

export default function ToolNode({ id, x, y, label, onDrag }: ToolNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({ x: e.clientX - x, y: e.clientY - y });
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      onDrag(id, newX, newY);
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset, id, onDrag]);

  return (
    <div
      ref={nodeRef}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      className="absolute data-[draggable=true]:cursor-move"
      data-draggable="true"
      onMouseDown={handleMouseDown}
    >
      <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-4 min-w-[150px] text-sm hover:shadow-xl transition-shadow duration-200">
        {label}
      </div>
    </div>
  );
}
