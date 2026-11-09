import React from 'react';
import { Users, CheckCircle2, Clock, DollarSign, Server, Zap, ShieldCheck, ArrowRight, BrainCircuit } from 'lucide-react';

export default function OverviewTab({ summaryData, onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Welcome Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="badge badge-purple" style={{ marginBottom: '12px' }}>
            <BrainCircuit size={14} /> Dual-Domain AI Hybrid Platform
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>
            Intelligent Software Project Management & Resource Optimization Platform
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '900px', lineHeight: '1.6' }}>
            Combines <strong>Human Resource Optimization</strong> (Developer-Task Assignment & Project Scheduling) with <strong>Computing Resource Optimization</strong> (CPU, Memory, Server Load & Latency) using a tri-hybrid AI engine of <em>Heuristics, Genetic Algorithms (GA), and Reinforcement Learning (Q-Learning)</em>.
          </p>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button className="btn-primary" onClick={() => onNavigate('optimization')}>
              <Zap size={16} /> Run AI Optimization Benchmark
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('disruption')}>
              Simulate Dynamic Rescheduling <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4">
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-indigo)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span>Active Developers</span>
            <Users size={18} color="var(--accent-indigo)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>{summaryData?.developerCount || 4}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>100% Availability Verified</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span>Optimized Makespan</span>
            <Clock size={18} color="var(--accent-purple)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>{summaryData?.bestMakespan || 10} Days</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>-35% Completion Delay</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span>Skill Match Index</span>
            <ShieldCheck size={18} color="var(--accent-emerald)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>{summaryData?.avgSuitability || 92}%</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>Zero Skill Mismatch</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span>Server Nodes Health</span>
            <Server size={18} color="var(--accent-amber)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>4 / 4 Nodes</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>Auto-Rebalance Active</span>
        </div>
      </div>

      {/* System Flow Diagram & Explanation */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainCircuit color="var(--accent-indigo)" /> End-to-End System Workflow Architecture
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div className="badge badge-blue" style={{ marginBottom: '8px' }}>Step 1</div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Task & Dev Input</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Skills, Experience, Workload, Complexity & Priorities</p>
          </div>

          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div className="badge badge-purple" style={{ marginBottom: '8px' }}>Step 2</div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Suitability Scoring</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Skill match + Exp + Performance - Workload penalty</p>
          </div>

          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div className="badge badge-emerald" style={{ marginBottom: '8px' }}>Step 3</div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Hybrid AI Optimization</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Heuristic + Genetic Algo + Q-Learning Policy</p>
          </div>

          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div className="badge badge-amber" style={{ marginBottom: '8px' }}>Step 4</div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Telemetry & Allocation</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Prometheus metrics for CPU, Memory, Server Load & Latency</p>
          </div>

          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div className="badge badge-rose" style={{ marginBottom: '8px' }}>Step 5</div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Dynamic Rescheduling</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Auto-rebalances when developers leave or CPU spikes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
