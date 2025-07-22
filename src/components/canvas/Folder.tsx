// src/components/canvas/Folder.tsx
import React from 'react';
import ToolNode from './ToolNode';

type Tool = {
  id: number;
  label: string;
  x: number;
  y: number;
  color: string;
};

type FolderProps = {
  id: string;
  name: string;
  x: number;
  y: number;
  tools: Tool[];
  onDragTool: (toolId: number, x: number, y: number) => void;
  onToolClick: (tool: Tool) => void;
};

export default function Folder({ id, name, x, y, tools = [], onDragTool, onToolClick }: FolderProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div
      className="absolute border rounded-xl bg-white shadow-md"
      style={{ left: x, top: y, width: collapsed ? 200 : 300 }}
    >
      <div className="p-2 border-b flex justify-between items-center cursor-pointer bg-gray-100 rounded-t-xl" onClick={() => setCollapsed(!collapsed)}>
        <span className="font-semibold">{name}</span>
        <button>{collapsed ? '+' : '-'}</button>
      </div>

      {!collapsed && (
        <div className="relative p-2 space-y-2">
          {tools.map(tool => (
            <ToolNode
              key={tool.id}
              {...tool}
              isDragging={false}
              onDrag={onDragTool}
              setDraggedTool={() => {}}
              onClick={() => onToolClick(tool)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
