import React from 'react';
import Header from './components/Header';
import ThreatSummary from './components/ThreatSummary';
import TrafficChart from './components/TrafficChart';
import AlertsTable from './components/AlertsTable';
import AIAssistantPanel from './components/AIAssistantPanel';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <ThreatSummary />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <TrafficChart />
            <AlertsTable />
          </div>
          <div className="lg:col-span-1">
            <AIAssistantPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
