import React from 'react';

export const Plan: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">订阅计划</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-2 border-gray-200">
          <h4 className="text-xl font-semibold mb-4">免费版</h4>
          <p className="text-gray-600 mb-4">基础功能，适合个人使用</p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              基础功能
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              标准支持
            </li>
          </ul>
          <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            当前计划
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-2 border-blue-200">
          <h4 className="text-xl font-semibold mb-4">专业版</h4>
          <p className="text-gray-600 mb-4">高级功能，适合专业用户</p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              所有基础功能
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              高级功能
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              优先支持
            </li>
          </ul>
          <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            升级计划
          </button>
        </div>
      </div>
    </div>
  );
}; 