import React, { useEffect, useMemo, useRef, useState } from 'react';

function generatePoint(prev = 50) {
  const next = Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 20));
  return Math.round(next);
}

export default function TrafficChart() {
  const [points, setPoints] = useState(() => Array.from({ length: 50 }, (_, i) => generatePoint(50)));
  const [running, setRunning] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setPoints((prev) => {
        const nextVal = generatePoint(prev[prev.length - 1]);
        const arr = [...prev.slice(1), nextVal];
        return arr;
      });
    }, 800);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [running]);

  const pathD = useMemo(() => {
    const width = 600;
    const height = 160;
    const step = width / (points.length - 1);
    const coords = points.map((p, i) => [i * step, height - (p / 100) * height]);
    return coords.reduce((d, [x, y], i) => (i === 0 ? `M ${x},${y}` : d + ` L ${x},${y}`), '');
  }, [points]);

  const last = points[points.length - 1];

  return (
    <section className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-sm font-medium text-white">Real-time Network Activity</h3>
          <p className="text-xs text-slate-400">Requests per interval (simulated)</p>
        </div>
        <button
          onClick={() => setRunning((r) => !r)}
          className="text-xs rounded-lg bg-slate-800/60 px-3 py-1.5 text-slate-200 hover:bg-slate-800 ring-1 ring-white/10 transition"
        >
          {running ? 'Pause' : 'Resume'}
        </button>
      </div>
      <div className="relative">
        <svg viewBox="0 0 600 160" className="w-full h-40">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={pathD} fill="none" stroke="#34d399" strokeWidth="2" />
          <path d={`${pathD} L 600,160 L 0,160 Z`} fill="url(#g)" opacity="0.6" />
        </svg>
        <div className="absolute right-2 top-2 rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300 ring-1 ring-emerald-400/20">
          Load: {last}%
        </div>
      </div>
    </section>
  );
}
