import React, { useState } from 'react';
import { LocalLogin } from './LocalLogin';
import { MagicLogin } from './MagicLogin';

export interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = (props) => {
  const [tab, setTab] = useState<'local' | 'magic'>('local');



  return (
    <div>
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 ${tab === 'local' ? 'font-bold border-b-2 border-indigo-600' : ''}`}
          onClick={() => setTab('local')}
        >
          账号密码登录
        </button>
        <button
          className={`px-4 py-2 ${tab === 'magic' ? 'font-bold border-b-2 border-indigo-600' : ''}`}
          onClick={() => setTab('magic')}
        >
          验证码登录
        </button>
      </div>
      {tab === 'local' ? (
        <LocalLogin key="local" {...props} />
      ) : (
        <MagicLogin key="magic" {...props} />
      )}
    </div>
  );
}; 