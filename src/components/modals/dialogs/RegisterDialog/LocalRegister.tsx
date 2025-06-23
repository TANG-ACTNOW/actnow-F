'use client';
import React, { useState, useId } from 'react';
import { useApp } from '@/contexts/AppContext';

interface LocalRegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export function LocalRegister({ isOpen, onClose, onLoginClick }: LocalRegisterProps) {
  const { register, fetchUserInfo } = useApp();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 表单验证
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('请填写所有必填字段');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      await fetchUserInfo();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : '注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 用户名输入 */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            用户名
          </label>
          <div className="mt-1">
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </div>
        </div>

        {/* 邮箱输入 */}
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700">
            邮箱
          </label>
          <div className="mt-1">
            <input
              id={emailId}
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="请输入邮箱"
              autoComplete="email"
            />
          </div>
        </div>

        {/* 密码输入 */}
        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700">
            密码
          </label>
          <div className="mt-1">
            <input
              id={passwordId}
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="请输入密码"
              autoComplete="new-password"
            />
          </div>
        </div>

        {/* 确认密码输入 */}
        <div>
          <label htmlFor={confirmPasswordId} className="block text-sm font-medium text-gray-700">
            确认密码
          </label>
          <div className="mt-1">
            <input
              id={confirmPasswordId}
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="请再次输入密码"
              autoComplete="new-password"
            />
          </div>
        </div>

        {/* 错误信息显示 */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 注册按钮 */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? '注册中...' : '注册'}
          </button>
        </div>

        {/* 登录链接 */}
        <div className="text-sm text-center">
          <span className="text-gray-600">已有账号？</span>
          <button
            type="button"
            onClick={onLoginClick}
            className="ml-1 text-indigo-600 hover:text-indigo-500"
          >
            立即登录
          </button>
        </div>
      </form>
    </div>
  );
} 