import React, { useState } from 'react';

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

  const colorMap = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b'
  };

  const selectedColor = colorMap[color];

  const handleSlide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isProcessing) return;

    const newProgress = parseInt(e.target.value);
    setProgress(newProgress);

    if (newProgress >= 100) {
      setIsProcessing(true);
      try {
        const result = await onConfirm();
        if (result) {
          setProgress(0); // 重置进度
        } else {
          setProgress(0); // 重置进度但不完成操作
        }
      } catch (error) {
        console.error('SlideToConfirm error:', error);
        setProgress(0); // 出错时重置进度
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
<div className="relative w-full">
  {/* 滑动条 */}
  <input
    type="range"
    min="0"
    max="100"
    value={progress}
    onChange={handleSlide}
    disabled={disabled || isProcessing}
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

  {/* 中央文字，确保与input相同高度 */}
  <div
    className="absolute left-0 right-0 flex items-center justify-center pointer-events-none"
    style={{
      top: 0,
      height: '48px', // 与input的h-12 (48px) 保持一致
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