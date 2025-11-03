import React, { useMemo, useState } from 'react';
import { AlertTriangle, Shield, Circle, CheckCircle2, Download } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const severityColor = (s) => {
  switch (s) {
    case 'High':
      return 'text-rose-300 bg-rose-500/10 ring-rose-500/20';
    case 'Medium':
      return 'text-amber-300 bg-amber-500/10 ring-amber-500/20';
    default:
      return 'text-sky-300 bg-sky-500/10 ring-sky-500/20';
  }
};

export default function AlertsTable() {
  const data = useMemo(
    () => [
      { id: 'ALR-3021', time: '2m ago', src: '185.199.110.153', dest: '10.0.0.21:443', type: 'Port Scan', severity: 'Medium' },
      { id: 'ALR-3019', time: '8m ago', src: '91.198.174.192', dest: '10.0.0.11:22', type: 'Brute Force SSH', severity: 'High' },
      { id: 'ALR-3016', time: '12m ago', src: '203.0.113.45', dest: '10.0.0.51:80', type: 'SQL Injection', severity: 'High' },
      { id: 'ALR-3009', time: '27m ago', src: '172.67.155.8', dest: '10.0.0.33:443', type: 'Suspicious User Agent', severity: 'Low' },
    ],
    []
  );

  const [blocked, setBlocked] = useState(new Set());
  const [exporting, setExporting] = useState(false);

  const handleBlock = async (ip) => {
    try {
      const res = await fetch(`${API}/api/block-ip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, reason: 'Manual block from dashboard', source: 'ui' }),
      });
      if (!res.ok) throw new Error('Failed to block');
      setBlocked((prev) => new Set(prev).add(ip));
    } catch (e) {
      console.error(e);
      alert('Could not block IP. Please try again.');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const payload = data.map((d) => ({
        alert_id: d.id,
        time: d.time,
        src: d.src,
        dest: d.dest,
        type: d.type,
        severity: d.severity,
      }));
      const res = await fetch(`${API}/api/alerts/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const csv = await res.text();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alerts-export-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Export failed.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-sm font-medium text-white">Recent Alerts</h3>
        <button onClick={handleExport} disabled={exporting} className="inline-flex items-center gap-2 text-xs rounded-lg bg-slate-800/60 px-3 py-1.5 text-slate-200 hover:bg-slate-800 ring-1 ring-white/10 transition disabled:opacity-50">
          <Download className="h-4 w-4" /> {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="py-2 pr-6 font-medium">Alert ID</th>
              <th className="py-2 pr-6 font-medium">When</th>
              <th className="py-2 pr-6 font-medium">Source</th>
              <th className="py-2 pr-6 font-medium">Destination</th>
              <th className="py-2 pr-6 font-medium">Type</th>
              <th className="py-2 pr-6 font-medium">Severity</th>
              <th className="py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row) => (
              <tr key={row.id} className="text-slate-200">
                <td className="py-3 pr-6 font-medium flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400/70"></span>
                  {row.id}
                </td>
                <td className="py-3 pr-6 text-slate-400">{row.time}</td>
                <td className="py-3 pr-6">{row.src}</td>
                <td className="py-3 pr-6">{row.dest}</td>
                <td className="py-3 pr-6 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-300" /> {row.type}
                </td>
                <td className="py-3 pr-6">
                  <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ring-1 ${severityColor(row.severity)}`}>
                    <Circle className="h-3 w-3 fill-current" /> {row.severity}
                  </span>
                </td>
                <td className="py-3">
                  {blocked.has(row.src) ? (
                    <span className="inline-flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 ring-1 ring-emerald-500/20">
                      <CheckCircle2 className="h-4 w-4" /> Blocked
                    </span>
                  ) : (
                    <button onClick={() => handleBlock(row.src)} className="inline-flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 ring-1 ring-emerald-500/20 hover:bg-emerald-500/15">
                      <Shield className="h-4 w-4" /> Block IP
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
