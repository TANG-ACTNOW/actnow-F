import React from 'react';
import { SlideToConfirm } from './SlideToConfirm';

interface SlideToSaveProps {
  onSave: () => boolean | Promise<boolean>;
  className?: string;
  disabled?: boolean;
}

export const SlideToSave: React.FC<SlideToSaveProps> = ({
  onSave,
  className = "",
  disabled = false
}) => {
  return (
    <SlideToConfirm
      onConfirm={onSave}
      title="滑动保存更改"
      className={className}
      disabled={disabled}
      color="green"
    />
  );
}; 