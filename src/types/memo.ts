export interface MemoResponse {
  id: number;
  title: string;
  content: string;
  color: string;
  x: number;
  y: number;
  zindex: number;
  style: {
    id: number;
    code: string;
    name: string;
    imageUrl: string;
    isFree: boolean;
  };
  createdAt: string | null;
  updatedAt: string | null;
  isArchived: boolean;
}

export interface MemoCreate {
  title?: string;
  content: string;
  color?: string;
  x?: number;
  y?: number;
  zIndex?: number;
  styleCode?: string;
}

export interface MemoUpdate {
  title?: string;
  content?: string;
  color?: string;
  x?: number;
  y?: number;
  zIndex?: number;
  styleCode?: string;
  isArchived?: boolean;
}

export interface MemoPositionUpdate {
  x: number;
  y: number;
  zIndex: number;
} 