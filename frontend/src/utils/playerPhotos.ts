// Curated high-resolution sports portraits for MPL players with team colors and authentic athletes
export interface PlayerPhotoMeta {
  photoUrl: string;
  avatarSeed?: string;
}

// Diverse athletic portraits optimized with face detection crop
const ATHLETIC_PORTRAITS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&crop=faces&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&crop=faces&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=faces&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&crop=faces&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&crop=faces&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&crop=faces&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&crop=faces&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&crop=faces&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&crop=faces&w=400&h=400&q=80',
];

// Specific dedicated portraits for marquee players
const PLAYER_CUSTOM_PHOTOS: Record<string, string> = {
  // Prasad Rahate - Icon captain (MSK)
  '1': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=600&h=600&q=85',
  // Abhi Kilje - MR Captain
  '11': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=600&h=600&q=85',
  // Rushikesh Thasale - MT Captain
  '21': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&crop=faces&w=600&h=600&q=85',
  // Prafulla Mahadik - MW Captain
  '31': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&crop=faces&w=600&h=600&q=85',
  // Suraj Waje - MC Captain
  '41': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=faces&w=600&h=600&q=85',
  // Akshay Dilip Mahadik - MS Captain
  '50': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&crop=faces&w=600&h=600&q=85',
};

/**
 * Returns a high-definition portrait photo URL for any player.
 * Prefers a real uploaded photo when given one, then a custom photo if
 * available, otherwise maps deterministically from athletic portraits.
 */
export function getPlayerPhoto(
  playerId?: number | string | null,
  playerName?: string,
  realPhotoUrl?: string | null
): string {
  if (realPhotoUrl) {
    return realPhotoUrl;
  }

  const idStr = String(playerId || '1');
  if (PLAYER_CUSTOM_PHOTOS[idStr]) {
    return PLAYER_CUSTOM_PHOTOS[idStr];
  }

  // Deterministic hash based on ID or name
  let hash = 0;
  const key = idStr + (playerName || '');
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % ATHLETIC_PORTRAITS.length;
  }

  return ATHLETIC_PORTRAITS[Math.abs(hash)];
}
