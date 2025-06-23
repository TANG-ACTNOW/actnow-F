'use client';

import { useRef } from 'react';
import { MemoResponse } from '@/types/memo';
import { useApp } from '@/contexts/AppContext';
import { getStyleById, getStyleByCode } from '@/config/styles';

interface MemoProps {
  memo: MemoResponse;
  onDragStart: (id: number, startPos: { x: number, y: number }) => void;
  onSelect: (id: number) => void;
}

export default function Memo({ memo, onDragStart, onSelect }: MemoProps) {
  const memoRef = useRef<HTMLDivElement>(null);
  const { openModal, isLoggedIn } = useApp();
  
  // 直接根据后端返回的style.code获取样式信息
  const style = getStyleByCode(memo.style.code);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (memoRef.current) {
      e.preventDefault();
      const rect = memoRef.current.getBoundingClientRect();
      const startPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      onDragStart(memo.id, startPos);
      onSelect(memo.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发拖拽
    // 根据登录状态打开相应的modal
    openModal(isLoggedIn ? 'edit-memo' : 'login', memo);
  };

  // 优先使用自定义颜色，如果没有则使用样式配置的颜色
  const backgroundColor = memo.color || (style.type === 'image' ? 'transparent' : '#FFFFFF');
  const borderColor = memo.color ? `${memo.color}40` : '#E5E7EB'; // 使用颜色的40%透明度作为边框
  const textColor = memo.color ? getContrastColor(memo.color) : style.titleColor.replace('text-', '#');

  // 根据样式类型构建样式对象
  const memoStyle = style.type === 'image' ? {
    backgroundImage: `url(${style.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {
    backgroundColor,
    borderColor,
  };

  return (
    <div
      ref={memoRef}
      data-memo-id={memo.id}
      style={{
        position: 'absolute',
        left: memo.x,
        top: memo.y,
        zIndex: memo.zindex,
        ...memoStyle
      }}
      className={`${style.size.width} ${style.size.height} p-3 rounded-lg transition-shadow hover:shadow-xl select-none relative border-2`}
      onMouseDown={handleMouseDown}
    >
      {/* 图片背景的遮罩层 */}
      {style.type === 'image' && style.overlay && (
        <div className={`absolute inset-0 rounded-lg ${style.overlay}`} />
      )}
      
      {/* 内容层，确保在遮罩层之上 */}
      <div className="relative z-10">
        <button
          onClick={handleEditClick}
          className="absolute -top-1 -right-1 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <h3 
          className="text-sm font-semibold mb-2 pr-8 font-bold break-words"
          style={{ color: textColor }}
        >
          {memo.title}
        </h3>
        <p 
          className="text-xs whitespace-pre-wrap break-words"
          style={{ color: textColor }}
        >
          {memo.content}
        </p>
      </div>
    </div>
  );
}

// 辅助函数：根据背景色计算对比色
function getContrastColor(hexColor: string): string {
  // 移除 # 号
  const hex = hexColor.replace('#', '');
  
  // 转换为RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // 根据亮度返回黑色或白色
  return brightness > 128 ? '#000000' : '#FFFFFF';
} 