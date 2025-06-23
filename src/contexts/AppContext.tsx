"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { useRouter } from 'next/navigation';
import { ModalManager } from '@/components/modals/ModalManager';
import { MemoResponse } from '@/types/memo';

export type ModalType = 'setting' | 'login' | 'register' | 'create-memo' | 'edit-memo' | 'none';

interface GlobalSettings {
  // pageZoom: number;
}

interface AppContextType {
  isLoggedIn: boolean;
  currentModal: ModalType | null;
  currentEditingMemo: MemoResponse | null;
  refreshTrigger: number;
  globalSettings: GlobalSettings;
  openModal: (modal: ModalType, memo?: MemoResponse) => void;
  closeModal: () => void;
  refreshMemos: () => void;
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;
  login: (email: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  fetchUserInfo: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentModal, setCurrentModal] = useState<ModalType | null>(null);
  const [currentEditingMemo, setCurrentEditingMemo] = useState<MemoResponse | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({ /* pageZoom: 1.0 */ });
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // 客户端初始化
  useEffect(() => {
    setIsClient(true);
    // 从localStorage读取设置
    // try {
    //   const saved = localStorage.getItem('actnow-settings');
    //   if (saved) {
    //     const parsed = JSON.parse(saved);
    //     setGlobalSettings(parsed);
    //   }
    // } catch {
    //   // 如果解析失败，使用默认值
    //   setGlobalSettings({ pageZoom: 1.0 });
    // }
  }, []);

  // 更新全局设置
  const updateGlobalSettings = useCallback((newSettings: Partial<GlobalSettings>) => {
    setGlobalSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // 只在客户端保存到localStorage
      // if (isClient) {
      //   localStorage.setItem('actnow-settings', JSON.stringify(updated));
      // }
      return updated;
    });
  }, [isClient]);

  // 在组件挂载时检查登录状态
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        try {
          const response = await fetch(API_ENDPOINTS.USER.ME, {
            method: 'GET',
            credentials: 'include',
          });
          setIsLoggedIn(response.ok);
        } catch {
          setIsLoggedIn(false);
          // 静默处理，不打印任何错误
        }
      } catch {
        // 再次静默处理，防止外层异常冒泡
      }
    };

    checkLoginStatus();
  }, []);

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USER.ME, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  const openModal = useCallback((modal: ModalType, memo?: MemoResponse) => {
    console.log('Opening modal:', modal, memo);
    setCurrentModal(modal);
    if (memo) {
      setCurrentEditingMemo(memo);
    }
  }, []);

  const closeModal = useCallback(() => {
    console.log('Closing modal');
    setCurrentModal(null);
    setCurrentEditingMemo(null);
  }, []);

  const refreshMemos = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // 登录
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Login failed: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            errorMessage = errorData.errors[0].message;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'object' && errorData !== null) {
            const firstKey = Object.keys(errorData)[0];
            if (firstKey) {
              errorMessage = errorData[firstKey];
            }
          }
        } catch {
          errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setIsLoggedIn(true);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  // 注册
  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Registration failed: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            errorMessage = errorData.errors[0].message;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'object' && errorData !== null) {
            const firstKey = Object.keys(errorData)[0];
            if (firstKey) {
              errorMessage = errorData[firstKey];
            }
          }
        } catch {
          errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }
      setIsLoggedIn(true);
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  // 退出登录
  const logout = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  // 键盘快捷键支持
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.ctrlKey || e.metaKey) {
  //       if (e.key === '=' || e.key === '+') {
  //         e.preventDefault();
  //         updateGlobalSettings({ 
  //           // pageZoom: Math.min(globalSettings.pageZoom + 0.1, 2) 
  //         });
  //       } else if (e.key === '-') {
  //         e.preventDefault();
  //         updateGlobalSettings({ 
  //           // pageZoom: Math.max(globalSettings.pageZoom - 0.1, 0.5) 
  //         });
  //       } else if (e.key === '0') {
  //         e.preventDefault();
  //         updateGlobalSettings({ /* pageZoom: 1.0 */ });
  //       }
  //     }
  //   };

  //   document.addEventListener('keydown', handleKeyDown);
  //   return () => document.removeEventListener('keydown', handleKeyDown);
  // }, [globalSettings.pageZoom, updateGlobalSettings]);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        currentModal,
        currentEditingMemo,
        refreshTrigger,
        globalSettings,
        openModal,
        closeModal,
        refreshMemos,
        updateGlobalSettings,
        login,
        register,
        logout,
        fetchUserInfo,
      }}
    >
      {children}
      <ModalManager />
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 