import React from 'react';
import { SlideToConfirm } from './SlideToConfirm';

interface SlideToUpdateProps {
  onUpdate: () => boolean | Promise<boolean>;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export const SlideToUpdate: React.FC<SlideToUpdateProps> = ({
  onUpdate,
  title = "滑动更新",
  className = "",
  disabled = false
}) => {
  return (
    <SlideToConfirm
      onConfirm={onUpdate}
      title={title}
      className={className}
      disabled={disabled}
      color="green"
    />
  );
}; 