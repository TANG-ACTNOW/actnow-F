import { Plan } from './plan';
import { MemoResponse } from './memo';


export interface UserResponse {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister {
  username: string;
  password: string;
  email: string;
}

export interface UserHome {
  user: UserResponse;
  memos: MemoResponse[];
}

export interface HomeUser {
  id: number;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  provider: string;
  createdAt: string;
  lastLogin: string;
  loginIp: string | null;
  plan: {
    id: number;
    name: string;
    maxMemoCount: number;
    description: string;
  };
  memoCount: number;
  unlockedStyleCount: number;
}

export interface HomeResponse {
  user: HomeUser;
  memos: MemoResponse[];
}

// Dialog related types
export interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange?: (isOpen: boolean) => void;
}

export interface LoginDialogProps extends BaseDialogProps {
  onSuccess?: (token: string) => void;
  onRegisterClick: () => void;
}

export interface RegisterDialogProps extends BaseDialogProps {
  onSuccess?: (token: string) => void;
  onLoginClick: () => void;
}

// SettingDialog related types
export type SettingTabType = 'profile' | 'plan' | 'status' | 'general';
export interface SettingDialogProps extends BaseDialogProps {
  defaultTab?: SettingTabType;
}

export interface UserProfile {
  displayName: string;
  email: string;
  avatarUrl: string | null;
  provider: string;
  createdAt: string;
  plan: {
    id: number;
    name: string;
    maxMemoCount: number;
    description: string;
  };
  memoCount: number;
  unlockedStyleCount: number;
} 