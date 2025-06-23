import React from 'react';
import { SlideToConfirm } from './SlideToConfirm';

interface SlideToCreateProps {
  onCreate: () => boolean | Promise<boolean>;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export const SlideToCreate: React.FC<SlideToCreateProps> = ({
  onCreate,
  title = "滑动创建便签",
  className = "",
  disabled = false
}) => {
  return (
    <SlideToConfirm
      onConfirm={onCreate}
      title={title}
      className={className}
      disabled={disabled}
      color="blue"
    />
  );
}; 