import React from 'react';
import { Activity, AlertTriangle, Shield } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="flex items-center justify-between rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-slate-800/60 flex items-center justify-center ring-1 ring-white/10">
        <Icon className="h-5 w-5 text-emerald-400" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
    <span className={`text-xs ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{trend}</span>
  </div>
);

export default function ThreatSummary() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard icon={Activity} label="Live Traffic" value="12,487 req/min" trend="+4.2%" />
      <StatCard icon={AlertTriangle} label="Active Alerts" value="7" trend="-12%" />
      <StatCard icon={Shield} label="Blocked Threats" value="1,245" trend="+8.1%" />
    </section>
  );
}
