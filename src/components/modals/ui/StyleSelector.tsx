import React from 'react';

interface StyleSelectorProps {
  selectedSize: string;
  onSizeChange: (sizeId: string) => void;
  disabled?: boolean;
}

// 注意：这个组件现在主要用于尺寸选择，颜色通过独立的颜色选择器处理
export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedSize,
  onSizeChange,
  disabled = false
}) => {
  // 四个主要的尺寸选项，对应后端的四个style code，尺寸与样式文件完全匹配
  const sizeOptions = [
    { id: 'small', name: '小尺寸', description: '48 × 24', titleLimit: '12单位', contentLimit: '72单位' },
    { id: 'default', name: '默认尺寸', description: '56 × 44', titleLimit: '15单位', contentLimit: '224单位' },
    { id: 'large', name: '大尺寸', description: '60 × 60', titleLimit: '16单位', contentLimit: '372单位' },
    { id: 'xlarge', name: '超大尺寸', description: '72 × 60', titleLimit: '22单位', contentLimit: '468单位' },
  ];

  return (
    <div className="rounded-lg p-4">
      {/* 尺寸选择 */}
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-3">选择尺寸</h4>
        <div className="grid grid-cols-2 gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size.id}
              type="button"
              disabled={disabled}
              onClick={() => onSizeChange(size.id)}
              className={`
                relative p-3 rounded-lg border-2 transition-all text-left
                ${selectedSize === size.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 bg-transparent'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-gray-800">
                  {size.name}
                </div>
                <div className="text-xs text-gray-500">
                  {size.description}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                标题: {size.titleLimit} | 内容: {size.contentLimit}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 