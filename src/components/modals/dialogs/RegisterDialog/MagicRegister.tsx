import React, { useState, useEffect, useId } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { useApp } from '@/contexts/AppContext';

interface MagicRegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export const MagicRegister: React.FC<MagicRegisterProps> = ({ isOpen, onClose, onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { fetchUserInfo } = useApp();
  const magicEmailId = useId();
  const magicCodeId = useId();

  // 发送验证码
  const handleSendCode = async () => {
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.MAGIC_REQUEST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      if (res.ok) {
        setStep('verify');
        setCodeSent(true);
        setCountdown(60); // 60秒倒计时
      } else {
        const errorMsg = await res.text();
        setError(errorMsg);
      }
    } catch (e) {
      setError('发送失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.MAGIC_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (data.token) {
        await fetchUserInfo();
        onClose();
      } else {
        setError(data.error || '注册失败');
      }
    } catch (e) {
      setError('注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">验证码注册</h2>
          <p className="mt-2 text-sm text-gray-600">请输入邮箱获取验证码</p>
        </div>
        {step === 'input' && (
          <div className="space-y-4">
            <div>
              <label htmlFor={magicEmailId} className="block text-sm font-medium text-gray-700">
                邮箱地址
              </label>
            </div>
            <input
              id={magicEmailId}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="请输入邮箱"
              required
              autoComplete="email"
            />
            <button
              onClick={handleSendCode}
              disabled={isLoading || !email}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md disabled:opacity-50"
            >
              {isLoading ? '发送中...' : '获取验证码'}
            </button>
            <div className="text-center">
              <button type="button" onClick={onLoginClick} className="text-sm text-indigo-600 hover:text-indigo-500">已有账号？立即登录</button>
            </div>
          </div>
        )}
        {step === 'verify' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <label htmlFor={magicCodeId} className="block text-sm font-medium text-gray-700">
              请输入验证码
            </label>
            <div className="mt-1">
              <input
                id={magicCodeId}
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="请输入验证码"
                required
                autoComplete="one-time-code"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !code}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md disabled:opacity-50"
            >
              {isLoading ? '注册中...' : '注册'}
            </button>
            <button
              type="button"
              onClick={handleSendCode}
              disabled={isLoading || countdown > 0}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md disabled:opacity-50 mt-2"
            >
              {countdown > 0 ? `${countdown}秒后可重新发送` : '重新发送验证码'}
            </button>
            <div className="text-center">
              <button type="button" onClick={() => setStep('input')} className="text-sm text-gray-500">返回修改邮箱</button>
            </div>
          </form>
        )}
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
        {codeSent && (
          <div className="rounded-md bg-green-50 p-4 mt-2">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">验证码已发送，请查收邮箱</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 