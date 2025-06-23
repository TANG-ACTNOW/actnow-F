import React from 'react';
import { SlideToConfirm } from './SlideToConfirm';

interface SlideToEditProps {
  onEdit: () => boolean | Promise<boolean>;
  className?: string;
  disabled?: boolean;
}

export const SlideToEdit: React.FC<SlideToEditProps> = ({
  onEdit,
  className = "",
  disabled = false
}) => {
  return (
    <SlideToConfirm
      onConfirm={onEdit}
      title="滑动编辑信息"
      className={className}
      disabled={disabled}
      color="blue"
    />
  );
}; 