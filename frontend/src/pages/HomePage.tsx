import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdvanceLoading } from '../context/LoadingContext';
import { useLenisScroll } from '../components/home/useLenisScroll';
import { HeroSection } from '../components/home/HeroSection';
import { TournamentTicker } from '../components/home/TournamentTicker';
import { TournamentOverviewSection } from '../components/home/TournamentOverviewSection';
import { TeamsShowcase } from '../components/home/TeamsShowcase';
import { NextMatchSection } from '../components/home/NextMatchSection';
import { RecentResultsSection } from '../components/home/RecentResultsSection';
import { PointsTablePreview } from '../components/home/PointsTablePreview';
import { OrangePurpleCapSection } from '../components/home/OrangePurpleCapSection';
import { ChampionshipPrizeSection } from '../components/home/ChampionshipPrizeSection';
import { PatronsSection } from '../components/home/PatronsSection';
import { GallerySection } from '../components/home/GallerySection';
import { AboutMPLSection } from '../components/home/AboutMPLSection';
import { PlayerRecords } from '../components/home/PlayerRecords';
import { VenueContactSection } from '../components/home/VenueContactSection';
import { FinalCtaBand } from '../components/home/FinalCtaBand';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { showLoader } = useAdvanceLoading();

  useLenisScroll();

  const handleLaunchPortalWithLoader = () => {
    showLoader('MALGHAR PREMIER LEAGUE', 'Lohar Wadi Stadium · Match Center', 1800);
    setTimeout(() => {
      navigate('/portal');
    }, 1800);
  };

  return (
    <main className="relative w-full overflow-x-clip bg-navy">
      {/* 1. Hero */}
      <HeroSection onSeeMatches={handleLaunchPortalWithLoader} />
      <TournamentTicker />
      {/* 2. Tournament overview */}
      <TournamentOverviewSection />
      {/* 3. Participating teams */}
      <TeamsShowcase />
      {/* 4. Fixtures & upcoming matches */}
      <NextMatchSection />
      {/* 5. Live scores & recent results */}
      <RecentResultsSection />
      {/* 6. Points table */}
      <PointsTablePreview />
      {/* 7. Player leaderboard */}
      <OrangePurpleCapSection />
      {/* 8. Prize & awards */}
      <ChampionshipPrizeSection />
      {/* 9. Patrons & supporters (real community sponsors — see AwardsPage data) */}
      <PatronsSection />
      {/* 10. Cricket memories / gallery */}
      <GallerySection />
      {/* 11. About Malghar & MPL */}
      <AboutMPLSection />
      <PlayerRecords />
      {/* 12. Venue & contact */}
      <VenueContactSection />
      <FinalCtaBand onEnter={handleLaunchPortalWithLoader} />
    </main>
  );
};
