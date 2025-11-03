import React, { useMemo, useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function AIAssistantPanel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const riskColor = useMemo(() => {
    if (!result) return 'text-slate-300';
    if (result.risk === 'High') return 'text-rose-300';
    if (result.risk === 'Medium') return 'text-amber-300';
    return 'text-emerald-300';
  }, [result]);

  return (
    <section className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-slate-800/60 ring-1 ring-white/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">AI Incident Assistant</h3>
            <p className="text-xs text-slate-400">Paste logs or alerts to get a quick assessment</p>
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || input.trim().length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 ring-1 ring-emerald-400/20 hover:bg-emerald-500/15 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" /> {loading ? 'Analyzing...' : 'Analyze with AI'}
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        placeholder="Paste syslog lines, HTTP access logs, or IDS alerts here..."
        className="w-full resize-none rounded-xl bg-slate-950/60 p-3 text-sm text-slate-200 placeholder:text-slate-500 ring-1 ring-white/10 focus:outline-none focus:ring-emerald-400/30"
      />

      {error && <div className="text-xs text-rose-300">{error}</div>}

      {result && (
        <div className="rounded-xl bg-slate-950/60 p-3 ring-1 ring-white/10">
          <div className="mb-2 text-xs text-slate-400">Risk Level</div>
          <div className={`mb-2 text-sm font-medium ${riskColor}`}>{result.risk}</div>
          <ul className="list-disc pl-5 text-sm text-slate-200 space-y-1">
            {result.summary.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
