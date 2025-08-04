import { useState, useCallback, useEffect } from 'react';

export type ChatMode = 'static' | 'dynamic' | 'canvas-layer';

interface UseDynamicChatReturn {
  mode: ChatMode;
  toggleMode: () => void;
  setMode: (mode: ChatMode) => void;
}

export function useDynamicChat(defaultMode: ChatMode = 'canvas-layer'): UseDynamicChatReturn {
  const [mode, setModeState] = useState<ChatMode>(() => {
    // Try to get saved mode from localStorage
    const saved = localStorage.getItem('chat-mode');
    return (saved as ChatMode) || defaultMode;
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chat-mode', mode);
  }, [mode]);

  const setMode = useCallback((newMode: ChatMode) => {
    setModeState(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState(current => {
      const modes: ChatMode[] = ['static', 'dynamic', 'canvas-layer'];
      const currentIndex = modes.indexOf(current);
      const nextIndex = (currentIndex + 1) % modes.length;
      return modes[nextIndex];
    });
  }, []);

  return {
    mode,
    toggleMode,
    setMode,
  };
} 