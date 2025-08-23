import { useState, useEffect, useRef, useCallback } from 'react';
import { Tool, ChatMessage, Node } from '../../shared/types';
import { TOOL_CONTENT, TYPING_MSG } from '../../shared/constants';
import { executePrompt, processAudio, testChatEndpoint } from '../../../services/apiService';
import { ALL_TOOLS } from '../../shared/constants';

type FlyingItemState = { tool: Tool, from: DOMRect } | null;

export function useToolInteractions(
  chatRef: React.RefObject<HTMLDivElement>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setChatTyping: React.Dispatch<React.SetStateAction<boolean>>,
  initialNodes: Node[],
  setShowOutputPanel?: React.Dispatch<React.SetStateAction<boolean>>,
  setOutputMessages?: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setOutputTyping?: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentPdfUrl?: React.Dispatch<React.SetStateAction<string | null>>,
  setBackendMessage?: React.Dispatch<React.SetStateAction<string | null>>
) {
  const [notchTools, setNotchTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [flyingIcon, setFlyingIcon] = useState<FlyingItemState>(null);
  const [flyingCard, setFlyingCard] = useState<FlyingItemState>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [shadowColor, setShadowColor] = useState<string | null>(null);

  const lastDraggedToolLabelRef = useRef<string>('');

  const handleToolDrop = useCallback((tool: Tool) => {
    setNotchTools(prev => {
      if (!prev.some(t => t.label === tool.label)) {
        return [...prev, tool];
      }
      return prev;
    });
    setSelectedTool(tool);

    setChatMessages([{ id: Date.now(), sender: 'assistant', text: TYPING_MSG.text }]);
    setChatTyping(true);
    setTimeout(() => {
      setChatMessages([
        { id: Date.now(), sender: 'assistant', text: TOOL_CONTENT[tool.label] }
      ]);
      setChatTyping(false);
    }, 1500);

    setNodes(n => n.filter(node => node.label !== tool.label));
  }, [setChatMessages, setChatTyping]);

  const handleRemoveNotchTool = useCallback((toolToRemove: Tool) => {
    setNotchTools(prev => {
      const updatedTools = prev.filter(t => t.label !== toolToRemove.label);
      if (selectedTool?.label === toolToRemove.label) {
        const nextSelected = updatedTools.length > 0 ? updatedTools[0] : null;
        setSelectedTool(nextSelected);
        setChatMessages(nextSelected 
          ? [{ id: Date.now(), sender: 'assistant', text: TOOL_CONTENT[nextSelected.label] }] 
          : [{ id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' }]
        );
      }
      return updatedTools;
    });
  }, [selectedTool, setChatMessages]);

  const handleSelectNotchTool = useCallback((tool: Tool) => {
    setSelectedTool(tool);
    setChatMessages([{ id: Date.now(), sender: 'assistant', text: TOOL_CONTENT[tool.label] }]);
  }, [setChatMessages]);

  const handleAskSomething = useCallback(async (input: string) => {
    if (!input.trim()) return;
    console.log("button clicked");
    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text: input };
    const inputLower = input.trim().toLowerCase();
    
    // Check if it's a peripheral command
    const isPeripheralCommand = inputLower.includes('volume') || inputLower.includes('brightness') || 
                               inputLower.includes('camera') || inputLower.includes('picture') ||
                               inputLower.includes('mute') || inputLower.includes('unmute');
    
    // Check if it's a form command
    const isFormCommand = inputLower.includes('hdfc') || inputLower.includes('hdfc form') || 
                         inputLower.includes('axis') || inputLower.includes('axis form') ||
                         inputLower.includes('loan') || inputLower.includes('form');
    
    if (isFormCommand) {
      if (setShowOutputPanel && setOutputMessages && setOutputTyping) {
        setShowOutputPanel(true);
        setOutputTyping(true);
        
        const userMessage: ChatMessage = { id: Date.now(), sender: 'user', text: input };
        setOutputMessages([userMessage]);
        
        try {
          // Display API call info in UI
          const apiCallMessage: ChatMessage = {
            id: Date.now() + 0.1,
            sender: 'assistant',
            text: `🎤 Calling process_audio API for form request: "${input}"`
          };
          setOutputMessages(prev => [...prev, apiCallMessage]);

          console.log('🎤 Calling process_audio API for request:', input);
          const result = await processAudio(input);
          console.log('🎤 API result:', result);
          console.log('🎤 Peripheral result:', result.peripheral_result);

          // Display API result in UI
          const apiResultMessage: ChatMessage = {
            id: Date.now() + 0.2,
            sender: 'assistant',
            text: `🎤 API result: ${JSON.stringify(result, null, 2)}`
          };
          setOutputMessages(prev => [...prev, apiResultMessage]);

          // ✅ normalize PDF link (backend may send pdf_path OR pdf_url)
          const rawPdfUrl = result.pdf_path || result.pdf_url || null;
          if (result.success && rawPdfUrl) {
            // Don't replace 127.0.0.1 with localhost - keep original URL
            const fixedUrl = rawPdfUrl.startsWith("http") ? rawPdfUrl : `http://127.0.0.1:8001${rawPdfUrl}`;
            console.log("📄 Final PDF URL:", fixedUrl);

            // Display PDF URL info in UI
            const pdfUrlMessage: ChatMessage = {
              id: Date.now() + 0.3,
              sender: 'assistant',
              text: `📄 Final PDF URL: ${fixedUrl}`
            };
            setOutputMessages(prev => [...prev, pdfUrlMessage]);

            if (setCurrentPdfUrl) {
              setCurrentPdfUrl(fixedUrl);
            }

            // Set backend message for display in OutputChatPanel
            if (setBackendMessage && result.message) {
              setBackendMessage(result.message);
            }

            const assistantMessage: ChatMessage = {
              id: Date.now() + 1,
              sender: 'assistant',
              text: result.message || 'Form loaded successfully'
            };
            setOutputMessages(prev => [...prev, assistantMessage]);

            // Don't add PDF URL as a chat message - it will be displayed in the PDF viewer
          } else if (result.success && result.message) {
            // Set backend message for display in OutputChatPanel
            if (setBackendMessage) {
              setBackendMessage(result.message);
            }

            const assistantMessage: ChatMessage = {
              id: Date.now() + 1,
              sender: 'assistant',
              text: result.message
            };
            setOutputMessages(prev => [...prev, assistantMessage]);
          } else {
            const errorMessage: ChatMessage = {
              id: Date.now() + 1,
              sender: 'assistant',
              text: `Error: ${result.error || 'Form not found'}`
            };
            setOutputMessages(prev => [...prev, errorMessage]);
          }
        } catch (error) {
          console.error('❌ Error calling process_audio API:', error);
          const errorMessage: ChatMessage = {
            id: Date.now() + 1,
            sender: 'assistant',
            text: 'Failed to connect to backend. Please check if your server is running.'
          };
          setOutputMessages(prev => [...prev, errorMessage]);
        } finally {
          setOutputTyping(false);
        }
      }

      setChatMessages(m => [...m, userMsg, { 
        id: Date.now() + 1, 
        sender: 'assistant', 
        text: 'Processing form request...' 
      }]);
      setChatTyping(false);
      return;
    }
    
    // Handle peripheral commands in ChatPanel
    if (isPeripheralCommand) {
      setChatMessages(m => [...m, userMsg]);
      setChatTyping(true);
      
      try {
        console.log('🎛️ Processing peripheral command:', input);
        const result = await processAudio(input);
        console.log('🎛️ Peripheral result:', result);
        
        let responseText = 'Command processed';
        if (result.success && result.message) {
          responseText = result.message;
        } else if (result.peripheral_result && result.peripheral_result.message) {
          responseText = result.peripheral_result.message;
        } else if (result.error) {
          responseText = `Error: ${result.error}`;
        }
        
        const assistantMessage: ChatMessage = {
          id: Date.now() + 1,
          sender: 'assistant',
          text: responseText
        };
        
        setChatMessages(m => [
          ...m.filter(msg => msg.id !== 'typing'),
          assistantMessage
        ]);
        setChatTyping(false);
        return;
        
      } catch (error) {
        console.error('❌ Error processing peripheral command:', error);
        const errorMessage: ChatMessage = {
          id: Date.now() + 1,
          sender: 'assistant',
          text: 'Failed to process peripheral command. Please try again.'
        };
        setChatMessages(m => [
          ...m.filter(msg => msg.id !== 'typing'),
          errorMessage
        ]);
        setChatTyping(false);
        return;
      }
    }

    setChatMessages(m => [...m, userMsg, TYPING_MSG]);
    setChatTyping(true);

    const foundTool = Object.entries(TOOL_CONTENT).find(([label]) => 
      inputLower.includes(label.toLowerCase())
    );

    let assistantResponseText = '';

    if (foundTool) {
      const [toolLabel, content] = foundTool;
      assistantResponseText = content;
      const toolInfo = ALL_TOOLS.find(t => t.label === toolLabel);
      if (toolInfo) {
        setNotchTools(prev => prev.some(t => t.label === toolLabel) ? prev : [...prev, toolInfo]);
        setSelectedTool(toolInfo);
      }
    } else {
      try {
        // Use the same /chat endpoint for all requests
        const result = await processAudio(input);
        
        if (result.success && result.message) {
          assistantResponseText = result.message;
        } else {
          assistantResponseText = result.error || 'An unknown error occurred.';
        }
      } catch (error) {
        console.error('API call in handleAskSomething failed:', error);
        assistantResponseText = 'Sorry, I am having trouble connecting right now. Please try again later.';
      }
    }

    setChatMessages(m => [
      ...m.filter(msg => msg.id !== 'typing'),
      { id: Date.now() + 1, sender: 'assistant', text: assistantResponseText }
    ]);
    setChatTyping(false);
  }, [setChatMessages, setChatTyping, setNotchTools, setSelectedTool, setShowOutputPanel, setOutputMessages, setOutputTyping, setCurrentPdfUrl]);

  useEffect(() => {
    const handleDragMove = (e: MouseEvent) => {
      if (!lastDraggedToolLabelRef.current) {
        setShadowColor(null);
        return;
      }
      if (!chatRef.current) return;
      const r = chatRef.current.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;

      const draggedTool = ALL_TOOLS.find(t => t.label === lastDraggedToolLabelRef.current);
      setShadowColor(inside && draggedTool ? draggedTool.color : null);
    };

    window.addEventListener('mousemove', handleDragMove);
    return () => window.removeEventListener('mousemove', handleDragMove);
  }, [chatRef]);

  useEffect(() => {
    if (shadowColor === null && lastDraggedToolLabelRef.current) {
      const droppedToolLabel = lastDraggedToolLabelRef.current;
      const toolInfo = ALL_TOOLS.find(t => t.label === droppedToolLabel);
      if (toolInfo && chatRef.current) {
        const r = chatRef.current.getBoundingClientRect();
        const droppedInsideChat = (
          window.innerWidth / 2 - 200 <= r.right &&
          window.innerWidth / 2 + 200 >= r.left &&
          window.innerHeight / 2 - 200 <= r.bottom &&
          window.innerHeight / 2 + 200 >= r.top
        );

        if (droppedInsideChat) {
          handleToolDrop(toolInfo);
        }
      }
      lastDraggedToolLabelRef.current = '';
    }
  }, [shadowColor, chatRef, handleToolDrop]);

  const handleNodeDragStart = useCallback((toolLabel: string, rect: DOMRect) => {
    lastDraggedToolLabelRef.current = toolLabel;
    const tool = ALL_TOOLS.find(t => t.label === toolLabel);
    if (tool) {
      setFlyingIcon({ tool, from: rect });
    }
  }, []);

  const resetCanvas = useCallback(() => {
    setNodes(initialNodes);
    setNotchTools([]);
    setSelectedTool(null);
    setChatMessages([{ id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' }]);
    setChatTyping(false);
    lastDraggedToolLabelRef.current = '';
  }, [initialNodes, setChatMessages, setChatTyping]);

  return {
  notchTools,
  selectedTool,
  flyingIcon,
  flyingCard,
  shadowColor,
  setNodes,
  setFlyingIcon,
  setFlyingCard,
  handleToolDrop,
  handleRemoveNotchTool,
  handleSelectNotchTool,
  handleAskSomething,
  handleNodeDragStart,
  resetCanvas,
};
}
