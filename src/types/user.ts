import { Plan } from './plan';
import { MemoResponse } from './memo';

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  createdAt: string; // ISO date string
  plan: Plan;
  memoCount: number;
  unlockedStyleCount: number;
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