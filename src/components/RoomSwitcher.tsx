'use client';

import { RoomType } from '@/types';

interface RoomSwitcherProps {
  activeRoom: RoomType;
  onSwitch: (room: RoomType) => void;
}

export default function RoomSwitcher({ activeRoom, onSwitch }: RoomSwitcherProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={() => onSwitch('roast')}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
          activeRoom === 'roast'
            ? 'bg-orange-500/15 border-orange-500/50 text-orange-400 shadow-lg shadow-orange-500/10'
            : 'bg-confess-brown border-confess-brown-light text-gray-500 hover:text-gray-300 hover:border-gray-600'
        }`}
      >
        <span className="text-lg">🔥</span>
        Roast Room
      </button>
      <button
        onClick={() => onSwitch('advice')}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
          activeRoom === 'advice'
            ? 'bg-blue-500/15 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/10'
            : 'bg-confess-brown border-confess-brown-light text-gray-500 hover:text-gray-300 hover:border-gray-600'
        }`}
      >
        <span className="text-lg">💙</span>
        Advice Center
      </button>
    </div>
  );
}
