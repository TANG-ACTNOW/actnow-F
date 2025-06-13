import React, { useState } from 'react';

interface ModalWithSidebarProps {
  open: boolean;
  onClose: () => void;
}

const sidebarItems = [
  { key: 'profile', label: '个人资料' },
  { key: 'plan', label: '计划' },
];

export default function ModalWithSidebar({ open, onClose }: ModalWithSidebarProps) {
  const [selected, setSelected] = useState('profile');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-[520px] max-w-full flex flex-col p-0 relative">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <span className="text-lg font-semibold">设置</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex h-[400px] bg-transparent">
          {/* 侧边栏 */}
          <div className="relative w-36 flex flex-col py-4 bg-transparent">
            <div className="absolute inset-0 rounded-bl-xl bg-gray-50" style={{zIndex: 0}} />
            <div className="relative z-10 flex flex-col h-full">
              {sidebarItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => setSelected(item.key)}
                  className={`text-left px-6 py-2 mb-2 rounded-r-full transition-colors ${selected === item.key ? 'bg-white font-bold text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {/* 内容区 */}
          <div className="flex-1 p-6 overflow-auto bg-transparent">
            {selected === 'profile' && (
              <div>
                <h2 className="text-base font-semibold mb-2">个人资料</h2>
                <p className="text-gray-500">这里是个人资料内容。</p>
              </div>
            )}
            {selected === 'plan' && (
              <div>
                <h2 className="text-base font-semibold mb-2">计划</h2>
                <p className="text-gray-500">这里是计划内容。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 