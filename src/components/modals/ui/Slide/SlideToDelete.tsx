import React from 'react';
import { SlideToConfirm } from './SlideToConfirm';

interface SlideToDeleteProps {
  onDelete: () => boolean | Promise<boolean>;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export const SlideToDelete: React.FC<SlideToDeleteProps> = ({
  onDelete,
  title = "滑动删除",
  className = "",
  disabled = false
}) => {
  return (
    <SlideToConfirm
      onConfirm={onDelete}
      title={title}
      className={className}
      disabled={disabled}
      color="red"
    />
  );
}; 