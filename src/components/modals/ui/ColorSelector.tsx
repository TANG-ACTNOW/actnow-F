import React from 'react';

interface ColorSelectorProps {
  color: string;
  onColorChange: (color: string) => void;
  disabled?: boolean;
}

// 常见的便签颜色
const commonColors = [
  '#FFFFFF', // 白色
  '#FEF3C7', // 浅黄色
  '#FEE2E2', // 浅红色
  '#DBEAFE', // 浅蓝色
  '#D1FAE5', // 浅绿色
  '#F3E8FF', // 浅紫色
  '#FED7AA', // 浅橙色
  '#FECACA', // 浅粉色
  '#E5E7EB', // 浅灰色

];

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  color,
  onColorChange,
  disabled = false
}) => {
  return (
    <div className="rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">选择颜色</h3>
      
      <div className="flex items-center space-x-4">
        {/* 色盘选择器 */}
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 opacity-0 absolute inset-0 z-10"
            disabled={disabled}
          />
          <div 
            className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 relative"
            style={{
              background: `conic-gradient(from 0deg, 
                #ff0000 0deg, #ff8000 30deg, #ffff00 60deg, #80ff00 90deg, 
                #00ff00 120deg, #00ff80 150deg, #00ffff 180deg, #0080ff 210deg, 
                #0000ff 240deg, #8000ff 270deg, #ff00ff 300deg, #ff0080 330deg, #ff0000 360deg
              )`
            }}
          >
            {/* 中心白色圆圈 */}
            <div className="absolute inset-2 rounded-full bg-white border border-gray-200 shadow-inner"></div>
            {/* 当前选中的颜色显示 */}
            <div 
              className="absolute inset-3 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color }}
            ></div>
            {/* 色盘中心点 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-gray-600 shadow-sm"></div>
            </div>
          </div>
        </div>

        {/* 常见颜色按钮 */}
        <div className="flex flex-wrap gap-2">
          {commonColors.map((commonColor) => (
            <button
              key={commonColor}
              type="button"
              onClick={() => onColorChange(commonColor)}
              disabled={disabled}
              className={`
                w-8 h-8 rounded-full border-2 transition-all
                ${color === commonColor 
                  ? 'border-gray-800 scale-110 shadow-lg' 
                  : 'border-gray-300 hover:border-gray-500 hover:scale-105'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{ backgroundColor: commonColor }}
              title={`选择 ${commonColor}`}
            />
          ))}
        </div>

        {/* 16进制颜色输入框 */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">#</span>
          <input
            type="text"
            value={color.replace('#', '')}
            onChange={(e) => {
              const value = e.target.value;
              // 只允许输入16进制字符
              if (/^[0-9A-Fa-f]*$/.test(value) && value.length <= 6) {
                onColorChange(`#${value}`);
              }
            }}
            placeholder="FFFFFF"
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={disabled}
            maxLength={6}
          />
        </div>
      </div>
    </div>
  );
}; 