import { Post, Comment, RoomType, DailyPrompt } from '@/types';
import { getSupabase } from './supabase';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Clean production key to guarantee an empty, clean initial state
const POSTS_KEY = 'confessit_posts_production_v1';
const PROMPTS_KEY = 'confessit_prompts_production_v1';

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota limits
  }
}

function daysFromNow(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

// ─────────────────────────────────────────────
// DAILY PROMPTS ARCHIVE (TOPICS ONLY, ZERO POSTS)
// ─────────────────────────────────────────────
export const MOCK_DAILY_PROMPTS: DailyPrompt[] = [
  {
    id: 'topic-today',
    promptText: 'What is your biggest regret that nobody in your life knows about?',
    activeDate: daysFromNow(0),
    room: 'confessional',
    createdAt: new Date().toISOString(),
    replyCount: 0,
  },
  {
    id: 'topic-yesterday',
    promptText: 'Worst first date you have ever been on — spare no details.',
    activeDate: daysFromNow(-1),
    room: 'roast',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    replyCount: 0,
  },
  {
    id: 'topic-day-2',
    promptText: 'What is a deep secret you have actively kept from your family?',
    activeDate: daysFromNow(-2),
    room: 'confessional',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    replyCount: 0,
  },
  {
    id: 'topic-day-3',
    promptText: 'Describe an unexplainable coincidence or "glitch in the matrix" you witnessed.',
    activeDate: daysFromNow(-3),
    room: 'glitch',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    replyCount: 0,
  },
  {
    id: 'topic-day-4',
    promptText: 'What is your most controversial, low-stakes food opinion?',
    activeDate: daysFromNow(-4),
    room: 'hottakes',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    replyCount: 0,
  },
  {
    id: 'topic-day-5',
    promptText: 'What was the single best piece of life advice you arrogantly ignored?',
    activeDate: daysFromNow(-5),
    room: 'advice',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    replyCount: 0,
  },
  {
    id: 'topic-day-6',
    promptText: 'What is a small lie you told that completely spiralled out of control?',
    activeDate: daysFromNow(-6),
    room: 'confessional',
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    replyCount: 0,
  },
  {
    id: 'topic-day-7',
    promptText: 'Roast your own cooking or adulting skills in one sentence.',
    activeDate: daysFromNow(-7),
    room: 'roast',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    replyCount: 0,
  },
];

export async function getDailyPrompts(): Promise<DailyPrompt[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb
        .from('daily_prompts')
        .select('*')
        .order('active_date', { ascending: false });
      if (data && data.length > 0) {
        return data.map((r: Record<string, unknown>) => ({
          id: r.id as string,
          promptText: r.prompt_text as string,
          activeDate: r.active_date as string,
          room: r.room as RoomType,
          createdAt: r.created_at as string,
          replyCount: (r.reply_count as number) || 0,
        }));
      }
    } catch {
      // Fallback
    }
  }

  let prompts = lsGet<DailyPrompt[]>(PROMPTS_KEY, []);
  if (!prompts || prompts.length === 0) {
    prompts = MOCK_DAILY_PROMPTS;
    lsSet(PROMPTS_KEY, prompts);
  }
  return prompts;
}

export async function getTodayPrompt(): Promise<DailyPrompt | null> {
  const all = await getDailyPrompts();
  const today = daysFromNow(0);
  return all.find((p) => p.activeDate === today) || all[0] || null;
}

// ─────────────────────────────────────────────
// POSTS DATA (CLEAN INITIAL STATE: NO DEMO POSTS)
// ─────────────────────────────────────────────
export async function getAllPosts(room?: RoomType, promptId?: string): Promise<Post[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      let query = sb.from('posts').select(`
        id, content, room, likes, created_at, prompt_id,
        comments ( id, content, created_at, post_id )
      `).order('created_at', { ascending: false });
      if (room) query = query.eq('room', room);
      if (promptId) query = query.eq('prompt_id', promptId);
      const { data } = await query;
      if (data) {
        return data.map((r: Record<string, unknown>) => ({
          id: r.id as string,
          content: r.content as string,
          room: r.room as RoomType,
          likes: r.likes as number,
          promptId: (r.prompt_id as string) || null,
          createdAt: r.created_at as string,
          comments: Array.isArray(r.comments)
            ? (r.comments as Record<string, unknown>[]).map((c) => ({
                id: c.id as string,
                postId: c.post_id as string,
                content: c.content as string,
                createdAt: c.created_at as string,
              }))
            : [],
        }));
      }
    } catch {
      // Fallback
    }
  }

  // Clean initial state: no sample demo posts
  const posts = lsGet<Post[]>(POSTS_KEY, []);
  let filtered = [...posts];
  if (room) filtered = filtered.filter((p) => p.room === room);
  if (promptId) filtered = filtered.filter((p) => p.promptId === promptId);
  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addPost(content: string, room: RoomType, promptId?: string): Promise<Post> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('posts').insert({
        content,
        room,
        prompt_id: promptId || null,
      }).select().single();
      if (data && !error) {
        return {
          id: data.id,
          content: data.content,
          room: data.room,
          likes: data.likes,
          promptId: data.prompt_id,
          createdAt: data.created_at,
          comments: [],
        };
      }
    } catch {
      // Fallback
    }
  }

  // LocalStorage clean array
  const posts = lsGet<Post[]>(POSTS_KEY, []);
  const newPost: Post = {
    id: generateId(),
    content,
    room,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    promptId: promptId || null,
  };
  posts.unshift(newPost);
  lsSet(POSTS_KEY, posts);

  // If tied to a prompt, increment its replyCount
  if (promptId) {
    const prompts = lsGet<DailyPrompt[]>(PROMPTS_KEY, MOCK_DAILY_PROMPTS);
    const target = prompts.find((p) => p.id === promptId);
    if (target) {
      target.replyCount = (target.replyCount || 0) + 1;
      lsSet(PROMPTS_KEY, prompts);
    }
  }

  return newPost;
}

export async function likePost(id: string): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.rpc('increment_likes', { post_id: id });
      return;
    } catch {
      // Fallback
    }
  }
  const posts = lsGet<Post[]>(POSTS_KEY, []);
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.likes += 1;
    lsSet(POSTS_KEY, posts);
  }
}

export async function addComment(postId: string, content: string): Promise<Comment | null> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from('comments').insert({ post_id: postId, content }).select().single();
      if (data) {
        return { id: data.id, postId: data.post_id, content: data.content, createdAt: data.created_at };
      }
    } catch {
      // Fallback
    }
  }

  const posts = lsGet<Post[]>(POSTS_KEY, []);
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;
  const comment: Comment = {
    id: generateId(),
    postId,
    content,
    createdAt: new Date().toISOString(),
  };
  post.comments.push(comment);
  lsSet(POSTS_KEY, posts);
  return comment;
}
