import React, { useState } from 'react';
import { Zap, Play, Trophy, CheckCircle2, RefreshCw, DollarSign, Calendar, TrendingDown, Layers } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Optimizer({ comparisonData, onRunOptimization }) {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      if (onRunOptimization) onRunOptimization();
    }, 600);
  };

  const rows = [
    { metric: 'Project Duration', heuristic: '42 days', genetic: '38 days', qlearning: '35 days', winner: 'Q-Learning (35 days)' },
    { metric: 'Estimated Cost', heuristic: '₹5.8L', genetic: '₹5.4L', qlearning: '₹5.2L', winner: 'Q-Learning (₹5.2L)' },
    { metric: 'Workload Balance Variance', heuristic: '31%', genetic: '18%', qlearning: '12%', winner: 'Q-Learning (12% Var)' },
    { metric: 'Application Latency', heuristic: '320 ms', genetic: '270 ms', qlearning: '240 ms', winner: 'Q-Learning (240 ms)' }
  ];

  const chartData = {
    labels: ['Original Baseline', 'Heuristic Rules', 'Genetic Algorithm', 'AI Q-Learning (RL)'],
    datasets: [
      {
        label: 'Project Schedule (Days)',
        data: [42, 42, 38, 35],
        backgroundColor: 'rgba(79, 70, 229, 0.85)',
        borderColor: '#4f46e5',
        borderWidth: 1
      },
      {
        label: 'Workload Variance (%)',
        data: [31, 31, 18, 12],
        backgroundColor: 'rgba(5, 150, 105, 0.85)',
        borderColor: '#059669',
        borderWidth: 1
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a' }}>AI Optimization Results & Benchmarks</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Comparative optimization analysis of Baseline, Heuristic Rules, Metaheuristic Genetic Algorithm, and Q-Learning Reinforcement Learning.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={handleRun} disabled={isRunning}>
            <Play size={16} /> {isRunning ? 'Executing RL Engine...' : 'Run Optimization'}
          </button>
          <button className="btn-secondary" onClick={handleRun}>
            <RefreshCw size={16} /> Re-evaluate Baseline
          </button>
        </div>
      </div>

      {/* AI Optimization Summary Cards Grid */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
          AI Optimization Performance Impact
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          {/* Card 1: Cost Optimization */}
          <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Financial Optimization</span>
              <div style={{ background: '#ecfdf5', padding: '6px', borderRadius: '8px', color: '#059669' }}>
                <DollarSign size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Original Cost</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#94a3b8', textDecoration: 'line-through' }}>₹5,80,000</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>Optimized Cost</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669' }}>₹5,20,000</div>
              </div>
            </div>
            <div style={{ padding: '6px 10px', background: '#ecfdf5', borderRadius: '6px', fontSize: '0.78rem', color: '#047857', fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
              <span>Total AI Savings</span>
              <strong>₹60,000 Saved (11.5%)</strong>
            </div>
          </div>

          {/* Card 2: Schedule Optimization */}
          <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Schedule Timeline</span>
              <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '8px', color: '#2563eb' }}>
                <Calendar size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Original Schedule</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#94a3b8', textDecoration: 'line-through' }}>42 Days</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '600' }}>Optimized Schedule</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#2563eb' }}>35 Days</div>
              </div>
            </div>
            <div style={{ padding: '6px 10px', background: '#eff6ff', borderRadius: '6px', fontSize: '0.78rem', color: '#1d4ed8', fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
              <span>Time Saved</span>
              <strong>7 Days Earlier (-16.6%)</strong>
            </div>
          </div>

          {/* Card 3: Workload Balance Variance */}
          <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Workload Variance</span>
              <div style={{ background: '#f5f3ff', padding: '6px', borderRadius: '8px', color: '#7c3aed' }}>
                <TrendingDown size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Before (Baseline)</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#94a3b8' }}>31% Variance</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: '600' }}>After (Optimized)</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#7c3aed' }}>12% Variance</div>
              </div>
            </div>
            <div style={{ padding: '6px 10px', background: '#f5f3ff', borderRadius: '6px', fontSize: '0.78rem', color: '#6d28d9', fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
              <span>Imbalance Reduction</span>
              <strong>19% Workload Smoothing</strong>
            </div>
          </div>

        </div>
      </div>

      {/* Winner Summary Banner */}
      <div className="glass-card" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#059669', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}>
            <Trophy size={28} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>Q-Learning Reinforcement Learning Produced Optimal Results</h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
              Reduced completion time to <strong>35 Days (-7 days)</strong>, saved <strong>₹60,000</strong>, and lowered Developer Workload Variance from <strong>31% to 12%</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Metric Table */}
      <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
          Side-by-Side Algorithm Performance Matrix
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '14px 18px' }}>Metric</th>
              <th style={{ padding: '14px 18px' }}>Heuristic Algorithm</th>
              <th style={{ padding: '14px 18px' }}>Genetic Algorithm (GA)</th>
              <th style={{ padding: '14px 18px' }}>Q-Learning (RL)</th>
              <th style={{ padding: '14px 18px' }}>Optimal Winner</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 18px', fontWeight: '600', color: '#0f172a' }}>{r.metric}</td>
                <td style={{ padding: '14px 18px', color: '#2563eb' }}>{r.heuristic}</td>
                <td style={{ padding: '14px 18px', color: '#7c3aed' }}>{r.genetic}</td>
                <td style={{ padding: '14px 18px', fontWeight: '700', color: '#047857' }}>{r.qlearning}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span className="badge badge-emerald">{r.winner}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart Visualizer */}
      <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '14px' }}>
          Schedule Timeline & Workload Variance Comparison Visualizer
        </h3>
        <div style={{ height: '260px' }}>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#64748b', font: { size: 12, weight: '500' } } } }, scales: { x: { ticks: { color: '#64748b' } }, y: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } } } }} />
        </div>
      </div>
    </div>
  );
}
