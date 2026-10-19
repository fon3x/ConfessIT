import { RoomMeta, RoomType } from '@/types';

export const ROOMS: Record<RoomType, RoomMeta> = {
  roast: {
    id: 'roast',
    label: 'Roast Room',
    emoji: '🔥',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/40',
    description: 'Edgy humor and sarcasm welcome',
  },
  advice: {
    id: 'advice',
    label: 'Advice Center',
    emoji: '💙',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/40',
    description: 'Supportive and constructive space',
  },
  confessional: {
    id: 'confessional',
    label: 'The Confessional',
    emoji: '🤫',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/40',
    description: 'Deep secrets and untold stories',
  },
  glitch: {
    id: 'glitch',
    label: 'Glitch & Theories',
    emoji: '👽',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/40',
    description: 'Bizarre occurrences and unexplained events',
  },
  hottakes: {
    id: 'hottakes',
    label: 'Hot Takes',
    emoji: '🌶️',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/40',
    description: 'Low-stakes controversial opinions',
  },
};

export const ROOM_LIST: RoomMeta[] = Object.values(ROOMS);
