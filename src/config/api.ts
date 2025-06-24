// API基础URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// API端点配置
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    // Magic Link 验证码登录/注册相关
    MAGIC_REQUEST: `${API_BASE_URL}/api/auth/magic-link/request`,
    MAGIC_VERIFY: `${API_BASE_URL}/api/auth/magic-link/verify`,
    MAGIC_REGISTER: `${API_BASE_URL}/api/auth/magic-link/register`,
  },
  // 用户相关
  USER: {
    ME: `${API_BASE_URL}/api/users/me`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/users/${id}`,
    BY_USERNAME: (username: string) => `${API_BASE_URL}/api/users/username/${username}`,
    // 用户资料相关
    PROFILE: `${API_BASE_URL}/api/users/me/profile`,
    AVATAR: `${API_BASE_URL}/api/users/me/avatar`,
  },
  // 首页相关
  HOME: {
    INDEX: `${API_BASE_URL}/api/home`,
  },
  // 便签相关
  MEMO: {
    CREATE: `${API_BASE_URL}/api/memos`,
    BY_ID: (id: number) => `${API_BASE_URL}/api/memos/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/memos/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/memos/${id}`,
    UPDATE_POSITION: (id: number) => `${API_BASE_URL}/api/memos/${id}/position`,
  },
  // 其他API端点...
}; 