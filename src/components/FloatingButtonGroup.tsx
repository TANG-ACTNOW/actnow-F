'use client';
import { useState, useRef, useEffect } from 'react';
import Setting from '@/components/buttons/Setting';
import Create from '@/components/buttons/Create';
import { MemoResponse } from '@/types/memo';
import { ModalManager } from '@/components/modals/ModalManager';
import { useApp } from '@/contexts/AppContext';

interface FloatingButtonGroupProps {
  onMemoCreate: (memo: MemoResponse) => void;
  isModalOpen: boolean;
  onModalOpenChange?: (isOpen: boolean) => void;
}

export default function FloatingButtonGroup({ onMemoCreate, isModalOpen, onModalOpenChange }: FloatingButtonGroupProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { openModal, isLoggedIn } = useApp();

  // 设置初始位置
  useEffect(() => {
    if (containerRef.current && buttonRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      
      setPosition({
        x: containerRect.width - buttonRect.width - 60,
        y: containerRect.height - buttonRect.height - 60
      });
      // 设置位置后再显示
      setIsVisible(true);
    }
  }, []);

  // 监听窗口大小变化，更新位置
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && buttonRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const buttonRect = buttonRef.current.getBoundingClientRect();
        
        setPosition({
          x: Math.min(position.x, containerRect.width - buttonRect.width - 60),
          y: Math.min(position.y, containerRect.height - buttonRect.height - 60)
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isModalOpen && containerRef.current && buttonRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const buttonRect = buttonRef.current.getBoundingClientRect();
        
        // 计算相对于容器的位置
        const x = e.clientX - containerRect.left - dragOffset.x;
        const y = e.clientY - containerRect.top - dragOffset.y;
        
        // 限制在容器范围内，并保持60px的边距
        const maxX = containerRect.width - buttonRect.width - 60;
        const maxY = containerRect.height - buttonRect.height - 60;
        
        setPosition({
          x: Math.min(Math.max(60, x), maxX),
          y: Math.min(Math.max(60, y), maxY)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isModalOpen]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isModalOpen) return; // 如果 Modal 打开，不处理拖动
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setStartPosition({
        x: e.clientX,
        y: e.clientY
      });
      setIsDragging(true);
    }
  };

  // 删除memo的逻辑
  const handleDeleteMemo = async (memoId: number) => {
    try {
      // 调用后端删除接口
      await fetch(`http://localhost:8080/api/memos/${memoId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      // TODO: 这里可以加刷新列表的逻辑，比如调用props的刷新方法或全局context刷新
      window.location.reload(); // 简单粗暴刷新页面
    } catch (err) {
      alert('删除失败');
    }
  };

  // 处理通知按钮点击
  const handleNotificationClick = () => {
    // 根据登录状态打开相应的modal
    openModal(isLoggedIn ? 'setting' : 'login');
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    >
      <div 
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: 'default',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.1s ease-in-out',
          zIndex: 9999
        }}
        className="absolute select-none pointer-events-auto flex flex-col gap-4 p-4 rounded-2xl bg-[#F5F5DC] shadow-lg"
      >
        <Create />
        <button 
          onClick={handleNotificationClick}
          className="w-14 h-14 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition-all duration-300 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <Setting onModalOpenChange={onModalOpenChange} />
      </div>
      <ModalManager onModalOpenChange={onModalOpenChange || (()=>{})} />
    </div>
  );
} 