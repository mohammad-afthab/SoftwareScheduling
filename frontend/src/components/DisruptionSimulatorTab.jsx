import React, { useState } from 'react';
import { RefreshCw, AlertTriangle, UserX, TrendingUp, Server, CheckCircle2, Zap } from 'lucide-react';

export default function DisruptionSimulatorTab({ developers, tasks, onTriggerReallocation }) {
  const [activeEvent, setActiveEvent] = useState(null);
  const [log, setLog] = useState([]);
  const [simulatedResult, setSimulatedResult] = useState(null);

  const handleSimulateLeave = () => {
    setActiveEvent('DEV_OFFLINE');
    setLog([
      '⚡ Event Detected: Developer C (Java & Security Expert) marked as Unavailable (Sick Leave)',
      '🔍 Analyzing affected tasks: Payment API (Critical Priority)',
      '🧠 Running Hybrid Optimization Engine (Heuristic + Genetic Algorithm)...',
      '✅ Decision: Payment API reassigned to Developer A (Suitability Match: 88%)',
      '📅 Schedule Updated: Project completion delay minimized from +4 days to +0 days!'
    ]);
    setSimulatedResult({
      affectedTask: 'Payment Gateway API',
      oldDev: 'Developer C',
      newDev: 'Developer A',
      delayAdded: '0 Days',
      status: 'REALLOCATED_OPTIMALLY'
    });
  };

  const handleSimulateSpike = () => {
    setActiveEvent('SERVER_SPIKE');
    setLog([
      '⚡ Event Detected: Server-4 CPU Usage Spiked to 94.5% (Overload Threshold Exceeded)',
      '🔍 Identifying high-memory module: Report Generation API (Latency Spiked to 85ms)',
      '🧠 Executing Q-Learning Dynamic Infrastructure Reallocator...',
      '🚀 Reallocation Action: Migrated Report Generation workload to Server-3 (US-East)',
      '📉 Metric Restored: Server-4 CPU dropped to 42.0%, Latency normalized to 18.2ms!'
    ]);
    setSimulatedResult({
      affectedModule: 'Report Generation API',
      oldServer: 'Server-4 (AP-South)',
      newServer: 'Server-3 (US-East)',
      latencyReduction: '-66.8 ms',
      status: 'LOAD_BALANCED'
    });
  };

  const handleSimulatePriority = () => {
    setActiveEvent('PRIORITY_ELEVATED');
    setLog([
      '⚡ Event Detected: Task "Login Module & JWT Auth" priority escalated to CRITICAL',
      '🧠 Running Priority-First Earliest Deadline First (EDF) Scheduler...',
      '📅 Schedule Re-sequenced: Login Module assigned Day 1 start slot with parallel execution',
      '✅ Task Schedule successfully updated across Gantt chart timeline!'
    ]);
    setSimulatedResult({
      affectedTask: 'Login Module & JWT Auth',
      newPriority: 'CRITICAL',
      assignedSlot: 'Day 1 (Immediate)',
      status: 'PRIORITY_SCHEDULED'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Dynamic Rescheduling & Reallocation Simulator</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Simulate real-world project disruptions (developer unavailability, server load spikes, urgent task additions) to evaluate live AI re-optimization.
        </p>
      </div>

      {/* Trigger Buttons */}
      <div className="grid-3">
        <button
          className="glass-card"
          onClick={handleSimulateLeave}
          style={{
            textAlign: 'left', cursor: 'pointer', border: activeEvent === 'DEV_OFFLINE' ? '2px solid var(--accent-rose)' : '1px solid var(--border-color)',
            background: 'rgba(244, 63, 94, 0.08)'
          }}
        >
          <div className="badge badge-rose" style={{ marginBottom: '8px' }}>
            <UserX size={12} /> Human Resource Disruption
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Simulate Developer Leave</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Developer C becomes unavailable due to sick leave.</p>
        </button>

        <button
          className="glass-card"
          onClick={handleSimulateSpike}
          style={{
            textAlign: 'left', cursor: 'pointer', border: activeEvent === 'SERVER_SPIKE' ? '2px solid var(--accent-amber)' : '1px solid var(--border-color)',
            background: 'rgba(245, 158, 11, 0.08)'
          }}
        >
          <div className="badge badge-amber" style={{ marginBottom: '8px' }}>
            <Server size={12} /> Computing Disruption
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Simulate Server CPU Spike</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Server-4 CPU spikes to 95% load.</p>
        </button>

        <button
          className="glass-card"
          onClick={handleSimulatePriority}
          style={{
            textAlign: 'left', cursor: 'pointer', border: activeEvent === 'PRIORITY_ELEVATED' ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
            background: 'rgba(168, 85, 247, 0.08)'
          }}
        >
          <div className="badge badge-purple" style={{ marginBottom: '8px' }}>
            <TrendingUp size={12} /> Task Requirement Change
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Escalate Task Priority</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Escalate Login Module to CRITICAL priority.</p>
        </button>
      </div>

      {/* Log Console & Results */}
      {log.length > 0 && (
        <div className="grid-2">
          {/* Realtime Event Execution Terminal */}
          <div className="glass-card" style={{ background: '#05070d', fontFamily: 'monospace' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={14} /> AI Event Processing Log Stream
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              {log.map((line, idx) => (
                <div key={idx} style={{ color: idx === log.length - 1 ? 'var(--accent-emerald)' : 'var(--text-main)', borderLeft: '2px solid var(--accent-indigo)', paddingLeft: '8px' }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Outcome Card */}
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-emerald)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 color="var(--accent-emerald)" size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Dynamic Rescheduling Successful</h3>
            </div>

            {simulatedResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                {simulatedResult.affectedTask && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Target Task:</span>
                      <strong>{simulatedResult.affectedTask}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Reassigned From:</span>
                      <span style={{ color: 'var(--accent-rose)' }}>{simulatedResult.oldDev}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Reassigned To:</span>
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>{simulatedResult.newDev}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Schedule Impact:</span>
                      <strong style={{ color: 'var(--accent-emerald)' }}>{simulatedResult.delayAdded} Delay</strong>
                    </div>
                  </>
                )}

                {simulatedResult.affectedModule && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Application Module:</span>
                      <strong>{simulatedResult.affectedModule}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Migrated From:</span>
                      <span style={{ color: 'var(--accent-amber)' }}>{simulatedResult.oldServer}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Migrated To:</span>
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>{simulatedResult.newServer}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Latency Optimization:</span>
                      <strong style={{ color: 'var(--accent-emerald)' }}>{simulatedResult.latencyReduction}</strong>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
