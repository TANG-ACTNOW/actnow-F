'use client';
import React, { useState } from 'react';
import { UserCircleIcon, CreditCardIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Sidebar } from '@/components/modals/ui/Sidebar';
import { Profile } from '@/components/modals/dialogs/SettingDialog/Profile';
import { Plan } from '@/components/modals/dialogs/SettingDialog/Plan';
import { Edit } from '@/components/modals/dialogs/SettingDialog/Edit';
import { General } from '@/components/modals/dialogs/SettingDialog/General';
import { SettingTabType } from '@/types/user';

interface SettingDialogProps {
  onClose: () => void;
}

export function SettingDialog({ onClose }: SettingDialogProps) {
  const [activeTab, setActiveTab] = useState<SettingTabType>('profile');
  const [showEdit, setShowEdit] = useState(false);

  const tabs = [
    {
      id: 'profile',
      label: '个人资料',
      icon: <UserCircleIcon className="w-5 h-5" />
    },
    {
      id: 'general',
      label: '通用设置',
      icon: <Cog6ToothIcon className="w-5 h-5" />
    },
    {
      id: 'plan',
      label: '订阅计划',
      icon: <CreditCardIcon className="w-5 h-5" />
    }
  ];

  const renderContent = () => {
    if (showEdit) {
      return <Edit onClose={onClose} onTabChange={(tab) => {
        if (tab === 'profile') {
          setShowEdit(false);
        }
      }} />;
    }

    switch (activeTab) {
      case 'profile':
        return <Profile onClose={onClose} onTabChange={(tab) => {
          if (tab === 'edit') {
            setShowEdit(true);
          }
        }} />;
      case 'general':
        return <General />;
      case 'plan':
        return <Plan />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      {!showEdit && (
        <Sidebar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as SettingTabType)}
          className="h-full"
        />
      )}
      <div className={`${showEdit ? 'w-full' : 'flex-1'} p-6 overflow-y-auto`}>
        {renderContent()}
      </div>
    </div>
  );
} 