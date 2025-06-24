import React, { useState, useMemo } from 'react';
import { BaseDialogProps } from '@/types/user';
import { useApp } from '@/contexts/AppContext';
import { SlideToCreate } from '@/components/modals/ui/Slide';
import { StyleSelector } from '@/components/modals/ui/StyleSelector';
import { ColorSelector } from '@/components/modals/ui/ColorSelector';
import { getStyleById } from '@/config/styles';
import { API_ENDPOINTS } from '@/config/api';

// 计算字符的视觉宽度
const getCharWidth = (char: string): number => {
  if (/[\u4e00-\u9fa5]/.test(char)) return 2; // 汉字占位2
  if (/[a-zA-Z0-9]/.test(char)) return 1;     // 字母数字占位1
  return 1; // 其他字符（标点等）占位1
};

// 计算标题的视觉宽度（标题不换行，只需要简单累加）
const getTitleWidth = (text: string): number => {
  return text.split('').reduce((total, char) => total + getCharWidth(char), 0);
};

// 截断标题到指定视觉宽度（标题不换行，简单截断）
const truncateTitle = (text: string, maxWidth: number): string => {
  let result = '';
  let currentWidth = 0;
  
  for (const char of text) {
    const charWidth = getCharWidth(char);
    if (currentWidth + charWidth <= maxWidth) {
      result += char;
      currentWidth += charWidth;
    } else {
      break;
    }
  }
  
  return result;
};

// 计算文本的视觉宽度，考虑换行符主动占位右侧剩余空间
const getVisualWidth = (text: string, singleLineWidth: number): number => {
  let totalWidth = 0;
  let currentLineWidth = 0;

  for (const char of text) {
    if (char === '\n') {
      totalWidth += singleLineWidth; // 手动换行：当前行结束，占满整行
      currentLineWidth = 0;
    } else {
      const charWidth = getCharWidth(char);

      if (currentLineWidth + charWidth > singleLineWidth) {
        totalWidth += singleLineWidth; // 自动换行
        currentLineWidth = charWidth;  // 当前字符开始新行
      } else {
        currentLineWidth += charWidth; // 正常放入当前行
      }
    }
  }

  totalWidth += currentLineWidth; // 最后一行（不足一整行）也要计入
  return totalWidth;
};

// 根据memo大小设置不同的视觉宽度限制
const getTextLimits = (styleId: number) => {
  const limits: Record<number, {
    title: { maxWidth: number; warningWidth: number };
    content: { totalUnits: number; warningUnits: number; singleLineWidth: number };
  }> = {
    1: { // default
      title: { maxWidth: 15, warningWidth: 11 },
      content: { totalUnits: 224, warningUnits: 214, singleLineWidth: 28 }
    },
    2: { // small
      title: { maxWidth: 12, warningWidth: 10 },
      content: { totalUnits: 72, warningUnits: 62, singleLineWidth: 24 }
    },
    3: { // large
      title: { maxWidth: 16, warningWidth: 14 },
      content: { totalUnits: 372, warningUnits: 362, singleLineWidth: 31 }
    },
    4: { // xlarge
      title: { maxWidth: 22, warningWidth: 18 },
      content: { totalUnits: 468, warningUnits: 458, singleLineWidth: 39 }
    }
  };
  return limits[styleId] || limits[1];
};

