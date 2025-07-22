import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWpforms, FaRegSquare, FaMapMarkerAlt, FaUniversity, FaIdCard, FaUserCheck } from 'react-icons/fa';

const ALL_TOOLS = [
  { label: 'Form Finder', icon: FaWpforms, color: '#22c55e', description: 'Quickly locate and fill out forms.' },
  { label: 'Passbook Entry', icon: FaRegSquare, color: '#3b82f6', description: 'Add or view passbook entries.' },
  { label: 'Change Address', icon: FaMapMarkerAlt, color: '#f59e42', description: 'Update your address easily.' },
  { label: 'ATM Pin Change', icon: FaUniversity, color: '#a855f7', description: 'Change your ATM PIN securely.' },
  { label: 'Aadhar Card Update', icon: FaIdCard, color: '#06b6d4', description: 'Update your Aadhar card details.' },
  { label: 'KYC Update', icon: FaUserCheck, color: '#f43f5e', description: 'Update your KYC documents.' },
];

export default function ToolBoard({ onToolClick, notchTools = [] }) {
  const visibleTools = ALL_TOOLS.filter(tool => !notchTools.some(nt => nt.label === tool.label));

  return (
    <div className="w-[400px] h-[400px] bg-white/80 rounded-3xl shadow-2xl border border-gray-300 flex flex-col items-stretch overflow-hidden relative">
      <div className="flex items-center gap-2 px-6 py-3 bg-white/90 border-b border-gray-200 rounded-t-3xl shadow-sm sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">Catoids <span className="w-2 h-2 bg-orange-400 rounded-full inline-block"></span></h2>
      </div>
      <div className="flex-1 p-4 overflow-hidden">
        <div className="grid grid-cols-2 grid-rows-3 gap-4 h-full">
          <AnimatePresence>
            {visibleTools.map(tool => (
              <motion.div
                key={tool.label}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="w-full h-24 bg-white/90 rounded-xl shadow border border-gray-100 flex flex-col items-start p-2 gap-1 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                onClick={(e) => {
                  if (onToolClick) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    onToolClick(tool, rect);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2 mb-1 w-full">
                  <tool.icon size={18} color={tool.color} />
                  <span className="font-semibold text-sm text-gray-700 truncate w-[100px]">{tool.label}</span>
                </div>
                <div className="text-gray-500 text-xs flex-1 w-full truncate">{tool.description}</div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-auto">
                  <div className="h-1 bg-gray-300 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 