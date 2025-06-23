// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useApp } from '@/contexts/AppContext';

// interface ZoomProviderProps {
//   children: React.ReactNode;
// }

// export const ZoomProvider: React.FC<ZoomProviderProps> = ({ children }) => {
//   const { globalSettings } = useApp();
//   const [isClient, setIsClient] = useState(false);

//   // 确保只在客户端渲染
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // 在客户端渲染之前，不应用缩放
//   if (!isClient) {
//     return <>{children}</>;
//   }

//   // 如果缩放比例是1.0，不需要应用缩放
//   if (globalSettings.pageZoom === 1.0) {
//     return <>{children}</>;
//   }

//   return (
//     <div
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         transform: `scale(${globalSettings.pageZoom})`,
//         transformOrigin: 'top left',
//         pointerEvents: 'none'
//       }}
//     >
//       {children}
//     </div>
//   );
// }; 