export const CreateMemoDialog: React.FC<BaseDialogProps> = ({ isOpen, onClose }) => {
  const { refreshMemos } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#FFFFFF');
  const [styleId, setStyleId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取当前样式的文字长度限制
  const textLimits = getTextLimits(styleId);

  // 截断文本到指定视觉宽度，考虑换行符主动占位
  const truncateToVisualWidth = (text: string, totalMaxWidth: number, singleLineMaxWidth: number): string => {
    const lines = text.split('\n');
    const truncatedLines = [];
    let currentTotalWidth = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let result = '';
      let currentWidth = 0;
      
      for (const char of line) {
        const charWidth = getCharWidth(char);
        if (currentWidth + charWidth <= singleLineMaxWidth) {
          result += char;
          currentWidth += charWidth;
        } else {
          break;
        }
      }
      
      // 计算这一行的总占用（包括换行符占位）
      let lineTotalWidth = currentWidth;
      if (i < lines.length - 1) {
        // 有换行符的行，占满整行
        lineTotalWidth = singleLineMaxWidth;
      }
      
      // 检查添加这一行是否会超过总限制
      if (currentTotalWidth + lineTotalWidth <= totalMaxWidth) {
        truncatedLines.push(result);
        currentTotalWidth += lineTotalWidth;
      } else {
        // 如果会超过，就不添加这一行
        break;
      }
    }
    
    return truncatedLines.join('\n');
  };

  // 处理尺寸切换
  const handleStyleChange = (newStyleId: number) => {
    const newLimits = getTextLimits(newStyleId);
    const messages = [];

    // Handle title truncation
    const currentTitleWidth = getTitleWidth(title);
    if (currentTitleWidth > newLimits.title.maxWidth) {
      const truncatedTitle = truncateTitle(title, newLimits.title.maxWidth);
      setTitle(truncatedTitle);
      messages.push('标题');
    }

    // Handle content truncation
    const currentContentWidth = getVisualWidth(content, newLimits.content.singleLineWidth);
    if (currentContentWidth > newLimits.content.totalUnits) {
      const truncatedContent = truncateToVisualWidth(content, newLimits.content.totalUnits, newLimits.content.singleLineWidth);
      setContent(truncatedContent);
      messages.push('内容');
    }

    if (messages.length > 0) {
      setError(`${messages.join('和')}已自动截断以适应新尺寸`);
      setTimeout(() => setError(null), 3000);
    }
    
    setStyleId(newStyleId);
  };

  // 获取标题视觉宽度和状态
  const getTitleVisualInfo = () => {
    const visualWidth = getTitleWidth(title);
    const isOverLimit = visualWidth > textLimits.title.maxWidth;
    const isWarning = visualWidth > textLimits.title.warningWidth;
    
    return {
      visualWidth,
      maxWidth: textLimits.title.maxWidth,
      isOverLimit,
      isWarning,
      remaining: textLimits.title.maxWidth - visualWidth
    };
  };

  // 获取内容视觉宽度和状态
  const getContentVisualInfo = () => {
    const visualWidth = getVisualWidth(content, textLimits.content.singleLineWidth);
    const limit = textLimits.content;
    const isOverLimit = visualWidth > limit.totalUnits;
    const isWarning = visualWidth > limit.warningUnits;
    
    return {
      visualWidth,
      maxWidth: limit.totalUnits,
      isOverLimit,
      isWarning,
      remaining: limit.totalUnits - visualWidth
    };
  };

  const titleVisualInfo = useMemo(() => getTitleVisualInfo(), [title, textLimits.title]);
  const contentVisualInfo = useMemo(() => getContentVisualInfo(), [content, textLimits.content.totalUnits]);

  const validateForm = () => {
    if (!title.trim()) {
      setError('标题不能为空');
      return false;
    }
    if (!content.trim()) {
      setError('内容不能为空');
      return false;
    }
    if (titleVisualInfo.isOverLimit) {
      setError(`标题视觉宽度不能超过${textLimits.title.maxWidth}个单位`);
      return false;
    }
    if (contentVisualInfo.isOverLimit) {
      setError(`内容视觉宽度不能超过${textLimits.content.totalUnits}个单位`);
      return false;
    }
    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      setError('颜色格式不正确，请使用十六进制格式（如 #FF0000）');
      return false;
    }
    setError(null);
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return false; // 阻止滑动完成
    }

    setLoading(true);
    setError(null);
    try {
      // 获取当前样式的code
      const currentStyle = getStyleById(styleId);
      const styleCode = currentStyle.code;
      
      // 添加调试日志
      console.log('Creating memo with styleId:', styleId, 'styleCode:', styleCode);
      const requestBody = { title, content, color, styleCode };
      console.log('Request body:', requestBody);
      
      await fetch(API_ENDPOINTS.MEMO.CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      })
        .then(async res => {
          if (!res.ok) {
            const errText = await res.text();
            let errMsg = '创建失败';
            try {
              const errJson = JSON.parse(errText);
              if (errJson.message) errMsg = errJson.message;
              else if (Array.isArray(errJson.errors) && errJson.errors.length > 0) errMsg = errJson.errors[0].message;
              else errMsg = errText;
            } catch {
              if (errText) errMsg = errText;
            }
            throw new Error(errMsg);
          }
        })
        .catch(error => {
          console.error('fetch error:', error);
          throw error;
        });
      setTitle('');
      setContent('');
      setColor('#FFFFFF');
      setStyleId(1);
      onClose();
      refreshMemos();
      return true; // 滑动完成
    } catch (err: any) {
      setError('创建失败: ' + (err.message || err.toString()));
      return false; // 阻止滑动完成
    } finally {
      setLoading(false);
    }
  };

  // 获取当前样式配置（用于尺寸）
  const currentStyle = getStyleById(styleId);

  // 根据样式类型构建样式对象
  const memoStyle = {
    backgroundColor: color,
    borderColor: `${color}40`,
  };

  // 计算文字颜色
  const textColor = getContrastColor(color);

  return (
    <div className="flex flex-col h-full">
      {/* 隐藏滚动条样式 */}
      <style dangerouslySetInnerHTML={{ __html: `
        textarea::-webkit-scrollbar {
          display: none;
        }
        textarea {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}} />
      
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 mb-4 rounded">
          {error}
        </div>
      )}

      {/* 主要内容区域 - 上下排列 */}
      <div className="flex-1 flex flex-col gap-4 p-4">
        {/* Demo 区域 */}
        <div className="flex flex-col items-center gap-2">
          {/* 可编辑的 Memo 预览 */}
          <div
            style={memoStyle}
            className={`${currentStyle.size.width} ${currentStyle.size.height} pt-3 pr-3 pl-3 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.25)] relative border-2`}
          >
            {/* 内容层 */}
            <div className="relative z-10 h-full flex flex-col">
              {/* 编辑按钮 */}
              <button
                className="absolute -top-1 -right-1 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors shadow-sm"
                disabled
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              {/* 标题输入框 */}
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const newVisualWidth = getTitleWidth(newValue);
                  if (newVisualWidth > textLimits.title.maxWidth) {
                    setError(`标题视觉宽度不能超过${textLimits.title.maxWidth}单位`);
                  } else {
                    setError(null);
                  }
                  setTitle(newValue);
                }}
                placeholder={`标题最大长度${textLimits.title.maxWidth}单位`}
                className="w-full text-sm mb-2 pr-8 font-bold bg-transparent border-none outline-none resize-none break-words"
                style={{ 
                  color: textColor,
                  caretColor: textColor
                }}
              />
              
              {/* 内容输入框 */}
              <textarea
                value={content}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const newVisualWidth = getVisualWidth(newValue, textLimits.content.singleLineWidth);
                  if (newVisualWidth > textLimits.content.totalUnits) {
                    setError(`内容视觉宽度不能超过${textLimits.content.totalUnits}个单位`);
                  } else {
                    setError(null);
                  }
                  setContent(newValue);
                }}
                placeholder={`内容最大宽度${textLimits.content.totalUnits}个单位`}
                className="w-full text-xs bg-transparent border-none outline-none resize-none whitespace-pre-wrap break-words flex-1"
                style={{ 
                  color: textColor,
                  caretColor: textColor
                }}
              />
            </div>
          </div>

          {/* 视觉宽度计数 - 放在 demo 下边 */}
          <div className={`text-xs text-center ${
            contentVisualInfo.isOverLimit ? 'text-red-500' : 
            contentVisualInfo.isWarning ? 'text-yellow-500' : 'text-gray-400'
          }`}>
            {contentVisualInfo.visualWidth}/{contentVisualInfo.maxWidth}
          </div>
        </div>

        {/* 下方：样式选择器和颜色选择器 */}
        <div className="space-y-4">
          {/* 样式选择器 */}
          <StyleSelector
            selectedSize={getSizeFromStyleId(styleId)}
            onSizeChange={(sizeId) => handleStyleChange(getStyleIdFromSize(sizeId))}
          />

          {/* 颜色选择器 */}
          <ColorSelector
            color={color}
            onColorChange={(newColor) => {
              setColor(newColor);
              if (error) setError(null);
            }}
          />
        </div>
      </div>

      {/* 底部：操作区域 */}
      <div className="p-4 border-t">
        <SlideToCreate
          onCreate={handleCreate}
          title="滑动创建便签"
          disabled={loading || !!error}
        />
      </div>
    </div>
  );
};

// 辅助函数：根据背景色计算对比色
function getContrastColor(hexColor: string): string {
  // 移除 # 号
  const hex = hexColor.replace('#', '');
  
  // 转换为RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // 根据亮度返回黑色或白色
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

// 辅助函数：从 styleId 获取对应的 size
function getSizeFromStyleId(styleId: number): string {
  const sizeMap: { [key: number]: string } = {
    1: 'default',
    2: 'small',
    3: 'large',
    4: 'xlarge',
    // 5: 'nature'
  };
  return sizeMap[styleId] || 'default';
}

// 辅助函数：从 size 获取对应的 styleId
function getStyleIdFromSize(size: string): number {
  const styleIdMap: { [key: string]: number } = {
    'default': 1,
    'small': 2,
    'large': 3,
    'xlarge': 4,
    // 'nature': 5
  };
  return styleIdMap[size] || 1;
} 