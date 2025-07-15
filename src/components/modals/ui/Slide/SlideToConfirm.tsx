import React, { useRef, useState, useEffect } from 'react';

interface SlideToConfirmProps {
  onConfirm: () => boolean | Promise<boolean>;
  title?: string;
  className?: string;
  disabled?: boolean;
  color?: 'red' | 'blue' | 'green' | 'yellow';
}

export const SlideToConfirm: React.FC<SlideToConfirmProps> = ({
  onConfirm,
  title = "滑动确认",
  className = "",
  disabled = false,
  color = "red"
}) => {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  const startX = useRef<number | null>(null);
  const isMouseDown = useRef<boolean>(false);

  const colorMap = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b'
  };
  const selectedColor = colorMap[color];

  // 移动端 touch 事件
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isProcessing) return;
    const touch = e.touches[0];
    startX.current = touch.clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isProcessing || startX.current === null || !sliderRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX.current;
    const sliderWidth = sliderRef.current.offsetWidth;
    let newProgress = Math.min(Math.max(0, progress + (deltaX / sliderWidth) * 150), 100);
    setProgress(newProgress);
    startX.current = touch.clientX;
  };
  const handleTouchEnd = async () => {
    startX.current = null;
    if (progress >= 100) {
      setIsProcessing(true);
      try {
        const result = await onConfirm();
        if (!result) setProgress(0);
      } catch (err) {
        console.error("SlideToConfirm error:", err);
      } finally {
        setProgress(0);
        setIsProcessing(false);
      }
    } else {
      setProgress(0);
    }
  };

  // PC端鼠标事件
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || isProcessing) return;
    isMouseDown.current = true;
    startX.current = e.clientX;
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown.current || disabled || isProcessing || startX.current === null || !sliderRef.current) return;
      const deltaX = e.clientX - startX.current;
      const sliderWidth = sliderRef.current.offsetWidth;
      let newProgress = Math.min(Math.max(0, progress + (deltaX / sliderWidth) * 150), 100);
      setProgress(newProgress);
      startX.current = e.clientX;
    };
    const handleMouseUp = async () => {
      if (!isMouseDown.current) return;
      isMouseDown.current = false;
      startX.current = null;
      document.body.style.userSelect = '';
      if (progress >= 100) {
        setIsProcessing(true);
        try {
          const result = await onConfirm();
          if (!result) setProgress(0);
        } catch (err) {
          console.error("SlideToConfirm error:", err);
        } finally {
          setProgress(0);
          setIsProcessing(false);
        }
      } else {
        setProgress(0);
      }
    };
    if (isMouseDown.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [progress, disabled, isProcessing, onConfirm]);

  // 可选：onChange 兜底
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  return (
    <div className={`relative w-full ${className}`} style={{ userSelect: 'none' }}>
      <input
        ref={sliderRef}
        type="range"
        min="0"
        max="100"
        step="1"
        value={progress}
        disabled={disabled || isProcessing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onChange={handleChange}
        className={`relative z-10 w-full h-12 appearance-none rounded-full outline-none cursor-pointer transition-opacity ${
          (disabled || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''
        } custom-slider`}
        style={{
          background: `linear-gradient(to right, ${selectedColor} 0%, ${selectedColor} ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
        }}
      />
      <div
        className="absolute left-0 right-0 flex items-center justify-center pointer-events-none"
        style={{
          top: 0,
          height: '48px',
          zIndex: 20,
        }}
      >
        <span className="text-sm text-gray-500 font-medium select-none" style={{ opacity: 0.7 }}>
          {title}
        </span>
      </div>
    </div>
  );
};
