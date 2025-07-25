import { FaWpforms, FaRegSquare, FaMapMarkerAlt, FaUniversity, FaIdCard, FaUserCheck } from 'react-icons/fa';
import { Tool, Node, ChatMessage } from './types';

/* ─── Initial Data ─── */
export const INITIAL_NODES: Node[] = [
  { id: 1, x: -850, y: -350, label: 'Form Finder', color: '#22c55e' },
  { id: 2, x: 850, y: -350, label: 'Passbook Entry', color: '#3b82f6' },
  { id: 3, x: -850, y: 350, label: 'Change Address', color: '#f59e42' },
  { id: 4, x: 850, y: 350, label: 'ATM Pin Change', color: '#a855f7' },
  { id: 5, x: -500, y: 500, label: 'Aadhar Card Update', color: '#06b6d4' },
  { id: 6, x: 500, y: 500, label: 'KYC Update', color: '#f43f5e' },
];

export const TYPING_MSG: ChatMessage = { id: 'typing', sender: 'assistant', text: '...' };

export const ALL_TOOLS: Tool[] = [
  { label: 'Form Finder', icon: FaWpforms, color: '#22c55e', description: 'Quickly locate and fill out forms.' },
  { label: 'Passbook Entry', icon: FaRegSquare, color: '#3b82f6', description: 'Add or view passbook entries.' },
  { label: 'Change Address', icon: FaMapMarkerAlt, color: '#f59e42', description: 'Update your address easily.' },
  { label: 'ATM Pin Change', icon: FaUniversity, color: '#a855f7', description: 'Change your ATM PIN securely.' },
  { label: 'Aadhar Card Update', icon: FaIdCard, color: '#06b6d4', description: 'Update your Aadhar card details.' },
  { label: 'KYC Update', icon: FaUserCheck, color: '#f43f5e', description: 'Update your KYC documents.' },
];

export const TOOL_CONTENT: { [key: string]: string } = {
  'Form Finder': 'Here is information about Form Finder.',
  'Passbook Entry': 'Please provide the details for your passbook entry.',
  'Change Address': 'Hey, tell me where you want your address to be updated.',
  'ATM Pin Change': 'Let’s get started with changing your ATM PIN. Please enter your new PIN.',
  'Aadhar Card Update': 'Please provide the details you want to update on your Aadhar card.',
  'KYC Update': 'Let’s update your KYC. Please upload your latest documents.'
};