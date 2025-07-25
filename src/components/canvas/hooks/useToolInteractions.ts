import { useState, useEffect, useRef, useCallback } from 'react';
import { Tool, ChatMessage, Node } from '../../shared/types';
import { TOOL_CONTENT, TYPING_MSG } from '../../shared/constants';
import { executePrompt } from '../../../services/apiService'; // Import the API service
// Assuming ALL_TOOLS is imported or defined elsewhere in your file.
// If not, you'll need to define or import it. For example:
import { ALL_TOOLS } from '../../shared/constants'; // Adjust path if necessary

type FlyingItemState = { tool: Tool, from: DOMRect } | null;

export function useToolInteractions(
  chatRef: React.RefObject<HTMLDivElement>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setChatTyping: React.Dispatch<React.SetStateAction<boolean>>,
  initialNodes: Node[]
) {
  const [notchTools, setNotchTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [flyingIcon, setFlyingIcon] = useState<FlyingItemState>(null);
  const [flyingCard, setFlyingCard] = useState<FlyingItemState>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [shadowColor, setShadowColor] = useState<string | null>(null);

  // This ref is crucial for holding the label of the tool being dragged before it's officially dropped
  const lastDraggedToolLabelRef = useRef<string>('');

  const handleToolDrop = useCallback((tool: Tool) => {
    setNotchTools(prev => {
      // Ensure no duplicates in notchTools
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

    // Remove the node from the canvas after it's "dropped" into the notch
    setNodes(n => n.filter(node => node.label !== tool.label));
  }, [setChatMessages, setChatTyping]);

  const handleRemoveNotchTool = useCallback((toolToRemove: Tool) => {
    setNotchTools(prev => {
      const updatedTools = prev.filter(t => t.label !== toolToRemove.label);
      if (selectedTool?.label === toolToRemove.label) {
        // If the removed tool was selected, select the next available or none
        const nextSelected = updatedTools.length > 0 ? updatedTools[0] : null;
        setSelectedTool(nextSelected);
        setChatMessages(nextSelected ? [{ id: Date.now(), sender: 'assistant', text: TOOL_CONTENT[nextSelected.label] }] : [{ id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' }]);
      }
      return updatedTools;
    });
  }, [selectedTool, setChatMessages]);

  const handleSelectNotchTool = useCallback((tool: Tool) => {
    setSelectedTool(tool);
    setChatMessages([{ id: Date.now(), sender: 'assistant', text: TOOL_CONTENT[tool.label] }]);
  }, [setChatMessages]);

  const handleAskSomething = useCallback(async (input: string) => { // Made async
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text: input };
    // Add user message and typing indicator immediately
    setChatMessages(m => [...m, userMsg, TYPING_MSG]);
    setChatTyping(true); // Ensure typing is true for the API call duration

    const inputLower = input.trim().toLowerCase();
    const foundTool = Object.entries(TOOL_CONTENT).find(([label]) => inputLower.includes(label.toLowerCase()));

    let assistantResponseText = ''; // Initialize assistant response

    if (foundTool) {
      const [toolLabel, content] = foundTool;
      assistantResponseText = content; // Use local content for tools
      const toolInfo = ALL_TOOLS.find(t => t.label === toolLabel);
      if (toolInfo) {
        setNotchTools(prev => prev.some(t => t.label === toolLabel) ? prev : [...prev, toolInfo]);
        setSelectedTool(toolInfo);
      }
    } else {
      // If no tool is found, make the API call
      try {
        const cloudId = 1; // Hardcoded cloudId
        const apiResponse = await executePrompt(input, cloudId);

        // Process API response
        if (Array.isArray(apiResponse) && apiResponse.length > 0) {
          assistantResponseText = apiResponse.join('\n');
        } else if (typeof apiResponse === 'string') {
          assistantResponseText = apiResponse;
        } else if (apiResponse && typeof apiResponse === 'object' && apiResponse.text) {
            assistantResponseText = apiResponse.text;
        } else {
          assistantResponseText = 'An unknown error occurred or no relevant response was returned from the AI.';
        }
      } catch (error) {
        console.error('API call in handleAskSomething failed:', error);
        assistantResponseText = 'Sorry, I am having trouble connecting right now. Please try again later.';
      }
    }

    // After determining the response (either from TOOL_CONTENT or API),
    // update chat messages and turn off typing indicator.
    setChatMessages(m => [
      ...m.filter(msg => msg.id !== 'typing'), // Remove the typing indicator message
      { id: Date.now() + 1, sender: 'assistant', text: assistantResponseText }
    ]);
    setChatTyping(false); // Turn off typing after response
  }, [setChatMessages, setChatTyping, setNotchTools, setSelectedTool]); // Add dependencies

  // Handle hover highlight for ChatPanel (when a tool is dragged)
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

  // Reset tool state when a drag operation ends
  // This effect listens for when shadowColor becomes null AND a tool was previously dragged,
  // indicating a drop has occurred or the drag was cancelled outside the chat area.
  // We need to ensure `lastDraggedToolLabelRef` is used here to avoid race conditions
  // if `dragTool` state was managed separately.
  useEffect(() => {
    if (shadowColor === null && lastDraggedToolLabelRef.current) {
      const droppedToolLabel = lastDraggedToolLabelRef.current;
      const toolInfo = ALL_TOOLS.find(t => t.label === droppedToolLabel);
      if (toolInfo && chatRef.current) {
        const r = chatRef.current.getBoundingClientRect();
        // Check if the drop happened inside the chat panel (approximation)
        // This is a simplified check, a more robust solution might involve actual drag events
        // and knowing the exact drop coordinates.
        const droppedInsideChat = (
          window.innerWidth / 2 - 200 <= r.right &&
          window.innerWidth / 2 + 200 >= r.left &&
          window.innerHeight / 2 - 200 <= r.bottom &&
          window.innerHeight / 2 + 200 >= r.top // Approximate chat panel area
        );

        if (droppedInsideChat) {
          handleToolDrop(toolInfo);
        }
      }
      lastDraggedToolLabelRef.current = ''; // Reset the ref after processing
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
    lastDraggedToolLabelRef.current = ''; // Clear any lingering drag state
  }, [initialNodes, setChatMessages, setChatTyping]);


  return {
    nodes,
    notchTools,
    selectedTool,
    flyingIcon,
    flyingCard,
    shadowColor,
    setNodes,
    setFlyingIcon,
    setFlyingCard,
    handleToolDrop, // Can be used directly if drop target is known
    handleRemoveNotchTool,
    handleSelectNotchTool,
    handleAskSomething,
    handleNodeDragStart,
    resetCanvas,
  };
}