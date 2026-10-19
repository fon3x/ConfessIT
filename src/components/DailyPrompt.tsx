'use client';

import { getDailyPrompt } from '@/lib/prompts';

export default function DailyPrompt() {
  const prompt = getDailyPrompt();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-confess-gold/30 bg-gradient-to-br from-confess-brown via-confess-brown to-confess-brown-light p-6 mb-6">
      {/* Decorative glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-confess-gold/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-confess-gold/5 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-confess-gold text-lg">✦</span>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-confess-gold/70">
            Today&apos;s Prompt
          </span>
        </div>
        <p className="text-xl md:text-2xl font-serif text-white leading-relaxed">
          &ldquo;{prompt.text}&rdquo;
        </p>
        <p className="text-xs text-gray-500 mt-3">{prompt.date}</p>
      </div>
    </div>
  );
}
