'use client';
import { useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';

interface SettingProps {
  onModalOpenChange?: (isOpen: boolean) => void;
}

export default function Setting({ onModalOpenChange }: SettingProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startPosition = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isLoggedIn, openModal, fetchUserInfo } = useApp();

  const handleMouseDown = (e: React.MouseEvent) => {
    startPosition.current = { x: e.screenX, y: e.screenY };
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = e.screenX - startPosition.current.x;
    const dy = e.screenY - startPosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = async (e: React.MouseEvent) => {
    const dx = e.screenX - startPosition.current.x;
    const dy = e.screenY - startPosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (!isDragging && distance <= 5) {
      // 根据登录状态打开相应的modal
      openModal(isLoggedIn ? 'setting' : 'login');
      onModalOpenChange?.(true);
    }
    setIsDragging(false);
  };

  return (
    <button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
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
  );
} 