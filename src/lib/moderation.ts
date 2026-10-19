import { RoomType } from '@/types';

// Severe slurs and hate speech patterns — always blocked in every room
const BLOCKED_PATTERNS: RegExp[] = [
  /\bn[i!1]gg?[aer3]+s?\b/i,
  /\bf[a@]gg?[o0]t+s?\b/i,
  /\bk[i!1]ke+s?\b/i,
  /\bsp[i!1]c+s?\b/i,
  /\bch[i!1]nk+s?\b/i,
  /\bw[e3]tb[a@]ck+s?\b/i,
  /\bcoon+s?\b/i,
  /\btr[a@]nn(y|ie)+s?\b/i,
  /\bret[a@]rd+s?\b/i,
  /\b(white\s*power|heil\s*hitler|sieg\s*heil)\b/i,
  /\b(kill\s*all|death\s*to)\s+(jews|blacks|muslims|gays|women|trans)/i,
  /\b(i('m|\s+am)\s+going\s+to\s+kill)\b/i,
  /\b(shoot\s+up|bomb\s+(the|a))\b/i,
];

// Advice Center + Confessional: also block harsh personal attacks
const SUPPORTIVE_EXTRA_PATTERNS: RegExp[] = [
  /\bstfu\b/i,
  /\bkys\b/i,
  /\bkill\s*your\s*self\b/i,
  /\byou('re|\s+are)\s+(an?\s+)?(idiot|moron|loser|pathetic)\b/i,
  /\bnobody\s+(loves|cares\s+about)\s+you\b/i,
];

const SUPPORTIVE_ROOMS: RoomType[] = ['advice', 'confessional'];

export interface ModerationResult {
  allowed: boolean;
  reason?: string;
}

export function moderateContent(
  text: string,
  room: RoomType
): ModerationResult {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return {
        allowed: false,
        reason:
          'Your post contains hate speech or slurs that are not permitted in any room.',
      };
    }
  }

  if (SUPPORTIVE_ROOMS.includes(room)) {
    for (const pattern of SUPPORTIVE_EXTRA_PATTERNS) {
      if (pattern.test(text)) {
        return {
          allowed: false,
          reason:
            'This room is a supportive space. Please rephrase without insults or hostility.',
        };
      }
    }
  }

  if (text.trim().length < 5) {
    return { allowed: false, reason: 'Your post must be at least 5 characters.' };
  }

  if (text.length > 2000) {
    return { allowed: false, reason: 'Your post exceeds the 2,000-character limit.' };
  }

  return { allowed: true };
}
