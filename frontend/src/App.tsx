import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { RootLayout } from './components/layout/RootLayout';
import { PortalLayout } from './components/portal/PortalLayout';

import { HomePage } from './pages/HomePage';
import { MatchesPage } from './pages/MatchesPage';
import { MatchDetailPage } from './pages/MatchDetailPage';
import { TeamsPage } from './pages/TeamsPage';
import { TeamDetailPage } from './pages/TeamDetailPage';
import { PlayersPage } from './pages/PlayersPage';
import { PlayerDetailPage } from './pages/PlayerDetailPage';
import { PlayerSeasonHistoryPage } from './pages/PlayerSeasonHistoryPage';
import { PointsTablePage } from './pages/PointsTablePage';
import { StatisticsPage } from './pages/StatisticsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PlayerDashboardPage } from './pages/PlayerDashboardPage';
import { AwardsPage } from './pages/AwardsPage';
import { AwardFormPage } from './pages/AwardFormPage';
import { MatchFormPage } from './pages/MatchFormPage';
import { TeamFormPage } from './pages/TeamFormPage';
import { PlayerFormPage } from './pages/PlayerFormPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { PortalOverviewPage } from './components/portal/PortalOverviewPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      retry: 1,
    },
  },
});

// Helper redirect components for param preservation
function RedirectWithParam({ target }: { target: string }) {
  const params = useParams();
  const idOrSlug = params.id || params.slug || params.matchId;
  return <Navigate to={`/portal/${target}/${idOrSlug}`} replace />;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
          <LoadingProvider>
            <BrowserRouter>
            <Routes>
              {/* 1. MAIN LANDING PAGE & AUTH ROUTES (Uses RootLayout with Navbar & Footer) */}
              <Route path="/" element={<RootLayout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* 2. TOURNAMENT PORTAL (Uses PortalLayout with Sidebar, Compact Breadcrumbs Header, NO FOOTER) */}
              <Route path="/portal" element={<PortalLayout />}>
                <Route index element={<PortalOverviewPage />} />
                <Route path="matches" element={<MatchesPage />} />
                <Route path="matches/new" element={<MatchFormPage />} />
                <Route path="matches/:id" element={<MatchDetailPage />} />
                <Route path="teams" element={<TeamsPage />} />
                <Route path="teams/new" element={<TeamFormPage />} />
                <Route path="teams/:slug" element={<TeamDetailPage />} />
                <Route path="players" element={<PlayersPage />} />
                <Route path="players/new" element={<PlayerFormPage />} />
                <Route path="players/:id" element={<PlayerDetailPage />} />
                <Route path="players/:id/history" element={<PlayerSeasonHistoryPage />} />
                <Route path="points-table" element={<PointsTablePage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="awards" element={<AwardsPage />} />
                <Route path="awards/new" element={<AwardFormPage />} />
                <Route path="awards/:id/edit" element={<AwardFormPage />} />
                <Route path="dashboard" element={<PlayerDashboardPage />} />
                <Route path="admin/users" element={<AdminUsersPage />} />
                <Route path="scoring/*" element={<Navigate to="/portal/matches" replace />} />
              </Route>

              {/* 3. CONVENIENT REDIRECTS (Any legacy/direct links route into the Portal) */}
              <Route path="/matches" element={<Navigate to="/portal/matches" replace />} />
              <Route path="/matches/:id" element={<RedirectWithParam target="matches" />} />
              <Route path="/teams" element={<Navigate to="/portal/teams" replace />} />
              <Route path="/teams/:slug" element={<RedirectWithParam target="teams" />} />
              <Route path="/players" element={<Navigate to="/portal/players" replace />} />
              <Route path="/players/:id" element={<RedirectWithParam target="players" />} />
              <Route path="/points-table" element={<Navigate to="/portal/points-table" replace />} />
              <Route path="/statistics" element={<Navigate to="/portal/statistics" replace />} />
              <Route path="/awards" element={<Navigate to="/portal/awards" replace />} />
              <Route path="/dashboard" element={<Navigate to="/portal/dashboard" replace />} />
              <Route path="/admin/scoring" element={<Navigate to="/portal/matches" replace />} />
              <Route path="/admin/scoring/*" element={<Navigate to="/portal/matches" replace />} />
            </Routes>
          </BrowserRouter>
        </LoadingProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
}

export default App;
