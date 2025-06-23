import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export type ModalSize = 'sm' | 'md' | 'lg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange?: (isOpen: boolean) => void;
  children: React.ReactNode;
  title?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  className?: string;
  noPadding?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  children,
  title,
  size = 'md',
  showCloseButton = true,
  className,
  noPadding,
}) => {
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={cn(
          "relative bg-white rounded-xl shadow-xl w-full text-gray-900",
          sizeClasses[size],
          className
        )}
        style={{
          aspectRatio: '4/4',
          maxHeight: '90vh'
        }}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <div className={cn(
          "h-[calc(100%-3rem-12px)] overflow-y-auto rounded-br-xl",
          !noPadding && "p-6"
        )}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}; 