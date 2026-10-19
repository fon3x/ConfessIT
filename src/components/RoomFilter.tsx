'use client';

import { useRef, useEffect } from 'react';
import { RoomType } from '@/types';
import { ROOM_LIST } from '@/lib/constants';

interface RoomFilterProps {
  active: RoomType | null;
  onChange: (room: RoomType | null) => void;
}

export default function RoomFilter({ active, onChange }: RoomFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active button into view on mount or change
  useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [active]);

  const handleSelect = (room: RoomType | null, e: React.MouseEvent<HTMLButtonElement>) => {
    onChange(room);
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-2 overflow-x-auto scrollbar-none no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth touch-pan-x"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* "All Rooms" Button */}
      <button
        ref={active === null ? activeBtnRef : null}
        type="button"
        onClick={(e) => handleSelect(null, e)}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer flex-shrink-0 select-none ${
          active === null
            ? 'bg-[#D4AF37] text-[#000000] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-[1.02]'
            : 'bg-[#1A1512] border-white/10 text-gray-400 hover:text-white hover:border-white/25 hover:bg-[#201A16]'
        }`}
      >
        <span>🌐</span>
        <span>All Rooms</span>
      </button>

      {/* 5 Room Mode Buttons */}
      {ROOM_LIST.map((room) => {
        const isCurrent = active === room.id;
        return (
          <button
            key={room.id}
            ref={isCurrent ? activeBtnRef : null}
            type="button"
            onClick={(e) => handleSelect(room.id, e)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer flex-shrink-0 select-none ${
              isCurrent
                ? `${room.bgColor} ${room.borderColor} ${room.color} shadow-lg ring-1 ring-current scale-[1.02]`
                : 'bg-[#1A1512] border-white/10 text-gray-400 hover:text-white hover:border-white/25 hover:bg-[#201A16]'
            }`}
          >
            <span className="text-sm leading-none">{room.emoji}</span>
            <span>{room.label}</span>
          </button>
        );
      })}
    </div>
  );
}
