'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { RoomType, Post } from '@/types';
import { ROOMS } from '@/lib/constants';
import { getAllPosts } from '@/lib/storage';
import RoomFilter from './RoomFilter';
import ConfessionCard from './ConfessionCard';

interface ConfessionFeedProps {
  promptId?: string;
  hideRoomFilter?: boolean;
  initialRoom?: RoomType | null;
}

export default function ConfessionFeed({
  promptId,
  hideRoomFilter = false,
  initialRoom = null,
}: ConfessionFeedProps) {
  const [room, setRoom] = useState<RoomType | null>(initialRoom);
  const [posts, setPosts] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAllPosts(room || undefined, promptId);
    setPosts(data);
    setLoading(false);
  }, [room, promptId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) load();
  }, [mounted, load]);

  if (!mounted || loading) {
    return (
      <div className="space-y-4 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#1A1512] border border-white/5 rounded-2xl h-36 animate-pulse" />
        ))}
      </div>
    );
  }

  const activeRoomMeta = room ? ROOMS[room] : null;

  return (
    <div>
      {!hideRoomFilter && (
        <div className="mb-6">
          <RoomFilter active={room} onChange={setRoom} />
        </div>
      )}

      {posts.length === 0 ? (
        /* Sleek Production Empty State Card */
        <div className="bg-[#1A1512] rounded-2xl border border-white/10 p-8 sm:p-12 text-center my-4 animate-fade-in shadow-xl relative overflow-hidden">
          {/* Subtle gold ambient glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#2A2320] border border-white/10 flex items-center justify-center mx-auto mb-4 text-3xl">
              {activeRoomMeta ? activeRoomMeta.emoji : '🕯️'}
            </div>

            <h3 className="text-xl font-serif text-white mb-2">
              {activeRoomMeta
                ? `No confessions in ${activeRoomMeta.label} yet`
                : 'No confessions yet'}
            </h3>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {activeRoomMeta
                ? `Be the first to anonymously share your story or thoughts in ${activeRoomMeta.label}.`
                : 'The feed is clean and ready. Be the first to break the silence completely anonymously.'}
            </p>

            <Link
              href={room ? `/post?room=${room}` : '/post'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] text-[#000000] text-sm font-semibold hover:bg-[#E8C84A] transition-all shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02]"
            >
              <span>✍️</span>
              <span>
                {activeRoomMeta
                  ? `Share first in ${activeRoomMeta.label}`
                  : 'Be the first to share'}
              </span>
              <span>→</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <ConfessionCard key={p.id} post={p} onUpdate={load} />
          ))}
        </div>
      )}
    </div>
  );
}
