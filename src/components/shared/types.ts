import { IconType } from 'react-icons';

export type Tool = {
  label: string;
  icon: IconType;
  color: string;
  description?: string; // Added description for ToolBoard
};

export type ChatMessage = {
  id: string | number; // Use string for 'typing' or number for others
  sender: 'user' | 'assistant';
  text: string;
};

export type Node = {
  id: number;
  x: number;
  y: number;
  label: string;
  color: string;
};