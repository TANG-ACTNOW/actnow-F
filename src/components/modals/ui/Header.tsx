import React from 'react';
import { useApp } from '@/contexts/AppContext';

export const Header: React.FC = () => {
  const { isLoggedIn, logout, openModal } = useApp();

  const handleSettingClick = () => {
    openModal('setting');
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">ActNow</h1>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleSettingClick}
                className="text-gray-600 hover:text-gray-800"
              >
                设置
              </button>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-800"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openModal('login')}
                className="text-gray-600 hover:text-gray-800"
              >
                登录
              </button>
              <button
                onClick={() => openModal('register')}
                className="text-gray-600 hover:text-gray-800"
              >
                注册
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}; 