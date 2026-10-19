export const DAILY_PROMPTS = [
  "What is your biggest regret?",
  "What's a secret you've never told anyone?",
  "What would you do differently if you could start over?",
  "What's something you pretend to like but actually don't?",
  "What's the most embarrassing thing that's ever happened to you?",
  "If you could send a message to your past self, what would it say?",
  "What's a lie you've told that you still feel guilty about?",
  "What do you wish people understood about you?",
  "What's the hardest lesson life has taught you?",
  "What are you most afraid of that no one knows?",
  "What's something you did that you'll never forgive yourself for?",
  "If no one would judge you, what would you confess right now?",
  "What relationship do you regret losing the most?",
  "What's a dream you've given up on?",
  "What keeps you up at night?",
  "What's the most selfish thing you've ever done?",
  "What's a truth you've been avoiding?",
  "What do you envy most about someone else's life?",
  "What's the hardest goodbye you've ever had to say?",
  "What would you change about your life if you had zero fear?",
  "What's a compliment you received that you didn't believe?",
  "What's the worst advice you ever followed?",
  "What moment changed who you are forever?",
  "What do you wish you could say to someone who's no longer in your life?",
  "What mask do you wear every day?",
  "What's a boundary you wish you had set sooner?",
  "What's your most unpopular honest opinion?",
  "What's a promise you broke that still haunts you?",
  "What's the kindest thing a stranger ever did for you?",
  "What do you need to let go of?",
];

export function getDailyPrompt(): { id: string; text: string; date: string } {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % DAILY_PROMPTS.length;
  return {
    id: `prompt-${dayOfYear}`,
    text: DAILY_PROMPTS[index],
    date: today.toISOString().split('T')[0],
  };
}
