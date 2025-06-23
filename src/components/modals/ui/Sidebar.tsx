import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div className={cn("w-40 border-r border-gray-200", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            "w-full px-5 py-2 text-left flex items-center gap-2 transition-colors text-base",
            activeTab === tab.id
              ? "bg-gray-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}; 