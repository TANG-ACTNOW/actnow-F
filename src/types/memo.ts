import { Style } from './style';

export interface MemoResponse {
  id: number;
  title: string;
  content: string;
  x: number;
  y: number;
  zIndex: number;
  style: Style;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isArchived: boolean;
}

export interface MemoCreate {
  title?: string;
  content: string;
  x?: number;
  y?: number;
  zIndex?: number;
  styleCode?: string;
}

export interface MemoUpdate {
  title?: string;
  content?: string;
  x?: number;
  y?: number;
  zIndex?: number;
  styleCode?: string;
  isArchived?: boolean;
} 