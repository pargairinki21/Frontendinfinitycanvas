import { useState, useEffect, useCallback } from 'react';

type Position = { x: number; y: number };

export function usePanZoom(initialPos: Position = { x: 0, y: 0 }, initialScale: number = 1) {
  const [pos, setPos] = useState<Position>(initialPos);
  const [scale, setScale] = useState<number>(initialScale);
  const [dragging, setDragging] = useState<boolean>(false);
  const [startDrag, setStartDrag] = useState<Position | null>(null);
  const [isPanMode, setIsPanMode] = useState<boolean>(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Only pan if pan mode is active or if the target is not draggable
    if (!isPanMode && (e.target as HTMLElement).dataset.draggable === 'true') return;
    setDragging(true);
    setStartDrag({ x: e.clientX, y: e.clientY });
  }, [isPanMode]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !startDrag) return;
    const dx = e.clientX - startDrag.x;
    const dy = e.clientY - startDrag.y;
    setStartDrag({ x: e.clientX, y: e.clientY });
    setPos(p => ({ x: p.x + dx, y: p.y + dy }));
  }, [dragging, startDrag]);

  const onMouseUp = useCallback(() => {
    setDragging(false);
    setStartDrag(null);
  }, []);

  const onWheel = useCallback((e: WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault(); // Prevent page scrolling
    setScale(s => Math.min(Math.max(s - e.deltaY * 0.001, 0.5), 2));
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('wheel', onWheel);
    };
  }, [onMouseMove, onMouseUp, onWheel]);

  const snapTo = useCallback((x: number, y: number) => {
    setPos({ x, y });
  }, []);

  return {
    pos,
    scale,
    dragging,
    isPanMode,
    setPos,
    setScale,
    setIsPanMode,
    onMouseDown,
    snapTo,
  };
}