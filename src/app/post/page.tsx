'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoomType, DailyPrompt } from '@/types';
import { addPost, getTodayPrompt } from '@/lib/storage';
import { moderateContent } from '@/lib/moderation';
import { ROOM_LIST, ROOMS } from '@/lib/constants';

export default function PostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [room, setRoom] = useState<RoomType>('confessional');
  const [usePrompt, setUsePrompt] = useState(false);
  const [todayPrompt, setTodayPrompt] = useState<DailyPrompt | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check URL parameters if navigating from Daily Topics reply button
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryRoom = params.get('room') as RoomType | null;
      const queryPromptText = params.get('promptText');
      if (queryRoom && ROOMS[queryRoom]) {
        setRoom(queryRoom);
      }
      if (queryPromptText) {
        setUsePrompt(true);
      }
    }

    (async () => {
      const p = await getTodayPrompt();
      setTodayPrompt(p);
    })();
  }, []);

  const handleSelectRoom = (selectedRoom: RoomType) => {
    setRoom(selectedRoom);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const modResult = moderateContent(content, room);
    if (!modResult.allowed) {
      setError(modResult.reason || 'Content blocked by moderation filter.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addPost(
        content.trim(),
        room,
        usePrompt && todayPrompt ? todayPrompt.id : undefined
      );
      setSuccess(true);
      setContent('');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch {
      setError('An error occurred while publishing your confession. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-4 border border-[#D4AF37]/40">
          <span className="text-3xl text-[#D4AF37]">✓</span>
        </div>
        <h2 className="text-2xl font-serif text-[#D4AF37] mb-2">
          Confession Published
        </h2>
        <p className="text-gray-400 text-sm max-w-sm">
          Your confession is live and completely anonymous. Redirecting to the feed...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-[#D4AF37] mb-1">
          Share Your Story
        </h2>
        <p className="text-gray-400 text-sm">
          Completely anonymous. No account, no IP tracking, pure expression.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Daily Topic Option Banner */}
        {todayPrompt && (
          <button
            type="button"
            onClick={() => setUsePrompt(!usePrompt)}
            className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 ${
              usePrompt
                ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10 shadow-lg shadow-[#D4AF37]/10'
                : 'border-white/10 bg-[#1A1512] hover:border-[#D4AF37]/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-medium flex items-center gap-1.5">
                <span>✦</span> Today&apos;s Active Topic
              </span>
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-colors ${
                  usePrompt
                    ? 'bg-[#D4AF37] text-[#000000] font-semibold'
                    : 'bg-white/5 text-gray-400'
                }`}
              >
                {usePrompt ? '✓ Answering Prompt' : 'Tap to answer'}
              </span>
            </div>
            <p className="text-sm font-serif text-gray-200">
              &ldquo;{todayPrompt.promptText}&rdquo;
            </p>
          </button>
        )}

        {/* 5 Rooms Selector with Proper Active State & Click Handlers */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs uppercase tracking-wider text-gray-400 font-medium">
              Select Room / Mode
            </label>
            <span className="text-xs text-[#D4AF37]">
              Current: <strong className="font-semibold">{ROOMS[room].label}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup">
            {ROOM_LIST.map((r) => {
              const isSelected = room === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectRoom(r.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#2A2320] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15 ring-2 ring-[#D4AF37]/50'
                      : 'bg-[#1A1512] border-white/10 hover:border-white/25 hover:bg-[#201A16]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg leading-none">{r.emoji}</span>
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          isSelected ? 'text-[#D4AF37]' : 'text-gray-200'
                        }`}
                      >
                        {r.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-snug">
                      {r.description}
                    </p>
                  </div>

                  {/* Radio Indicator */}
                  <div className="pt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#000000] scale-105'
                          : 'border border-gray-600 bg-black/40 text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Input Area: Explicit Dark Background, White Text & Visible Placeholder */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs uppercase tracking-wider text-gray-400 font-medium">
              Your Confession / Story
            </label>
            <span
              className={`text-xs ${
                content.length > 1900 ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              {content.length} / 2,000
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={7}
            maxLength={2000}
            placeholder={
              usePrompt && todayPrompt
                ? `Anonymously answer: "${todayPrompt.promptText}"`
                : `Pour your heart out into ${ROOMS[room].label}...`
            }
            style={{
              backgroundColor: '#1A1512',
              color: '#FFFFFF',
            }}
            className="w-full bg-[#1A1512] text-white placeholder-gray-400 rounded-2xl p-4 text-[15px] border border-white/15 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all resize-none leading-relaxed block shadow-inner"
          />

          <div className="flex justify-between items-center mt-1.5 text-[11px] text-gray-400">
            <span>Minimum 5 characters</span>
            <span className="text-gray-400">
              Filtered for: <span className="text-gray-300">{ROOMS[room].label} rules</span>
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-start gap-2.5 animate-fade-in">
            <span className="text-red-400 text-sm mt-0.5">⚠</span>
            <p className="text-red-300 text-xs leading-relaxed">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={content.trim().length < 5 || isSubmitting}
          className="w-full py-4 bg-[#D4AF37] text-[#000000] font-semibold rounded-xl text-sm hover:bg-[#E8C84A] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#D4AF37]/20 disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Publishing...</span>
          ) : (
            <>
              <span>Post Anonymously</span>
              <span>→</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-gray-500">
          🔒 Zero tracking cookies or identity logs. Protected by automated moderation.
        </p>
      </form>
    </div>
  );
}
