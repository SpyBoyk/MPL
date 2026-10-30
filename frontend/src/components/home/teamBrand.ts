// Shared brand reference for the 6 official MPL franchises, used across the
// landing page sections as a fallback whenever the backend record for a team
// doesn't (yet) have a logo image. Slugs/colors mirror TeamsPage.tsx's
// `defaultTeams` so links and theming stay consistent with the portal.
export interface TeamBrand {
  name: string;
  slug: string;
  code: string;
  color: string;
  /** Local logo asset, only available for 4 of the 6 franchises today. */
  logo?: string;
}

export const TEAM_BRANDS: TeamBrand[] = [
  {
    name: 'Lakshmikant Group',
    slug: 'lakshmikant-group',
    code: 'LG',
    color: '#174478',
    logo: '/images/Gemini_Generated_Image_56ytdy56ytdy56yt.png',
  },
  {
    name: 'Aaradhya 11',
    slug: 'aaradhya-11',
    code: 'A11',
    color: '#5c86c5',
    logo: '/images/Gemini_Generated_Image_fd48y5fd48y5fd48.png',
  },
  {
    name: 'Dharmveer Fighter',
    slug: 'dharmveer-fighter',
    code: 'DF',
    color: '#f59e0b',
    logo: '/images/Gemini_Generated_Image_jv233jv233jv233j.png',
  },
  {
    name: 'Saish 11',
    slug: 'saish-11',
    code: 'S11',
    color: '#ea580c',
    logo: '/images/Gemini_Generated_Image_i5x7wui5x7wui5x7.png',
  },
  {
    name: 'Shivneri 11',
    slug: 'shivneri-11',
    code: 'SN11',
    color: '#8b5cf6',
    logo: '/images/logo-shivneri11.svg',
  },
  {
    name: 'Omkar 11',
    slug: 'omkar-11',
    code: 'OM11',
    color: '#06b6d4',
    logo: '/images/logo-omkar11.svg',
  },
];

export function findTeamBrand(codeOrName?: string | null): TeamBrand | undefined {
  if (!codeOrName) return undefined;
  const needle = codeOrName.trim().toLowerCase();
  return TEAM_BRANDS.find(
    (t) => t.code.toLowerCase() === needle || t.name.toLowerCase() === needle || t.slug === needle
  );
}
