import { ALL_PLAYERS_DATA } from '../data/playersData';
import type { PlayerProfileData } from '../data/playersData';

export interface StoredTeam {
  name: string;
  slug: string;
  short_code: string;
  captain: string;
  players_count: number;
  home_ground: string;
  color: string;
  description?: string;
}

export interface StoredMatch {
  id: number;
  match_number: number;
  team1: string;
  team2: string;
  team1_name?: string;
  team2_name?: string;
  score1?: string;
  score2?: string;
  status: 'scheduled' | 'live' | 'completed' | 'abandoned';
  stage?: string;
  round?: string;
  venue: string;
  venue_name?: string;
  date: string;
  time: string;
  toss_decision?: string;
  notes?: string;
}

export const DEFAULT_TEAMS: StoredTeam[] = [
  { name: 'Lakshmikant Group', slug: 'lakshmikant-group', short_code: 'LG', captain: 'Prasad Rahate', players_count: 10, home_ground: 'Lohar Wadi Stadium', color: '#174478' },
  { name: 'Aaradhya 11', slug: 'aaradhya-11', short_code: 'A11', captain: 'Abhi Kilje', players_count: 10, home_ground: 'Lohar Wadi Stadium', color: '#5c86c5' },
  { name: 'Dharmveer Fighter', slug: 'dharmveer-fighter', short_code: 'DF', captain: 'Rushikesh Thasale', players_count: 10, home_ground: 'Lohar Wadi Stadium', color: '#f59e0b' },
  { name: 'Saish 11', slug: 'saish-11', short_code: 'S11', captain: 'Prafulla Mahadik', players_count: 10, home_ground: 'Lohar Wadi Stadium', color: '#ea580c' },
  { name: 'Shivneri 11', slug: 'shivneri-11', short_code: 'SN11', captain: 'Suraj Waje', players_count: 9, home_ground: 'Lohar Wadi Stadium', color: '#8b5cf6' },
  { name: 'Omkar 11', slug: 'omkar-11', short_code: 'OM11', captain: 'Akshay Dilip Mahadik', players_count: 9, home_ground: 'Lohar Wadi Stadium', color: '#06b6d4' },
];

export const DEFAULT_MATCHES: StoredMatch[] = [
  { id: 1, match_number: 1, team1: 'Lakshmikant Group', team2: 'Saish 11', score1: '168/4 (20)', score2: '165/8 (20)', status: 'completed', stage: 'Group Stage', venue: 'Lohar Wadi Stadium', date: '2026-11-01', time: '07:30 PM' },
  { id: 2, match_number: 2, team1: 'Dharmveer Fighter', team2: 'Aaradhya 11', score1: '142/3 (15.2)', score2: '141/9 (20)', status: 'live', stage: 'Group Stage', venue: 'Lohar Wadi Stadium', date: '2026-11-02', time: '07:30 PM' },
  { id: 3, match_number: 3, team1: 'Shivneri 11', team2: 'Omkar 11', score1: '175/6 (20)', score2: '130/10 (17.4)', status: 'completed', stage: 'Group Stage', venue: 'Lohar Wadi Stadium', date: '2026-11-03', time: '07:30 PM' },
  { id: 4, match_number: 4, team1: 'Lakshmikant Group', team2: 'Dharmveer Fighter', score1: '-', score2: '-', status: 'scheduled', stage: 'Group Stage', venue: 'Lohar Wadi Stadium', date: '2026-11-04', time: '07:30 PM' },
  { id: 5, match_number: 5, team1: 'Aaradhya 11', team2: 'Saish 11', score1: '-', score2: '-', status: 'scheduled', stage: 'Group Stage', venue: 'Lohar Wadi Stadium', date: '2026-11-05', time: '07:30 PM' },
  { id: 6, match_number: 6, team1: 'Shivneri 11', team2: 'Lakshmikant Group', score1: '-', score2: '-', status: 'scheduled', stage: 'Group Stage', venue: 'Lohar Wadi Stadium', date: '2026-11-06', time: '07:30 PM' },
];

// Helper to get all teams dynamically (Custom + Default)
export const getDynamicTeams = (): StoredTeam[] => {
  try {
    const saved = localStorage.getItem('mpl_custom_teams_v1');
    const customTeams: StoredTeam[] = saved ? JSON.parse(saved) : [];
    // Deduplicate by slug or name
    const existingSlugs = new Set(customTeams.map(t => t.slug || t.name.toLowerCase().replace(/\s+/g, '-')));
    const defaults = DEFAULT_TEAMS.filter(t => !existingSlugs.has(t.slug));
    return [...customTeams, ...defaults];
  } catch {
    return DEFAULT_TEAMS;
  }
};

// Helper to get all players dynamically (Custom + Seeded)
export const getDynamicPlayers = (): PlayerProfileData[] => {
  try {
    const saved = localStorage.getItem('mpl_custom_players_v1');
    const customPlayers: PlayerProfileData[] = saved ? JSON.parse(saved) : [];
    const existingIds = new Set(customPlayers.map(p => p.id));
    const seeded = ALL_PLAYERS_DATA.filter(p => !existingIds.has(p.id));
    return [...customPlayers, ...seeded];
  } catch {
    return ALL_PLAYERS_DATA;
  }
};

// Helper to get all matches dynamically (Custom + Default)
export const getDynamicMatches = (): StoredMatch[] => {
  try {
    const saved = localStorage.getItem('mpl_custom_matches_v1');
    const customMatches: StoredMatch[] = saved ? JSON.parse(saved) : [];
    const existingIds = new Set(customMatches.map(m => m.id));
    const defaults = DEFAULT_MATCHES.filter(m => !existingIds.has(m.id));
    return [...customMatches, ...defaults];
  } catch {
    return DEFAULT_MATCHES;
  }
};
