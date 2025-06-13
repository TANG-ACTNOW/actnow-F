'use client';
import { useState, useRef, useEffect } from 'react';
import ModalWithSidebar from './ModalWithSidebar';

export default function FloatingButtonGroup() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // 设置初始位置
  useEffect(() => {
    if (containerRef.current && buttonRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      
      setPosition({
        x: containerRect.width - buttonRect.width - 60,
        y: containerRect.height - buttonRect.height - 60
      });
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current && buttonRef.current) {
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

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        // 计算拖动距离
        const dragDistance = Math.sqrt(
          Math.pow(e.clientX - startPosition.x, 2) + 
          Math.pow(e.clientY - startPosition.y, 2)
        );
        
        // 如果拖动距离小于5像素，认为是点击
        if (dragDistance < 5) {
          setIsModalOpen(true);
        }
      }
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
  }, [isDragging, dragOffset, startPosition]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      // 记录开始拖动的位置
      setStartPosition({
        x: e.clientX,
        y: e.clientY
      });
      setIsDragging(true);
    }
  };

  return (
    <>
      <div 
        ref={containerRef}
        className="fixed inset-0 pointer-events-none"
      >
        <div 
          ref={buttonRef}
          onMouseDown={handleMouseDown}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          className="absolute select-none pointer-events-auto"
        >
          <button
            className="w-14 h-14 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>
      </div>
      <ModalWithSidebar open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
} 