'use client';

import { useEffect, useState, useRef } from 'react';
import { MemoResponse } from '@/types/memo';
import FloatingButtonGroup from './FloatingButtonGroup';
import Memo from './Memo';

// 模拟数据
const mockMemos: MemoResponse[] = [
  {
    id: 1,
    title: '欢迎使用 ActNow',
    content: '这是一个便签应用，你可以创建、编辑和管理你的便签。',
    x: 100,
    y: 100,
    zIndex: 1,
    style: {
      id: 1,
      code: 'default',
      name: '默认样式',
      imageUrl: '',
      isFree: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false
  },
  {
    id: 2,
    title: '使用提示',
    content: '点击右上角的加号按钮可以创建新的便签。\n拖拽便签可以改变位置。\n点击便签可以将其置于顶层。',
    x: 400,
    y: 150,
    zIndex: 2,
    style: {
      id: 1,
      code: 'default',
      name: '默认样式',
      imageUrl: '',
      isFree: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false
  },
  {
    id: 3,
    title: '待办事项',
    content: '1. 完成项目文档\n2. 准备周会演示\n3. 回复重要邮件',
    x: 200,
    y: 300,
    zIndex: 3,
    style: {
      id: 1,
      code: 'default',
      name: '默认样式',
      imageUrl: '',
      isFree: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false
  }
];

export default function Board() {
  const [memos, setMemos] = useState<MemoResponse[]>(mockMemos);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: 从后端获取便签数据
    const fetchMemos = async () => {
      try {
        const response = await fetch('/api/memos');
        const data = await response.json();
        setMemos(data);
      } catch (error) {
        console.error('Failed to fetch memos:', error);
      }
    };

    // 暂时注释掉，使用模拟数据
    // fetchMemos();
  }, []);

  const handleMemoCreate = (newMemo: MemoResponse) => {
    setMemos([...memos, newMemo]);
    // TODO: 调用后端 API 创建便签
  };

  const calculateBoundaries = (memoWidth: number, memoHeight: number) => {
    if (!boardRef.current) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    const boardRect = boardRef.current.getBoundingClientRect();
    return {
      minX: 30,
      maxX: boardRect.width - memoWidth - 30,
      minY: 30,
      maxY: boardRect.height - memoHeight - 30
    };
  };

  const handleDragStart = (id: number, startPos: { x: number, y: number }) => {
    setDraggingId(id);
    dragStartPos.current = startPos;
  };

  const handleDragMove = (e: MouseEvent) => {
    if (draggingId === null || !boardRef.current) return;

    const memo = memos.find(m => m.id === draggingId);
    if (!memo) return;

    const memoElement = boardRef.current.querySelector(`[data-memo-id="${draggingId}"]`) as HTMLElement;
    if (!memoElement) return;

    const boundaries = calculateBoundaries(memoElement.offsetWidth, memoElement.offsetHeight);
    const newX = Math.min(Math.max(e.clientX - dragStartPos.current.x, boundaries.minX), boundaries.maxX);
    const newY = Math.min(Math.max(e.clientY - dragStartPos.current.y, boundaries.minY), boundaries.maxY);

    setMemos(memos.map(m => 
      m.id === draggingId ? { ...m, x: newX, y: newY } : m
    ));
  };

  const handleDragEnd = () => {
    if (draggingId === null) return;

    const memo = memos.find(m => m.id === draggingId);
    if (memo) {
      // TODO: 调用后端 API 更新便签位置
      console.log('Update memo position:', memo.id, memo.x, memo.y);
    }

    setDraggingId(null);
  };

  const handleSelect = (id: number) => {
    // TODO: 如果需要选中效果，可以在这里添加
    console.log('Selected memo:', id);
  };

  useEffect(() => {
    if (draggingId !== null) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [draggingId]);

  return (
    <div ref={boardRef} className="relative w-full h-screen overflow-hidden">
      {/* 便签容器 */}
      <div className="relative w-full h-full">
        {memos
          .sort((a, b) => a.zIndex - b.zIndex) // 按 zIndex 排序
          .map((memo) => (
            <Memo
              key={memo.id}
              memo={memo}
              onDragStart={handleDragStart}
              onSelect={handleSelect}
            />
          ))}
      </div>
      
      {/* 按钮组，确保在最上层 */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingButtonGroup onMemoCreate={handleMemoCreate} />
      </div>
    </div>
  );
}