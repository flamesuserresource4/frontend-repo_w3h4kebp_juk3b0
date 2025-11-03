import React from 'react';
import { Shield, Brain } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-800/60 backdrop-blur flex items-center justify-center ring-1 ring-white/10">
            <Shield className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-white tracking-tight">Sentinel IDS</h1>
            <p className="text-xs text-slate-400">Real-time intrusion detection with AI insights</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-400/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Monitoring Active
          </span>
          <button className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-slate-800/60 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 ring-1 ring-white/10 transition">
            <Brain className="h-4 w-4" />
            AI Mode
          </button>
        </div>
      </div>
    </header>
  );
}
