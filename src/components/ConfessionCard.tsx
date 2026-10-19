'use client';

import { useState } from 'react';
import { Post } from '@/types';
import { ROOMS } from '@/lib/constants';
import { likePost, addComment } from '@/lib/storage';
import { moderateContent } from '@/lib/moderation';

interface ConfessionCardProps {
  post: Post;
  onUpdate: () => void;
}

export default function ConfessionCard({ post, onUpdate }: ConfessionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const room = ROOMS[post.room];
  const isLong = post.content.length > 280;
  const displayContent = isLong && !expanded ? post.content.slice(0, 280) + '...' : post.content;

  const handleLike = async () => {
    if (liked) return;
    await likePost(post.id);
    setLiked(true);
    onUpdate();
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setError('');
    const mod = moderateContent(commentText, post.room);
    if (!mod.allowed) {
      setError(mod.reason || 'Blocked by moderation.');
      return;
    }
    await addComment(post.id, commentText.trim());
    setCommentText('');
    onUpdate();
  };

  const handleShare = async () => {
    const text = `ConfessIT: "${post.content.substring(0, 100)}..."\n\nRead more at ConfessIT`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const timeAgo = (d: string) => {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(s / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <article className="bg-c-brown rounded-2xl border border-white/5 p-5 hover:border-c-gold/10 transition-all duration-300 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${room.bgColor} flex items-center justify-center`}>
            <span className="text-sm">{room.emoji}</span>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400">Anonymous</span>
            <span className="text-xs text-gray-600 ml-2">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${room.bgColor} ${room.color}`}>
          {room.label}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-200 leading-relaxed mb-1 text-[15px] whitespace-pre-wrap">
        {displayContent}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-c-gold/70 hover:text-c-gold text-xs font-medium mb-3 transition-colors"
        >
          {expanded ? 'Show less' : '[more]'}
        </button>
      )}

      {/* Actions */}
      <div className="flex items-center gap-5 pt-3 border-t border-white/5">
        <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm transition-all ${liked ? 'text-c-gold' : 'text-gray-500 hover:text-c-gold'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {post.likes + (liked ? 1 : 0)}
        </button>

        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-400 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {post.comments.length}
        </button>

        <button onClick={handleShare} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-400 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
          {post.comments.map((c) => (
            <div key={c.id} className="bg-c-black/40 rounded-xl p-3 text-sm text-gray-300">
              <p>{c.content}</p>
              <span className="text-[11px] text-gray-600 mt-1 block">{timeAgo(c.createdAt)}</span>
            </div>
          ))}
          {error && <p className="text-red-400 text-xs bg-red-400/10 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              placeholder="Write an anonymous reply..."
              style={{ backgroundColor: '#1A1512', color: '#FFFFFF' }}
              className="flex-1 bg-[#1A1512] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 border border-white/15 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-colors"
            />
            <button
              onClick={handleComment}
              className="px-4 py-2.5 bg-[#D4AF37] text-[#000000] font-semibold rounded-xl text-sm hover:bg-[#E8C84A] transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
