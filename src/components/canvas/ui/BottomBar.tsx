import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaUndo, FaRegHandPaper } from 'react-icons/fa';

type BottomBarProps = {
  onAskSubmit: (input: string) => void;
  askInputValue: string;
  onAskInputChange: (value: string) => void;
  onSnapToHome: () => void;
  onSnapUp: () => void;
  onSnapRight: () => void;
  onSnapDown: () => void;
  onSnapLeft: () => void;
  onResetCanvas: () => void;
  isPanMode: boolean;
  onTogglePanMode: () => void;
};

export function BottomBar({
  onAskSubmit,
  askInputValue,
  onAskInputChange,
  onSnapToHome,
  onSnapUp,
  onSnapRight,
  onSnapDown,
  onSnapLeft,
  onResetCanvas,
  isPanMode,
  onTogglePanMode,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div
        className="relative w-full flex flex-col items-center justify-center gap-2 px-8 z-10  bg-[#ffffff60] rounded-tl-2xl rounded-tr-2xl pt-2 pb-3"
        style={{
          // background: 'rgba(255,255,255,0.22)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          // border: '1px solid rgba(255,255,255,0.3)',
          // boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1), inset 0 0 52px 26px rgba(255,255,255,0.26)'
        }}
      >
        {/* semicircular notch with home button inside */}
        <div className="absolute left-1/2 -top-12 -translate-x-1/2 w-20 h-12 bg-[#ffffff60] rounded-t-full  flex items-center justify-center z-0 overflow-hidden">
          {/* Glass effect for bottom bar notch */}
          <div
            className="absolute inset-0 w-full h-full rounded-t-full pointer-events-none"
            style={{
              // background: 'rgba(255,255,255,0.22)',
              // backdropFilter: 'blur(19px)',
              // WebkitBackdropFilter: 'blur(19px)',
              // border: '1px solid rgba(255,255,255,0.3)',
              // boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1), inset 0 0 52px 26px rgba(255,255,255,0.26)'
            }}
          />
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: '#ede9fe' }}
            whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={onSnapToHome}
            className="w-16 h-8 bg-white rounded-t-full border-2 border-purple-400 flex items-center justify-center text-purple-700 shadow shadow-black/40"
            style={{ outline: 'none', border: 'none' }}
          >
            {/* Home button, no icon */}
          </motion.button>
        </div>
        {/* Ask Something box */}
        <form className="flex justify-start ml-0" onSubmit={e => {
          e.preventDefault();
          onAskSubmit(askInputValue);
        }}>
          <input
            type="text"
            placeholder="Ask Something..."
            className="w-[320px] max-w-full px-4 py-2 rounded-full border border-gray-300 shadow bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={askInputValue}
            onChange={e => onAskInputChange(e.target.value)}
          />
        </form>
        {/* Directional and undo buttons */}
        <div className="flex items-center justify-end gap-3 ml-4">
          <motion.button
            whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
            whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={onSnapUp}
            className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-purple-400 shadow !opacity-100"
            style={{ outline: 'none', border: 'none' }}
          >
            <FaArrowUp />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
            whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={onSnapRight}
            className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-purple-400 shadow !opacity-100"
            style={{ outline: 'none', border: 'none' }}
          >
            <FaArrowUp style={{ transform: 'rotate(90deg)' }} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
            whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={onSnapDown}
            className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-purple-400 shadow !opacity-100"
            style={{ outline: 'none', border: 'none' }}
          >
            <FaArrowDown />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
            whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={onSnapLeft}
            className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-purple-400 shadow !opacity-100"
            style={{ outline: 'none', border: 'none' }}
          >
            <FaArrowDown style={{ transform: 'rotate(90deg)' }} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
            whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={onResetCanvas}
            className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-purple-400 shadow !opacity-100"
            style={{ outline: 'none', border: 'none' }}
          >
            <FaUndo />
          </motion.button>
          {/* Hand icon for infinite canvas navigation */}
          <motion.button
            whileHover={{ scale: 1.2, backgroundColor: '#ede9fe' }}
            whileTap={{ scale: 0.95, backgroundColor: '#c4b5fd' }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={onTogglePanMode}
            className={`w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center shadow !opacity-100 ${isPanMode ? 'text-purple-700 ring-2 ring-purple-400' : 'text-purple-400'}`}
            style={{ outline: 'none', border: 'none' }}
            title="Pan Mode"
          >
            <FaRegHandPaper />
          </motion.button>
        </div>
      </div>
    </div>
  );
}