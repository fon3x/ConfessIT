'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DailyPrompt } from '@/types';
import { getTodayPrompt } from '@/lib/storage';
import { ROOMS } from '@/lib/constants';
import ConfessionFeed from '@/components/ConfessionFeed';

export default function FeedPage() {
  const [todayPrompt, setTodayPrompt] = useState<DailyPrompt | null>(null);

  useEffect(() => {
    (async () => {
      const p = await getTodayPrompt();
      setTodayPrompt(p);
    })();
  }, []);

  return (
    <div>
      {/* Today's Prompt Banner */}
      {todayPrompt && (
        <div className="relative overflow-hidden rounded-2xl border border-c-gold/25 bg-gradient-to-br from-c-brown via-c-brown to-c-brown-light p-5 mb-6 group transition-all duration-300 hover:border-c-gold/40">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-c-gold/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-c-gold animate-pulse-gold" />
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-c-gold">
                  Today&apos;s Topic
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${ROOMS[todayPrompt.room].bgColor} ${ROOMS[todayPrompt.room].color}`}>
                  {ROOMS[todayPrompt.room].emoji} {ROOMS[todayPrompt.room].label}
                </span>
              </div>
              <Link
                href="/topics"
                className="text-xs text-c-gold hover:text-c-gold-bright transition-colors flex items-center gap-1 font-medium"
              >
                <span>View Topic Thread</span>
                <span>→</span>
              </Link>
            </div>

            <p className="text-lg md:text-xl font-serif text-white leading-relaxed mb-3">
              &ldquo;{todayPrompt.promptText}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[11px] text-gray-500">{todayPrompt.activeDate}</span>
              <div className="flex gap-2">
                <Link
                  href="/topics"
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors"
                >
                  Browse Archive
                </Link>
                <Link
                  href="/post"
                  className="px-3 py-1 rounded-lg bg-c-gold text-c-black text-xs font-semibold hover:bg-c-gold-bright transition-colors"
                >
                  Answer Prompt
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feed Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-serif text-c-gold">Live Confessions</h2>
          <p className="text-gray-400 text-xs">Filter by room or explore the universal stream.</p>
        </div>
      </div>

      {/* Main Stream */}
      <ConfessionFeed />
    </div>
  );
}
