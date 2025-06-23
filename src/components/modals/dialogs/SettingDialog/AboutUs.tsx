import React from 'react';

export const AboutUs: React.FC = () => {
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">关于我们</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">应用名称</h3>
          <p className="text-gray-600">ActNow 行动笔记</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">版本</h3>
          <p className="text-gray-600">v1.0.0</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">团队</h3>
          <p className="text-gray-600">由 TANG 设计与开发，致力于提升你的行动力和效率。</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">联系方式</h3>
          <p className="text-gray-600">邮箱：hetang404@gmail.com</p>
        </div>
      </div>
    </div>
  );
}; 