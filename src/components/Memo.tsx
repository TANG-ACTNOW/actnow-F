'use client';

import { useRef } from 'react';
import { MemoResponse } from '@/types/memo';

interface MemoProps {
  memo: MemoResponse;
  onDragStart: (id: number, startPos: { x: number, y: number }) => void;
  onSelect: (id: number) => void;
}

export default function Memo({ memo, onDragStart, onSelect }: MemoProps) {
  const memoRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={memoRef}
      data-memo-id={memo.id}
      style={{
        position: 'absolute',
        left: memo.x,
        top: memo.y,
        zIndex: memo.zIndex,
        cursor: 'grab',
      }}
      className="w-64 p-4 rounded-lg shadow-lg bg-white transition-shadow hover:shadow-xl select-none"
      onMouseDown={handleMouseDown}
    >
      <h3 className="text-lg font-semibold mb-2">{memo.title}</h3>
      <p className="text-gray-600 whitespace-pre-wrap">{memo.content}</p>
    </div>
  );
} 