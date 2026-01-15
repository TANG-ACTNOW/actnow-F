import React, { useRef, useState } from 'react';

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

  const colorMap = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b'
  };

  const selectedColor = colorMap[color];

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

    // 将滑动距离转为百分比进度
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
        if (!result) {
          setProgress(0);
        }
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

  return (
    <div className={`relative w-full ${className}`} style={{ userSelect: 'none' }}>
      <input
        ref={sliderRef}
        type="range"
        min="0"
        max="100"
        step="1"
        value={progress}
        readOnly // 禁止浏览器默认滑动行为
        disabled={disabled || isProcessing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
