import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdvanceLoading } from '../context/LoadingContext';
import { useLenisScroll } from '../components/home/useLenisScroll';
import { HeroSection } from '../components/home/HeroSection';
import { TournamentTicker } from '../components/home/TournamentTicker';
import { AboutMPLSection } from '../components/home/AboutMPLSection';
import { TeamsShowcase } from '../components/home/TeamsShowcase';
import { OrangePurpleCapSection } from '../components/home/OrangePurpleCapSection';
import { ChampionshipPrizeSection } from '../components/home/ChampionshipPrizeSection';
import { GallerySection } from '../components/home/GallerySection';
import { PlayerRecords } from '../components/home/PlayerRecords';
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
    <main className="relative w-full overflow-x-clip bg-pitch">
      <HeroSection onSeeMatches={handleLaunchPortalWithLoader} />
      <TournamentTicker />
      <AboutMPLSection />
      <TeamsShowcase />
      <OrangePurpleCapSection />
      <ChampionshipPrizeSection />
      <GallerySection />
      <PlayerRecords />
      <FinalCtaBand onEnter={handleLaunchPortalWithLoader} />    </main>
  );
};
