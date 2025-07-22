// src/components/canvas/Folder.tsx
import React from 'react';


type Tool = {
  id: number;
  label: string;
  color: string;
};

type FolderProps = {
  id: string;
  name: string;
  x: number;
  y: number;
  tools: Tool[];
  onToolClick: (tool: Tool) => void;
};

export default function Folder({ id, name, x, y, tools = [], onToolClick }: FolderProps) {
  return (
    <div
      className="absolute border rounded-xl bg-white shadow-md"
      style={{ left: x, top: y, width: 320 }}
    >
      <div className="p-3 border-b bg-gray-100 rounded-t-xl">
        <span className="font-semibold text-lg">{name}</span>
      </div>
      <div className="p-4 grid grid-cols-1 gap-3">
        {tools.map(tool => (
          <div
            key={tool.id}
            className="w-full h-20 rounded-xl shadow border border-gray-100 flex flex-col items-start p-3 gap-1 transition-all cursor-pointer bg-white hover:bg-gray-50"
            style={{ borderLeft: `4px solid ${tool.color}` }}
            onClick={() => onToolClick(tool)}
          >
            <span className="font-semibold text-gray-700 text-base">{tool.label}</span>
            {/* You can add a description or icon here if needed */}
          </div>
        ))}
      </div>
    </div>
  );
}
