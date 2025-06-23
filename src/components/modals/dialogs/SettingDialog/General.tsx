import React, { useState } from 'react';
import { PhotoIcon, ArrowsPointingOutIcon, ArrowDownTrayIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';

export const General: React.FC = () => {
  const { globalSettings, updateGlobalSettings } = useApp();

  const handleBackgroundChange = () => {
    // 这里可以添加更换背景的逻辑
    console.log('更换背景');
  };

  const handleExportData = () => {
    // 这里可以添加导出数据的逻辑
    console.log('导出数据');
  };

  const handleAboutUs = () => {
    // 这里可以添加关于我们的逻辑
    console.log('关于我们');
  };

  // const handleZoomChange = (newZoom: number) => {
  //   updateGlobalSettings({ pageZoom: newZoom });
  // };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">通用设置</h3>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          {/* 页面缩放 */}
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ArrowsPointingOutIcon className="w-5 h-5 text-gray-500" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">页面缩放</h4>
                <p className="text-sm text-gray-500">调整整个页面的显示大小</p>
              </div>
            </div>
            <select
              value={globalSettings.pageZoom}
              onChange={(e) => handleZoomChange(Number(e.target.value))}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={0.75}>75%</option>
              <option value={0.9}>90%</option>
              <option value={1.0}>100%</option>
              <option value={1.1}>110%</option>
              <option value={1.25}>125%</option>
              <option value={1.5}>150%</option>
            </select>
          </div> */}

          {/* 更换背景 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PhotoIcon className="w-5 h-5 text-gray-500" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">更换背景</h4>
                <p className="text-sm text-gray-500">自定义应用背景图片</p>
              </div>
            </div>
            <button
              onClick={handleBackgroundChange}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              选择
            </button>
          </div>

          {/* 导出数据 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ArrowDownTrayIcon className="w-5 h-5 text-gray-500" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">导出数据</h4>
                <p className="text-sm text-gray-500">导出所有便签数据</p>
              </div>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              导出
            </button>
          </div>

          {/* 关于我们 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <InformationCircleIcon className="w-5 h-5 text-gray-500" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">关于我们</h4>
                <p className="text-sm text-gray-500">查看应用信息和版本</p>
              </div>
            </div>
            <button
              onClick={handleAboutUs}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              查看
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 