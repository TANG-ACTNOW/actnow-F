// 样式配置类型定义
export interface StyleConfig {
  id: number;
  code: string;
  name: string;
  type: 'color' | 'image';
  className: string;
  titleColor: string;
  contentColor: string;
  isFree: boolean;
  backgroundImage?: string; // 图片背景时使用
  overlay?: string; // 图片遮罩层
  size: {
    width: string; // Tailwind 宽度类名
    height?: string; // 最小高度
  };
}

// 前端样式映射表 - 基本的样式配置
export const STYLE_MAP: Record<number, StyleConfig> = {
  1: {
    id: 1,
    code: 'default',
    name: '默认样式',
    type: 'color',
    className: 'bg-white border-gray-300 shadow-lg',
    titleColor: 'text-gray-800',
    contentColor: 'text-gray-600',
    isFree: true,
    size: {
      width: 'w-56', // 224px (原来是288px，约75%)
      height: 'h-44' // 176px (原来是240px，约75%)
    }
  },
  2: {
    id: 2,
    code: 'small',
    name: '小尺寸',
    type: 'color',
    className: 'bg-white border-gray-300 shadow-lg',
    titleColor: 'text-gray-800',
    contentColor: 'text-gray-600',
    isFree: true,
    size: {
      width: 'w-48', // 192px (原来是256px，约75%)
      height: 'h-24' // 96px (原来是128px，约75%)
    }
  },
  3: {
    id: 3,
    code: 'large',
    name: '大尺寸',
    type: 'color',
    className: 'bg-white border-gray-300 shadow-lg',
    titleColor: 'text-gray-800',
    contentColor: 'text-gray-600',
    isFree: true,
    size: {
      width: 'w-60', // 240px (原来是320px，约75%)
      height: 'h-60' // 240px (原来是320px，约75%)
    }
  },
  4: {
    id: 4,
    code: 'xlarge',
    name: '超大尺寸',
    type: 'color',
    className: 'bg-white border-gray-300 shadow-lg',
    titleColor: 'text-gray-800',
    contentColor: 'text-gray-600',
    isFree: true,
    size: {
      width: 'w-72', // 288px (原来是384px，约75%)
      height: 'h-60' // 240px (原来是320px，约75%)
    }
  },
  // 5: {
  //   id: 5,
  //   code: 'nature',
  //   name: '自然背景',
  //   type: 'image',
  //   backgroundImage: '/images/backgrounds/nature.jpg',
  //   className: 'border-gray-300 shadow-lg',
  //   titleColor: 'text-white',
  //   contentColor: 'text-gray-100',
  //   overlay: 'bg-black bg-opacity-30',
  //   isFree: false,
  //   size: {
  //     width: 'w-56', // 224px (原来是288px，约75%)
  //     height: 'h-36' // 144px (原来是192px，约75%)
  //   }
  // }
};

// 根据styleId获取样式信息
export function getStyleById(styleId: number): StyleConfig {
  return STYLE_MAP[styleId] || STYLE_MAP[1];
}

// 根据styleCode获取样式信息
export function getStyleByCode(styleCode: string): StyleConfig {
  const style = Object.values(STYLE_MAP).find(s => s.code === styleCode);
  return style || STYLE_MAP[1];
} 