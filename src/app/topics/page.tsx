'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DailyPrompt } from '@/types';
import { ROOMS } from '@/lib/constants';
import { getDailyPrompts, MOCK_DAILY_PROMPTS } from '@/lib/storage';
import CountdownTimer from '@/components/CountdownTimer';
import ConfessionFeed from '@/components/ConfessionFeed';

export default function TopicsPage() {
  // Initialize with MOCK_DAILY_PROMPTS so the tab is never blank even before hydration
  const [prompts, setPrompts] = useState<DailyPrompt[]>(MOCK_DAILY_PROMPTS);
  const [selectedPrompt, setSelectedPrompt] = useState<DailyPrompt | null>(MOCK_DAILY_PROMPTS[0]);

  useEffect(() => {
    (async () => {
      const data = await getDailyPrompts();
      if (data && data.length > 0) {
        setPrompts(data);
        setSelectedPrompt((prev) => prev || data[0]);
      }
    })();
  }, []);

  const todayPrompt = prompts[0] || MOCK_DAILY_PROMPTS[0];
  const pastPrompts = prompts.slice(1);

  const formatDateLabel = (dateStr: string, index: number): string => {
    if (index === 0) return 'Yesterday';
    if (index === 1) return '2 days ago';
    if (index === 2) return '3 days ago';
    if (index < 7) return `${index + 1} days ago`;
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-serif text-[#D4AF37] mb-1">
            Daily Topics
          </h2>
          <p className="text-gray-400 text-sm">
            Past and present prompts. Browse community answers or submit your own.
          </p>
        </div>
        <CountdownTimer />
      </div>

      {/* Today's Active Prompt — Hero Card */}
      {todayPrompt && (
        <div
          className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
            selectedPrompt?.id === todayPrompt.id
              ? 'border-[#D4AF37]/50 bg-gradient-to-br from-[#1A1512] via-[#201A16] to-[#2A2320] shadow-xl shadow-[#D4AF37]/10'
              : 'border-white/10 bg-[#1A1512] hover:border-[#D4AF37]/30'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse-gold" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Today&apos;s Active Topic
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                    ROOMS[todayPrompt.room].bgColor
                  } ${ROOMS[todayPrompt.room].color}`}
                >
                  {ROOMS[todayPrompt.room].emoji} {ROOMS[todayPrompt.room].label}
                </span>
              </div>

              <span className="text-xs text-gray-400 font-medium">
                💬 {todayPrompt.replyCount || 142} confessions
              </span>
            </div>

            <p className="text-xl md:text-2xl font-serif text-white leading-relaxed mb-4">
              &ldquo;{todayPrompt.promptText}&rdquo;
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <span className="text-xs text-gray-400">
                Active date: <strong className="text-gray-300 font-normal">{todayPrompt.activeDate}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPrompt(todayPrompt)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedPrompt?.id === todayPrompt.id
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {selectedPrompt?.id === todayPrompt.id ? 'Viewing Thread' : 'View Thread'}
                </button>

                <Link
                  href={`/post?room=${todayPrompt.room}&prompt=${todayPrompt.id}&promptText=${encodeURIComponent(
                    todayPrompt.promptText
                  )}`}
                  className="px-4 py-1.5 rounded-xl bg-[#D4AF37] text-[#000000] text-xs font-semibold hover:bg-[#E8C84A] transition-colors shadow-md shadow-[#D4AF37]/20 flex items-center gap-1.5"
                >
                  <span>✍️</span>
                  <span>Answer Topic</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Past Daily Topics Archive */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Topic Archive
          </h3>
          <span className="text-xs text-gray-500">
            {pastPrompts.length} past prompts available
          </span>
        </div>

        <div className="space-y-2.5">
          {pastPrompts.map((prompt, index) => {
            const rm = ROOMS[prompt.room];
            const isSelected = selectedPrompt?.id === prompt.id;

            return (
              <div
                key={prompt.id}
                className={`w-full rounded-xl border p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                  isSelected
                    ? 'border-[#D4AF37] bg-[#221C18] shadow-md ring-1 ring-[#D4AF37]/30'
                    : 'border-white/10 bg-[#1A1512] hover:border-white/20 hover:bg-[#1E1815]'
                }`}
              >
                {/* Topic Info & Click-to-Select */}
                <div
                  onClick={() => setSelectedPrompt(prompt)}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base leading-none">{rm.emoji}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${rm.bgColor} ${rm.color}`}
                    >
                      {rm.label}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      • {formatDateLabel(prompt.activeDate, index)}
                    </span>
                  </div>

                  <p
                    className={`text-[15px] font-medium leading-snug ${
                      isSelected ? 'text-[#D4AF37]' : 'text-gray-200'
                    }`}
                  >
                    &ldquo;{prompt.promptText}&rdquo;
                  </p>
                </div>

                {/* Meta & Action Buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                    💬 {prompt.replyCount || 85} replies
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPrompt(prompt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-white/15 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {isSelected ? 'Viewing' : 'Thread'}
                    </button>

                    <Link
                      href={`/post?room=${prompt.room}&prompt=${prompt.id}&promptText=${encodeURIComponent(
                        prompt.promptText
                      )}`}
                      className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold hover:bg-[#D4AF37] hover:text-[#000000] transition-all whitespace-nowrap flex items-center gap-1"
                    >
                      <span>Reply</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Topic Discussion Thread */}
      {selectedPrompt && (
        <div className="pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[#D4AF37] text-lg">✦</span>
              <h3 className="text-base font-serif text-white">
                Responses to &ldquo;{selectedPrompt.promptText}&rdquo;
              </h3>
            </div>

            <Link
              href={`/post?room=${selectedPrompt.room}&prompt=${selectedPrompt.id}&promptText=${encodeURIComponent(
                selectedPrompt.promptText
              )}`}
              className="text-xs text-[#D4AF37] hover:underline font-medium flex items-center gap-1 self-start sm:self-auto"
            >
              <span>+ Add your confession to this topic</span>
            </Link>
          </div>

          <ConfessionFeed promptId={selectedPrompt.id} hideRoomFilter />
        </div>
      )}
    </div>
  );
}
