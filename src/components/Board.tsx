'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { MemoResponse } from '@/types/memo';
import { HomeResponse } from '@/types/user';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import FloatingButtonGroup from '@/components/FloatingButtonGroup';
import Memo from '@/components/Memo';
import { useApp } from '@/contexts/AppContext';

const defaultMemos: MemoResponse[] = [
  {
    id: 1,
    title: '欢迎使用 ActNow',
    content: '请登录后体验完整功能。',
    color: '#FFFFFF',
    x: 100,
    y: 100,
    zindex: 1,
    style: {
      id: 1,
      code: 'default',
      name: '默认样式',
      imageUrl: '',
      isFree: true
    },
    createdAt: null,
    updatedAt: null,
    isArchived: false,
  },
  // 你可以在这里添加更多默认 memo
];

export default function Board() {
  const [memos, setMemos] = useState<MemoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);
  const originalPosition = useRef<{ x: number; y: number } | null>(null);
  const { isLoggedIn, fetchUserInfo, refreshTrigger } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 先声明 handleDragEndRef 用于在 handleDragMove 中引用最新的 handleDragEnd
  const handleDragEndRef = useRef<() => void>(() => {});

  // ... 先声明 calculateBoundaries ...
  const calculateBoundaries = useCallback((memoWidth: number, memoHeight: number) => {
    if (!boardRef.current) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    const boardRect = boardRef.current.getBoundingClientRect();
    return {
      minX: 30,
      maxX: boardRect.width - memoWidth - 30,
      minY: 30,
      maxY: boardRect.height - memoHeight - 30
    };
  }, []);

  // ... 先声明 updatePosition ...
  const updatePosition = useCallback(async (memoId: number, x: number, y: number) => {
    try {
      const response = await fetch(API_ENDPOINTS.MEMO.UPDATE_POSITION(memoId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ x: Math.round(x), y: Math.round(y) })
      });
      if (response.ok) {
        return { success: true };
      }
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          await fetchUserInfo();
          return { success: false, message: `Auth error: ${response.status}` };
        }
        const errorText = await response.text();
        return { success: false, message: `Server returned ${response.status} ${response.statusText}: ${errorText}` };
      }
      const result = await response.text();
      if (result === '1') {
        return { success: true };
      } else {
        return { success: false, message: `Unexpected response: ${result}` };
      }
    } catch (error) {
      const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
      const isAuthError = error instanceof Error && (
        error.message.includes('401') || 
        error.message.includes('403') ||
        error.message.includes('Unauthorized') ||
        error.message.includes('Forbidden')
      );
      if (!isNetworkError && !isAuthError) {
        return { success: false, message: error instanceof Error ? error.message : String(error) };
      }
      return { success: false, message: 'Network or auth error' };
    }
  }, [fetchUserInfo]);

  // ... 再声明 handleDragMove ...
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (draggingId === null) return;
    if (e.buttons === 0) {
      handleDragEndRef.current(); // 鼠标已松开但未触发 mouseup，强制结束拖拽
      return;
    }
    if (!boardRef.current) return;
    const memo = memos.find(m => m.id === draggingId);
    if (!memo) return;
    const memoElement = boardRef.current.querySelector(`[data-memo-id="${draggingId}"]`) as HTMLElement;
    if (!memoElement) return;
    const boundaries = calculateBoundaries(memoElement.offsetWidth, memoElement.offsetHeight);
    const newX = Math.min(Math.max(e.clientX - dragStartPos.current.x, boundaries.minX), boundaries.maxX);
    const newY = Math.min(Math.max(e.clientY - dragStartPos.current.y, boundaries.minY), boundaries.maxY);
    setMemos(prevMemos => prevMemos.map(m => 
      m.id === draggingId ? { ...m, x: newX, y: newY } : m
    ));
  }, [draggingId, memos, calculateBoundaries]);

  // ... 再声明 handleDragEnd ...
  const handleDragEnd = useCallback(async () => {
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('mouseleave', handleDragEnd);

    if (draggingId === null) return;

    const memo = memos.find(m => m.id === draggingId);
    const original = originalPosition.current;

    if (!memo || !original) {
      setDraggingId(null);
      originalPosition.current = null;
      return;
    }

    const movedX = Math.round(memo.x);
    const movedY = Math.round(memo.y);
    const originalX = Math.round(original.x);
    const originalY = Math.round(original.y);

    const hasMoved = movedX !== originalX || movedY !== originalY;

    if (!hasMoved) {
      console.log('未发生实际移动，不发请求');
      setDraggingId(null);
      originalPosition.current = null;
      return;
    }

    const result = await updatePosition(memo.id, movedX, movedY);

    if (!result.success) {
      console.warn('更新失败，回滚原位置，原因：', result.message);
      setMemos(prevMemos => prevMemos.map(m =>
        m.id === draggingId ? { ...m, x: originalX, y: originalY } : m
      ));
    }

    setDraggingId(null);
    originalPosition.current = null;
  }, [draggingId, memos, updatePosition, handleDragMove]);

  // 保证 handleDragEndRef 始终指向最新的 handleDragEnd
  useEffect(() => {
    handleDragEndRef.current = handleDragEnd;
  }, [handleDragEnd]);

  const handleSelect = useCallback((id: number) => {
    // TODO: 如果需要选中效果，可以在这里添加
    console.log('Selected memo:', id);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchHomeData = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.HOME.INDEX, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch home data');
        }
        const data: HomeResponse = await response.json();
        
        // 添加调试日志
        console.log('Home API response:', data);
        console.log('Memos from API:', data.memos);
        if (data.memos.length > 0) {
          console.log('First memo style:', data.memos[0].style);
          console.log('First memo style.code:', data.memos[0].style.code);
        }
        
        setMemos(data.memos);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
        setError('Failed to load memos');
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, [isLoggedIn, refreshTrigger]);

  const handleMemoCreate = useCallback((newMemo: MemoResponse) => {
    setMemos(prevMemos => [...prevMemos, newMemo]);
  }, []);

  const handleDragStart = useCallback((id: number, startPos: { x: number, y: number }) => {
    setDraggingId(id);
    dragStartPos.current = startPos;
    // 保存开始拖动时的位置，以便更新失败时回滚
    const memo = memos.find(m => m.id === id);
    if (memo) {
      originalPosition.current = { x: memo.x, y: memo.y };
    }
  }, [memos]);

  const handleSelectEffect = useEffect(() => {
    if (draggingId !== null) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('mouseleave', handleDragEnd);
      // 清理函数
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('mouseleave', handleDragEnd);
      };
    }
    // 如果 draggingId 是 null，不需要绑定事件，也不需要清理
    return;
  }, [draggingId, handleDragMove, handleDragEnd]);

  // 未登录时显示默认内容和按钮组
  if (!isLoggedIn) {
    return (
      <>
        <div className="relative w-full h-screen overflow-hidden">
          <div className="relative w-full h-full">
            {defaultMemos.map((memo) => (
              <Memo key={memo.id} memo={memo} onDragStart={() => {}} onSelect={() => {}} />
            ))}
          </div>
        </div>
        <FloatingButtonGroup onMemoCreate={() => {}} isModalOpen={isModalOpen} onModalOpenChange={setIsModalOpen} />
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  // 已登录时即使 error 也不显示 401 页面，而是显示空白或其它友好内容

  return (
    <>
      <div ref={boardRef} className="relative w-full h-screen overflow-hidden">
        <div className="relative w-full h-full">
          {memos
            .sort((a, b) => (a.zindex || 0) - (b.zindex || 0))
            .map((memo) => (
              <Memo
                key={memo.id}
                memo={memo}
                onDragStart={handleDragStart}
                onSelect={handleSelect}
              />
            ))}
        </div>
      </div>
      <FloatingButtonGroup onMemoCreate={handleMemoCreate} isModalOpen={isModalOpen} onModalOpenChange={setIsModalOpen} />
    </>
  );
}