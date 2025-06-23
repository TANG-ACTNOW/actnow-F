'use client';
import { useState, useRef } from 'react';

interface DeleteProps {
  onDelete?: (memoId: number) => void;
}

export default function Delete({ onDelete }: DeleteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const startPosition = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // 记录鼠标按下时的屏幕坐标
    startPosition.current = { x: e.screenX, y: e.screenY };
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // 使用屏幕坐标计算移动距离
    const dx = e.screenX - startPosition.current.x;
    const dy = e.screenY - startPosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 如果移动距离超过5像素，就认为是拖动
    if (distance > 5) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // 使用屏幕坐标计算移动距离
    const dx = e.screenX - startPosition.current.x;
    const dy = e.screenY - startPosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 只有当不是拖动状态时才触发点击事件
    if (!isDragging && distance <= 5) {
      console.log('Delete button clicked');
    }
    setIsDragging(false);
  };

  // 拖拽相关事件处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const memoId = e.dataTransfer.getData('memoId');
    if (memoId) {
      const id = parseInt(memoId);
      if (!isNaN(id)) {
        console.log('Deleting memo with ID:', id);
        onDelete?.(id);
      }
    }
  };

  return (
    <button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
        isDragOver 
          ? 'bg-red-700 text-white scale-110' 
          : 'bg-red-500 text-white hover:bg-red-600'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
} 