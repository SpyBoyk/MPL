import React from 'react';
import { findTeamBrand } from './teamBrand';

interface TeamBadgeProps {
  name: string;
  code?: string;
  /** Real logo URL from the backend (e.g. match/team API `logo` field), when present. */
  logoUrl?: string | null;
  color?: string;
  size?: number;
  className?: string;
}

/**
 * Renders a team's real logo when one is available (backend record, then the
 * local static asset for the 4 franchises that have one), and otherwise a
 * clean color-coded monogram badge — never a placeholder/fake crest.
 */
export const TeamBadge: React.FC<TeamBadgeProps> = ({
  name,
  code,
  logoUrl,
  color,
  size = 48,
  className = '',
}) => {
  const brand = findTeamBrand(code || name);
  const resolvedLogo = logoUrl || brand?.logo;
  const resolvedColor = color || brand?.color || '#174478';
  const resolvedCode = code || brand?.code || name.slice(0, 2).toUpperCase();

  if (resolvedLogo) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`shrink-0 rounded-xl bg-white/95 border border-white/10 flex items-center justify-center p-1 shadow-md overflow-hidden ${className}`}
      >
        <img src={resolvedLogo} alt={`${name} logo`} className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size, backgroundColor: `${resolvedColor}22`, borderColor: resolvedColor }}
      className={`shrink-0 rounded-xl border-2 flex items-center justify-center font-black shadow-md ${className}`}
    >
      <span style={{ color: resolvedColor, fontSize: size * 0.32 }} className="font-mono tracking-tight">
        {resolvedCode}
      </span>
    </div>
  );
};
