import React, { useEffect, useState } from 'react';
import { UserCircleIcon, CameraIcon, ArrowLeftIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from '@/config/api';
import { UserProfile } from '@/types/user';
import { useApp } from '@/contexts/AppContext';
import { SettingTabType } from '@/types/user';
import { SlideToSave } from '@/components/modals/ui/Slide';

export const Edit: React.FC<{ 
  onClose?: () => void;
  onTabChange?: (tab: SettingTabType | 'edit') => void;
}> = ({ onClose, onTabChange }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: ''
  });
  const { logout } = useApp();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/me/profile`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile(data);
        setFormData({
          displayName: data.displayName || '',
          email: data.email || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!profile) return false;
    
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      // 更新本地状态
      setProfile(prev => prev ? { ...prev, ...formData } : null);
      alert('个人信息更新成功！');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('更新失败，请重试');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload avatar');
      
      const data = await response.json();
      setProfile(prev => prev ? { ...prev, avatarUrl: data.avatarUrl } : null);
      alert('头像更新成功！');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('头像上传失败，请重试');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-48">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onTabChange?.('profile')}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-medium text-gray-900">编辑个人信息</h3>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
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
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
                <CameraIcon className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="text-sm text-gray-500">点击相机图标更换头像</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">用户名</label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="displayName"
                  className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="请输入用户名"
                  value={formData.displayName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-2">
        <SlideToSave onSave={handleSave} disabled={saving} />
      </div>
    </div>
  );
}; 