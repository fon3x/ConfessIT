export type RoomType = 'roast' | 'advice' | 'confessional' | 'glitch' | 'hottakes';

export interface RoomMeta {
  id: RoomType;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export interface Post {
  id: string;
  content: string;
  room: RoomType;
  likes: number;
  comments: Comment[];
  createdAt: string;
  promptId?: string | null;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
}

export interface DailyPrompt {
  id: string;
  promptText: string;
  activeDate: string;
  room: RoomType;
  createdAt: string;
  replyCount?: number;
}
