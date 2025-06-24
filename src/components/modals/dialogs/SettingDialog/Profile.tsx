import React, { useEffect, useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '@/config/api';
import { UserProfile } from '@/types/user';
import { useApp } from '@/contexts/AppContext';
import { SlideToLogout, SlideToEdit } from '@/components/modals/ui/Slide';
import { SettingTabType } from '@/types/user';

export const Profile: React.FC<{ 
  onClose?: () => void;
  onTabChange?: (tab: SettingTabType | 'edit') => void;
}> = ({ onClose, onTabChange }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useApp();

  const handleLogout = async () => {
    try {
      await logout();
      onClose?.();
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };

  const handleEdit = async () => {
    // 切换到编辑页面
    onTabChange?.('edit');
    return true;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.USER.PROFILE, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-48">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">个人资料</h3>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="User avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900">{profile?.displayName || '未设置用户名'}</h4>
              <p className="text-sm text-gray-500">{profile?.email || '未设置邮箱'}</p>
              <p className="text-sm text-gray-500">当前便签数：{profile?.memoCount} / {profile?.plan.maxMemoCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              <p>解锁样式数：{profile?.unlockedStyleCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* <div>
          <SlideToEdit onEdit={handleEdit} />
        </div> */}
        
        <div>
          <SlideToLogout onLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
};
