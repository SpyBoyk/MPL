import React, { useEffect, useRef, useState } from 'react';
import {
  Flame,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Gauge,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const CricketMatchAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [telemetry, setTelemetry] = useState({
    ballSpeed: 144.2,
    ballType: 'Outswinger',
    shotType: 'Magnificent Cover Drive',
    exitVelocity: 158.6,
    sweetSpot: '99.4%',
    distance: 96,
    result: 'BOUNDARY (6 RUNS)',
    phase: 'Delivery Run-up',
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let t = 0; // Time in cycle (0 to 240 frames ~ 4 seconds at 60fps)
    const CYCLE_LENGTH = 240;

    let particles: Particle[] = [];

    // Helper: spawn impact sparks
    const spawnSparks = (x: number, y: number, count = 25) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          life: 1,
          maxLife: 20 + Math.random() * 20,
          color: ['#f59e0b', '#fbbf24', '#ffffff', '#ef4444', '#38bdf8'][
            Math.floor(Math.random() * 5)
          ],
          size: 1.5 + Math.random() * 2.5,
        });
      }
    };

    // Helper: spawn pitch dust
    const spawnPitchDust = (x: number, y: number) => {
      for (let i = 0; i < 12; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 2.5,
          life: 1,
          maxLife: 18 + Math.random() * 15,
          color: 'rgba(217, 190, 140, 0.6)',
          size: 2 + Math.random() * 3,
        });
      }
    };

    const render = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;

      // 1. CLEAR & STADIUM BACKGROUND
      ctx.fillStyle = '#060d1b';
      ctx.fillRect(0, 0, width, height);

      // Radial stadium floodlight glow
      const grad = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        10,
        width / 2,
        height * 0.45,
        width * 0.7
      );
      grad.addColorStop(0, 'rgba(23, 68, 120, 0.4)');
      grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.6)');
      grad.addColorStop(1, 'rgba(6, 13, 27, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Stadium floodlights beam
      ctx.save();
      ctx.globalAlpha = 0.15;
      const lightGrad1 = ctx.createLinearGradient(0, 0, width * 0.4, height);
      lightGrad1.addColorStop(0, '#38bdf8');
      lightGrad1.addColorStop(1, 'transparent');
      ctx.fillStyle = lightGrad1;
      ctx.beginPath();
      ctx.moveTo(30, 10);
      ctx.lineTo(width * 0.55, height);
      ctx.lineTo(width * 0.25, height);
      ctx.closePath();
      ctx.fill();

      const lightGrad2 = ctx.createLinearGradient(width, 0, width * 0.6, height);
      lightGrad2.addColorStop(0, '#facc15');
      lightGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = lightGrad2;
      ctx.beginPath();
      ctx.moveTo(width - 30, 10);
      ctx.lineTo(width * 0.75, height);
      ctx.lineTo(width * 0.45, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. CRICKET FIELD & 3D PERSPECTIVE PITCH
      const pitchTopY = height * 0.52;
      const pitchBottomY = height * 0.82;
      const pitchTopW = width * 0.38;
      const pitchBottomW = width * 0.72;
      const pitchCenterX = width * 0.5;

      // Outer grass oval
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        width / 2,
        height * 0.72,
        width * 0.52,
        height * 0.28,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = '#0b2618';
      ctx.fill();
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Pitch Turf Strip (trapezoid in perspective)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pitchCenterX - pitchTopW / 2, pitchTopY);
      ctx.lineTo(pitchCenterX + pitchTopW / 2, pitchTopY);
      ctx.lineTo(pitchCenterX + pitchBottomW / 2, pitchBottomY);
      ctx.lineTo(pitchCenterX - pitchBottomW / 2, pitchBottomY);
      ctx.closePath();

      const pitchGrad = ctx.createLinearGradient(0, pitchTopY, 0, pitchBottomY);
      pitchGrad.addColorStop(0, '#695133');
      pitchGrad.addColorStop(0.5, '#876943');
      pitchGrad.addColorStop(1, '#9b7c52');
      ctx.fillStyle = pitchGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bowling Crease Lines (top)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pitchCenterX - pitchTopW * 0.42, pitchTopY + 12);
      ctx.lineTo(pitchCenterX + pitchTopW * 0.42, pitchTopY + 12);
      ctx.stroke();

      // Popping Crease Lines (bottom - batting end)
      ctx.beginPath();
      ctx.moveTo(pitchCenterX - pitchBottomW * 0.44, pitchBottomY - 16);
      ctx.lineTo(pitchCenterX + pitchBottomW * 0.44, pitchBottomY - 16);
      ctx.stroke();

      // Good Length Pitching Marker Circle
      const pitchLandX = pitchCenterX + 15;
      const pitchLandY = pitchTopY + (pitchBottomY - pitchTopY) * 0.52;
      ctx.beginPath();
      ctx.ellipse(pitchLandX, pitchLandY, 14, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 3. WICKETS (Bowling End & Batting End)
      // Bowling End Wickets
      const bWicketX = pitchCenterX - pitchTopW * 0.12;
      const bWicketY = pitchTopY + 4;
      ctx.fillStyle = '#f8fafc';
      for (let i = -1; i <= 1; i++) {
        ctx.fillRect(bWicketX + i * 3 - 0.75, bWicketY - 16, 1.5, 16);
      }
      ctx.fillRect(bWicketX - 4.5, bWicketY - 17, 9, 1.5); // Bails

      // Batting End Wickets
      const sWicketX = pitchCenterX + pitchBottomW * 0.18;
      const sWicketY = pitchBottomY - 18;
      ctx.fillStyle = '#f8fafc';
      for (let i = -1; i <= 1; i++) {
        ctx.fillRect(sWicketX + i * 5 - 1.2, sWicketY - 26, 2.4, 26);
      }
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(sWicketX - 7.5, sWicketY - 27.5, 15, 2.5); // Bails

      // 4. ANIMATION PHASES & TIMELINE
      // Frame 0-60: Bowler run-up & jump
      // Frame 60-80: Bowler arm rotation & Ball release
      // Frame 80-120: Ball in flight & pitch bounce at frame 105
      // Frame 115-135: Batsman downswing, connection at frame 122!
      // Frame 122-190: Ball sails in air towards boundary with tracer
      // Frame 190-240: Batsman follow-through & reset

      const curFrame = t % CYCLE_LENGTH;

      // 5. BOWLER RENDERING (Bowling End, runs from left toward pitch)
      const bowlerBaseX = pitchCenterX - pitchTopW * 0.45;
      const bowlerBaseY = pitchTopY + 10;
      let bowlerProgress = 0;
      let bowlerArmAngle = 0;
      let isBallInBowlerHand = true;

      if (curFrame < 60) {
        // Run-up
        bowlerProgress = curFrame / 60;
      } else if (curFrame < 80) {
        // Stride & Release
        bowlerProgress = 1;
        const relProgress = (curFrame - 60) / 20;
        bowlerArmAngle = relProgress * Math.PI * 2;
        if (curFrame >= 75) isBallInBowlerHand = false;
      } else {
        // Follow-through
        bowlerProgress = 1;
        isBallInBowlerHand = false;
        bowlerArmAngle = Math.PI * 0.2;
      }

      const bowlerX = bowlerBaseX + bowlerProgress * 28;
      const bowlerBob = Math.sin(curFrame * 0.35) * 3;
      const bowlerY = bowlerBaseY - 22 + (curFrame >= 50 && curFrame <= 65 ? -8 : bowlerBob);

      // Draw Bowler
      ctx.save();
      // Shadow
      ctx.beginPath();
      ctx.ellipse(bowlerX, bowlerBaseY, 10, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fill();

      // Body (Jersey: Deep Blue #174478 with gold stripes)
      ctx.fillStyle = '#174478';
      ctx.beginPath();
      ctx.roundRect(bowlerX - 5, bowlerY - 8, 10, 16, 2);
      ctx.fill();

      // Jersey #7 on Bowler
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 6px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('7', bowlerX, bowlerY + 2);

      // Trousers / Legs
      ctx.fillStyle = '#102a4e';
      const legOffset = Math.sin(curFrame * 0.35) * 5;
      ctx.fillRect(bowlerX - 4, bowlerY + 8, 3.5, 12 + legOffset);
      ctx.fillRect(bowlerX + 0.5, bowlerY + 8, 3.5, 12 - legOffset);

      // Bowler Head
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(bowlerX, bowlerY - 13, 4.5, 0, Math.PI * 2);
      ctx.fill();
      // Cap
      ctx.fillStyle = '#174478';
      ctx.fillRect(bowlerX - 4.5, bowlerY - 17, 9, 3);
      ctx.fillRect(bowlerX + 0.5, bowlerY - 16, 5, 2);

      // Bowling Arm
      ctx.save();
      ctx.translate(bowlerX, bowlerY - 7);
      if (curFrame < 60) {
        ctx.rotate(Math.sin(curFrame * 0.3) * 0.6);
      } else {
        ctx.rotate(bowlerArmAngle);
      }
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -14);
      ctx.stroke();

      // Ball in bowler hand
      if (isBallInBowlerHand) {
        ctx.beginPath();
        ctx.arc(0, -15, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#dc2626';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();

      // 6. BATSMAN RENDERING (Batting End, Right side)
      const batsmanBaseX = pitchCenterX + pitchBottomW * 0.08;
      const batsmanBaseY = pitchBottomY - 15;
      let batsmanBatAngle = -Math.PI * 0.35; // Default backlift
      let batsmanStrideX = 0;

      if (curFrame >= 70 && curFrame < 115) {
        // High Backlift & Trigger movement
        const liftP = (curFrame - 70) / 45;
        batsmanBatAngle = -Math.PI * 0.35 - liftP * 0.5;
        batsmanStrideX = -liftP * 8; // Step forward
      } else if (curFrame >= 115 && curFrame < 125) {
        // Downswing & Contact!
        const swingP = (curFrame - 115) / 10;
        batsmanBatAngle = -Math.PI * 0.85 + swingP * 1.5;
        batsmanStrideX = -8;
      } else if (curFrame >= 125 && curFrame < 185) {
        // Follow-through high finish
        batsmanBatAngle = Math.PI * 0.65;
        batsmanStrideX = -8;
      } else if (curFrame >= 185) {
        // Resetting back to stance
        const resetP = (curFrame - 185) / 55;
        batsmanBatAngle = Math.PI * 0.65 - resetP * (Math.PI + 0.35);
        batsmanStrideX = -8 * (1 - resetP);
      }

      const batsmanX = batsmanBaseX + batsmanStrideX;
      const batsmanY = batsmanBaseY - 38;

      ctx.save();
      // Batsman Shadow
      ctx.beginPath();
      ctx.ellipse(batsmanX, batsmanBaseY, 14, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fill();

      // Batting Pads (White leg guards)
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(batsmanX - 8, batsmanBaseY - 20, 6, 20, 2);
      ctx.roundRect(batsmanX - 1, batsmanBaseY - 20, 6, 20, 2);
      ctx.fill();
      ctx.stroke();

      // Batting Jersey (Gold & Navy)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(batsmanX - 7, batsmanY + 8, 14, 18, 3);
      ctx.fill();

      // Helmet (Blue with silver grill)
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(batsmanX - 1, batsmanY + 2, 7, 0, Math.PI * 2);
      ctx.fill();
      // Visor
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(batsmanX - 6, batsmanY + 3, 5, 3);

      // Batting Gloves (Red & White)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(batsmanX - 5, batsmanY + 22, 3.5, 0, Math.PI * 2);
      ctx.arc(batsmanX + 2, batsmanY + 20, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Cricket Bat (Willow with colored grip)
      ctx.save();
      ctx.translate(batsmanX - 2, batsmanY + 21);
      ctx.rotate(batsmanBatAngle);

      // Handle
      ctx.fillStyle = '#174478';
      ctx.fillRect(-1.5, -16, 3, 16);

      // Willow Blade
      const batGrad = ctx.createLinearGradient(-3.5, 0, 3.5, 0);
      batGrad.addColorStop(0, '#fef3c7');
      batGrad.addColorStop(0.5, '#fde68a');
      batGrad.addColorStop(1, '#d97706');
      ctx.fillStyle = batGrad;
      ctx.beginPath();
      ctx.roundRect(-3.5, 0, 7, 28, [1, 1, 4, 4]);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Colored sticker on bat spine
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-2, 4, 4, 12);
      ctx.restore();
      ctx.restore();

      // 7. CRICKET BALL DYNAMICS & TRAJECTORY
      let ballX = 0;
      let ballY = 0;
      let ballRadius = 3.5;
      let showBall = false;

      // Delivery release point
      const releaseX = bowlerBaseX + 28;
      const releaseY = bowlerBaseY - 36;
      // Pitch bounce point
      const bounceX = pitchLandX;
      const bounceY = pitchLandY;
      // Bat impact point
      const impactX = batsmanX - 14;
      const impactY = batsmanY + 36;

      if (curFrame >= 75 && curFrame <= 122) {
        showBall = true;
        if (curFrame <= 104) {
          // Flight from bowler's hand to pitch
          const flightP = (curFrame - 75) / (104 - 75);
          ballX = releaseX + (bounceX - releaseX) * flightP;
          // Parabolic dip
          ballY =
            releaseY +
            (bounceY - releaseY) * flightP -
            Math.sin(flightP * Math.PI) * 14;
          ballRadius = 3 + flightP * 1.5;
        } else {
          // Frame 104 bounce trigger!
          if (curFrame === 105) {
            spawnPitchDust(bounceX, bounceY);
          }
          // Bounce up from pitch toward bat
          const bounceP = (curFrame - 104) / (122 - 104);
          ballX = bounceX + (impactX - bounceX) * bounceP;
          ballY =
            bounceY +
            (impactY - bounceY) * bounceP -
            Math.sin(bounceP * Math.PI) * 12;
          ballRadius = 4.5 + bounceP * 1.5;
        }
      } else if (curFrame > 122 && curFrame < 210) {
        // Frame 122 Impact Trigger!
        if (curFrame === 123) {
          spawnSparks(impactX, impactY, 35);
        }
        showBall = true;
        // Ball blasted off the bat into the stands!
        const flyP = (curFrame - 122) / (210 - 122);
        // Exits top-right toward boundary
        ballX = impactX + flyP * (width * 0.85);
        ballY = impactY - Math.sin(flyP * Math.PI * 0.9) * (height * 0.75) + flyP * 40;
        ballRadius = Math.max(2, 6 - flyP * 3);
      }

      // Draw Ball & Fiery Particle Trail
      if (showBall) {
        // Trail
        ctx.save();
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle =
          curFrame > 122 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.35)';
        ctx.fill();

        // Leather Cricket Ball with Seam
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        const ballGrad = ctx.createRadialGradient(
          ballX - 1,
          ballY - 1,
          1,
          ballX,
          ballY,
          ballRadius
        );
        ballGrad.addColorStop(0, '#f87171');
        ballGrad.addColorStop(0.5, '#dc2626');
        ballGrad.addColorStop(1, '#991b1b');
        ctx.fillStyle = ballGrad;
        ctx.fill();

        // White Seam
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius * 0.85, 0, Math.PI);
        ctx.stroke();
        ctx.restore();
      }

      // 8. BAT-BALL IMPACT FLASH EFFECT
      if (curFrame >= 122 && curFrame <= 127) {
        ctx.save();
        const flashAlpha = 1 - (curFrame - 122) / 6;
        const flashGrad = ctx.createRadialGradient(
          impactX,
          impactY,
          2,
          impactX,
          impactY,
          45
        );
        flashGrad.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`);
        flashGrad.addColorStop(0.3, `rgba(251, 191, 36, ${flashAlpha * 0.8})`);
        flashGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = flashGrad;
        ctx.fillRect(impactX - 50, impactY - 50, 100, 100);
        ctx.restore();
      }

      // 9. UPDATE & RENDER PARTICLES (SPARKS, DUST)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // Gravity
        p.life++;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // 10. ON-SCREEN BROADCAST SHOT OVERLAY CALLOUT
      if (curFrame >= 123 && curFrame <= 180) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        const bannerW = 200;
        const bannerH = 34;
        const bannerX = width / 2 - bannerW / 2;
        const bannerY = height * 0.18;
        ctx.beginPath();
        ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fde047';
        ctx.font = 'black 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CRACKING COVER DRIVE! 6 RUNS', width / 2, bannerY + 16);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('EXIT VELOCITY: 158.6 KM/H · 96 METERS', width / 2, bannerY + 28);
        ctx.restore();
      }

      // 11. ADVANCE ANIMATION TIME
      if (isPlaying) {
        t += speedMultiplier;
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, speedMultiplier]);

  return (
    <div className="relative w-full max-w-[560px] aspect-[4/3] rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-[#070d18] shadow-2xl shadow-cyan-950/60 flex flex-col justify-between group">
      {/* Top Broadcast HUD Bar */}
      <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3 sm:p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span className="font-black uppercase tracking-wider text-white text-[11px] drop-shadow-md">
            MPL Match Cam · Bowler vs Batsman
          </span>
          <span className="bg-[#174478] text-amber-300 font-extrabold text-[9px] px-2 py-0.5 rounded-full border border-amber-400/30">
            60 FPS LIVE
          </span>
        </div>

        {/* Speed / Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-slate-300 hover:text-white p-1 transition cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 0.5 : 1)}
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition cursor-pointer ${
              speedMultiplier === 0.5
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {speedMultiplier === 0.5 ? 'Slow-Mo' : '1x Speed'}
          </button>
        </div>
      </div>

      {/* Main 60fps Canvas Animation */}
      <canvas
        ref={canvasRef}
        width={560}
        height={420}
        className="w-full h-full object-cover block"
      />

      {/* Bottom Telemetry HUD Matrix */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 pt-6 space-y-2">
        <div className="grid grid-cols-4 gap-2 text-center text-white">
          <div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/80">
            <span className="text-[9px] font-bold uppercase text-slate-400 block">Bowler Speed</span>
            <span className="text-xs sm:text-sm font-black text-cyan-400 font-mono">144.2 KM/H</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/80">
            <span className="text-[9px] font-bold uppercase text-slate-400 block">Delivery Type</span>
            <span className="text-xs sm:text-sm font-black text-amber-300 truncate block">Outswinger</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/80">
            <span className="text-[9px] font-bold uppercase text-slate-400 block">Bat Exit Speed</span>
            <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono">158.6 KM/H</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/80">
            <span className="text-[9px] font-bold uppercase text-slate-400 block">Shot Result</span>
            <span className="text-xs sm:text-sm font-black text-rose-400 truncate block">6 RUNS (96m)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
