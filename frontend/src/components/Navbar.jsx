import React from 'react';
import { Cpu, Users, Calendar, Activity, Zap, RefreshCw, Server, Layers } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, apiStatus, onRefresh }) {
  const tabs = [
    { id: 'overview', label: 'Overview & Flow', icon: Layers },
    { id: 'tasks', label: 'Tasks & Gantt', icon: Calendar },
    { id: 'developers', label: 'Human Resources', icon: Users },
    { id: 'optimization', label: 'AI Optimization Studio', icon: Zap },
    { id: 'infrastructure', label: 'Computing & Telemetry', icon: Server },
    { id: 'disruption', label: 'Dynamic Rescheduler', icon: RefreshCw },
  ];

  return (
    <header style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Cpu size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '700', background: 'linear-gradient(90deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Intelligent Human & Computing Resource Optimizer
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Hybrid Heuristic + Metaheuristic (GA) + Reinforcement Learning Engine
            </span>
          </div>
        </div>

        {/* Status Indicator & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className={`badge ${apiStatus ? 'badge-emerald' : 'badge-rose'}`}>
            <Activity size={12} />
            {apiStatus ? 'API Connected (Port 8080)' : 'Simulation Mode'}
          </div>
          <button className="btn-secondary" onClick={onRefresh} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav style={{ maxWidth: '1400px', margin: '12px auto 0 auto', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} color={isActive ? '#818cf8' : 'var(--text-muted)'} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
