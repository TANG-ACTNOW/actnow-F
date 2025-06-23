import React from 'react';
import { SlideToConfirm } from './SlideToConfirm';

interface SlideToLogoutProps {
  onLogout: () => boolean | Promise<boolean>;
  className?: string;
  disabled?: boolean;
}

export const SlideToLogout: React.FC<SlideToLogoutProps> = ({
  onLogout,
  className = "",
  disabled = false
}) => {
  return (
    <SlideToConfirm
      onConfirm={onLogout}
      title="滑动退出登录"
      className={className}
      disabled={disabled}
      color="red"
    />
  );
}; 