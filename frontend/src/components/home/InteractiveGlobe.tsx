import React, { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

interface NodeLocation {
  name: string;
  code: string;
  lat: number;
  lng: number;
  color: string;
  players: number;
}

const TOURNAMENT_NODES: NodeLocation[] = [
  { name: 'Lakshmikant Group', code: 'LG', lat: 18.2, lng: 73.4, color: '#f59e0b', players: 10 },
  { name: 'Aaradhya 11', code: 'A11', lat: 25.1, lng: 75.8, color: '#3b82f6', players: 10 },
  { name: 'Dharmveer Fighter', code: 'DF', lat: -12.4, lng: 52.3, color: '#10b981', players: 10 },
  { name: 'Saish 11', code: 'S11', lat: 38.6, lng: 110.2, color: '#ef4444', players: 10 },
  { name: 'Shivneri 11', code: 'SN11', lat: -28.5, lng: 135.0, color: '#8b5cf6', players: 9 },
  { name: 'Omkar 11', code: 'OM11', lat: 45.2, lng: -40.5, color: '#06b6d4', players: 9 },
];

export const InteractiveGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeNode, setActiveNode] = useState<NodeLocation>(TOURNAMENT_NODES[0]);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ angleX: 0.2, angleY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = 640;
    const height = 640;
    canvas.width = width;
    canvas.height = height;

    const radius = 220;
    const numPoints = 650;
    const points: Point3D[] = [];

    // Generate Fibonacci sphere points
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        baseX: x * radius,
        baseY: y * radius,
        baseZ: z * radius,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Auto rotate when not dragging
      if (!isDraggingRef.current) {
        rotationRef.current.angleY += 0.004;
      }

      const { angleX, angleY } = rotationRef.current;
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const cx = width / 2;
      const cy = height / 2;

      // Draw atmospheric outer glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.35);
      glowGrad.addColorStop(0, 'rgba(23, 68, 120, 0.22)');
      glowGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
      glowGrad.addColorStop(0.8, 'rgba(245, 158, 11, 0.04)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw sphere rim ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Project and draw dot matrix
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];

        // Rotate around Y
        const x1 = pt.baseX * cosY - pt.baseZ * sinY;
        const z1 = pt.baseZ * cosY + pt.baseX * sinY;

        // Rotate around X
        const y2 = pt.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + pt.baseY * sinX;

        // Depth perspective
        const scale = (z2 + radius * 1.5) / (radius * 2.5);
        const alpha = Math.max(0.08, Math.min(1, (z2 + radius) / (radius * 1.8)));

        if (z2 > -radius * 0.9) {
          ctx.beginPath();
          ctx.arc(cx + x1, cy + y2, Math.max(0.8, 1.8 * scale), 0, Math.PI * 2);

          if (z2 > 0) {
            ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.9})`;
          } else {
            ctx.fillStyle = `rgba(30, 58, 138, ${alpha * 0.5})`;
          }
          ctx.fill();
        }
      }

      // Draw tournament franchise nodes and connecting flight arcs
      const projectedNodes = TOURNAMENT_NODES.map((node) => {
        const latRad = (node.lat * Math.PI) / 180;
        const lngRad = (node.lng * Math.PI) / 180;

        const bx = radius * Math.cos(latRad) * Math.sin(lngRad);
        const by = -radius * Math.sin(latRad);
        const bz = radius * Math.cos(latRad) * Math.cos(lngRad);

        // Rotate
        const x1 = bx * cosY - bz * sinY;
        const z1 = bz * cosY + bx * sinY;

        const y2 = by * cosX - z1 * sinX;
        const z2 = z1 * cosX + by * sinX;

        return {
          node,
          px: cx + x1,
          py: cy + y2,
          pz: z2,
          visible: z2 > -40,
        };
      });

      // Draw arcs between active node and others
      const prime = projectedNodes[0];
      if (prime && prime.visible) {
        for (let i = 1; i < projectedNodes.length; i++) {
          const target = projectedNodes[i];
          if (target && target.visible) {
            ctx.beginPath();
            ctx.moveTo(prime.px, prime.py);

            // Arc control point curved outward
            const midX = (prime.px + target.px) / 2;
            const midY = (prime.py + target.py) / 2 - 35;

            ctx.quadraticCurveTo(midX, midY, target.px, target.py);
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // Draw glowing node points
      for (const pNode of projectedNodes) {
        if (!pNode.visible) continue;

        // Outer beacon ring
        ctx.beginPath();
        ctx.arc(pNode.px, pNode.py, 8, 0, Math.PI * 2);
        ctx.fillStyle = `${pNode.node.color}33`;
        ctx.fill();

        // Core marker
        ctx.beginPath();
        ctx.arc(pNode.px, pNode.py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = pNode.node.color;
        ctx.shadowColor = pNode.node.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label pill
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(pNode.node.code, pNode.px + 9, pNode.py + 3);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    // Mouse drag controls
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      rotationRef.current.angleY += dx * 0.005;
      rotationRef.current.angleX += dy * 0.005;
      rotationRef.current.angleX = Math.max(-1.2, Math.min(1.2, rotationRef.current.angleX));
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] lg:w-[540px] lg:h-[540px] cursor-grab active:cursor-grabbing"
      />

      {/* Floating Interactive Telemetry Badges */}
      <div className="absolute -top-2 right-2 sm:right-6 bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 p-2.5 px-3.5 rounded-xl shadow-xl flex items-center gap-2.5 animate-bounce">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <div>
          <p className="text-[10px] font-bold tracking-wider uppercase text-cyan-300">Live Global Sync</p>
          <p className="text-xs font-black text-white">6 Franchises Connected</p>
        </div>
      </div>

      <div className="absolute -bottom-4 left-2 sm:left-6 bg-slate-900/90 backdrop-blur-md border border-amber-500/30 p-2.5 px-3.5 rounded-xl shadow-xl flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <div>
          <p className="text-[10px] font-bold tracking-wider uppercase text-amber-300">Malghar Premier League</p>
          <p className="text-xs font-black text-white">58 Official Players Verified</p>
        </div>
      </div>
    </div>
  );
};
