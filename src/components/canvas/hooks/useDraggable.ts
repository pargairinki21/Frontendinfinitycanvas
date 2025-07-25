// src/components/canvas/hooks/useDraggable.ts
import { useState, useRef, useEffect, useCallback } from 'react';

type Coords = { x: number; y: number };

interface UseDraggableProps {
  initialPosition: Coords;
  onDragEnd?: (newPosition: Coords) => void;
  isPanMode: boolean; // From usePanZoom to disable dragging when in pan mode
  panOffset: Coords; // Current pan offset from usePanZoom
  scale: number; // Current scale from usePanZoom
}

export function useDraggable({ initialPosition, onDragEnd, isPanMode, panOffset, scale }: UseDraggableProps) {
  const [position, setPosition] = useState<Coords>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef<Coords>({ x: 0, y: 0 }); // Offset from mouse down to element origin

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanMode) return; // Prevent dragging if in pan mode

    e.stopPropagation(); // Stop event from bubbling up to the canvas pan listener
    e.preventDefault(); // Prevent default browser drag behavior

    setIsDragging(true);

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const currentAbsoluteX = rect.left + window.scrollX;
    const currentAbsoluteY = rect.top + window.scrollY;

    // Calculate offset relative to the *scaled and panned* canvas
    // We need to inverse the pan and scale to get the element's position
    // relative to the "unpanned" canvas origin (0,0)
    const elementXOnUnpannedCanvas = (currentAbsoluteX - (window.innerWidth / 2 + panOffset.x)) / scale;
    const elementYOnUnpannedCanvas = (currentAbsoluteY - (window.innerHeight / 2 + panOffset.y)) / scale;


    offset.current = {
      x: e.clientX - currentAbsoluteX,
      y: e.clientY - currentAbsoluteY,
    };

    // Store the position relative to the canvas origin (0,0) *before* dragging starts
    // This is the position that will be updated.
    // We're calculating where the element's top-left corner is on the virtual canvas.
    const parentRect = e.currentTarget.offsetParent?.getBoundingClientRect(); // Get the "panned layer" rect
    if (parentRect) {
        // Adjust for the parent's current transform and get its position relative to the parent's content box
        // This is complex, so let's simplify for now:
        // Assume position stores the 'absolute' coordinates relative to the panned layer's top-left.
        // The dragging logic will then update these absolute coordinates.
        // A simpler way: we will store the position of the item relative to the pan-zoom layer's origin (0,0)
        // This means, the x,y passed to setPosition are already adjusted for pan/zoom
    }

  }, [isPanMode, panOffset, scale]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    // Calculate the new absolute position of the element's top-left corner
    const newAbsoluteX = e.clientX - offset.current.x;
    const newAbsoluteY = e.clientY - offset.current.y;

    // We need to convert this back to the coordinates within the pan-zoom layer.
    // The pan-zoom layer is centered, so its "logical" 0,0 is at the screen center before pan/zoom.
    // Its actual top-left on screen is (window.innerWidth / 2 + panOffset.x, window.innerHeight / 2 + panOffset.y)
    // The items inside are positioned relative to this transformed layer.

    // Calculate mouse position relative to the *untransformed* center of the canvas
    const mouseXOnUnpannedCanvas = (e.clientX - (window.innerWidth / 2 + panOffset.x)) / scale;
    const mouseYOnUnpannedCanvas = (e.clientY - (window.innerHeight / 2 + panOffset.y)) / scale;

    // Calculate new position of the element relative to the unpanned canvas origin
    // This means the position we store is relative to the logical center of the canvas
    const newElementX = mouseXOnUnpannedCanvas - (offset.current.x / scale);
    const newElementY = mouseYOnUnpannedCanvas - (offset.current.y / scale);

    setPosition({ x: newElementX, y: newElementY });

  }, [isDragging, panOffset, scale]);


  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd(position);
    }
  }, [isDragging, onDragEnd, position]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Update position if initialPosition changes (e.g., on reset)
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  return { position, isDragging, handleMouseDown };
}