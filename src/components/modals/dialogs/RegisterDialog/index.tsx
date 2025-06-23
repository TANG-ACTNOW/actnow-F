'use client';
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { LocalRegister } from './LocalRegister';
import { MagicRegister } from './MagicRegister';

export interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export const RegisterDialog: React.FC<RegisterDialogProps> = (props) => {
  const [tab, setTab] = useState<'local' | 'magic'>('local');

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 ${tab === 'local' ? 'font-bold border-b-2 border-indigo-600' : ''}`}
          onClick={() => setTab('local')}
        >
          账号密码注册
        </button>
        <button
          className={`px-4 py-2 ${tab === 'magic' ? 'font-bold border-b-2 border-indigo-600' : ''}`}
          onClick={() => setTab('magic')}
        >
          邮箱验证码注册
        </button>
      </div>
      {tab === 'local' ? (
        <LocalRegister key="local" {...props} />
      ) : (
        <MagicRegister key="magic" {...props} />
      )}
    </div>
  );
}; 