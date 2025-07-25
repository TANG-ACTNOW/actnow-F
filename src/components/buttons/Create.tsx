'use client';
import { useState, useRef } from 'react';
import { MemoResponse } from '@/types/memo';
import { useApp } from '@/contexts/AppContext';

export default function Create() {
  const [isDragging, setIsDragging] = useState(false);
  const startPosition = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { openModal, isLoggedIn } = useApp();

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
      // 根据登录状态打开相应的modal
      openModal(isLoggedIn ? 'create-memo' : 'login');
    }
    setIsDragging(false);
  };

  return (
    <button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  );
} 