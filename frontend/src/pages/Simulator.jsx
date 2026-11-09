import React, { useState } from 'react';
import { Zap, UserX, Clock, Server, ShieldAlert, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

export default function Simulator() {
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);

  const runLeaveSimulation = () => {
    setActiveSimulation('DEV_LEAVE');
    setLogs([
      '⚡ Event Triggered: Developer C (Primary API Engineer) marked as Unavailable (Sick Leave)',
      '🔍 System Monitor: Detected 2 critical pending tasks assigned to Developer C (Payment API)',
      '🧠 Running Hybrid Optimization Engine (Skill Match + Workload Re-evaluator)...',
      '✅ AI Decision: Reassigned Payment API to Developer A (Suitability Match: 85%, Workload: 65%)',
      '📅 Schedule Updated: Project delay risk eliminated (0 days added to completion timeline)'
    ]);
    setResult({
      problem: 'Developer C unavailable (Sick Leave)',
      action: 'Payment API reassigned to Developer A',
      impact: '0 Days Delay (Project Schedule Preserved)',
      status: 'REBALANCED'
    });
  };

  const runDelaySimulation = () => {
    setActiveSimulation('TASK_DELAY');
    setLogs([
      '⚡ Event Triggered: Login Module task delayed by +3 days due to third-party OAuth change',
      '🔍 System Monitor: Dependent tasks identified (Payment API, System Integration Testing)',
      '🧠 Running Priority Earliest Deadline First (EDF) Rescheduler...',
      '📅 Schedule Updated: Shifted Testing start date to Day 13, shifted parallel tasks to maintain deadline',
      '✅ Schedule Conflict Resolved: All milestones adjusted cleanly!'
    ]);
    setResult({
      problem: 'Login Module delayed by +3 days',
      action: 'Adjusted dependent task sequence for Testing & Deployment',
      impact: 'Schedule conflict automatically resolved',
      status: 'RESCHEDULED'
    });
  };

  const runCpuSimulation = () => {
    setActiveSimulation('HIGH_CPU');
    setLogs([
      '⚡ Event Triggered: Server 2 CPU Usage Spiked to 94.8% (High Load Alert)',
      '🔍 System Monitor: High memory consumption on Payment Gateway microservice (Latency 620 ms)',
      '🧠 Running Dynamic Computing Resource Reallocator...',
      '🚀 Reallocation Action: Migrated Payment Gateway workload from Server 2 to Server 3 (EU-Central)',
      '📉 Metric Restored: Server 2 CPU dropped to 45.0%, Application Latency reduced to 180 ms!'
    ]);
    setResult({
      problem: 'Server 2 CPU Spike (94.8%)',
      action: 'Migrated Payment Gateway workload to Server 3',
      impact: 'Latency reduced from 620 ms to 180 ms',
      status: 'REALLOCATED'
    });
  };

  const runServerFailureSimulation = () => {
    setActiveSimulation('SERVER_FAIL');
    setLogs([
      '⚡ Event Triggered: Server 4 Node Crashed / Offline',
      '🔍 System Monitor: Failover trigger activated for 3 active container workloads',
      '🧠 Running Infrastructure Q-Learning Failover Engine...',
      '🚀 Failover Action: Spun up replacement instances across Server 1 and Server 3',
      '✅ Zero Downtime Achieved: Workloads re-routed successfully!'
    ]);
    setResult({
      problem: 'Server 4 Node Failure',
      action: 'Automatic failover to Server 1 & Server 3',
      impact: 'Zero application downtime',
      status: 'FAILOVER_COMPLETE'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a' }}>Dynamic Rescheduling & Reallocation Simulator</h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
          Simulate "What-If" disruption scenarios for developer availability, task delays, CPU spikes, and server failures to see real-time AI re-optimization in action.
        </p>
      </div>

      {/* 4 Simulation Buttons */}
      <div className="grid-4">
        <button
          className="glass-card"
          onClick={runLeaveSimulation}
          style={{
            textAlign: 'left', cursor: 'pointer',
            border: activeSimulation === 'DEV_LEAVE' ? '2px solid #e11d48' : '1px solid #e2e8f0',
            background: activeSimulation === 'DEV_LEAVE' ? '#fff1f2' : '#ffffff'
          }}
        >
          <div className="badge badge-rose" style={{ marginBottom: '8px' }}>
            <UserX size={12} /> Human Resource
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Simulate Developer Leave</h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Developer C becomes unavailable.</p>
        </button>

        <button
          className="glass-card"
          onClick={runDelaySimulation}
          style={{
            textAlign: 'left', cursor: 'pointer',
            border: activeSimulation === 'TASK_DELAY' ? '2px solid #d97706' : '1px solid #e2e8f0',
            background: activeSimulation === 'TASK_DELAY' ? '#fffbeb' : '#ffffff'
          }}
        >
          <div className="badge badge-amber" style={{ marginBottom: '8px' }}>
            <Clock size={12} /> Project Schedule
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Simulate Task Delay</h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Login module delayed +3 days.</p>
        </button>

        <button
          className="glass-card"
          onClick={runCpuSimulation}
          style={{
            textAlign: 'left', cursor: 'pointer',
            border: activeSimulation === 'HIGH_CPU' ? '2px solid #4f46e5' : '1px solid #e2e8f0',
            background: activeSimulation === 'HIGH_CPU' ? '#eff6ff' : '#ffffff'
          }}
        >
          <div className="badge badge-blue" style={{ marginBottom: '8px' }}>
            <Server size={12} /> Computing Resource
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Simulate High CPU Usage</h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Server 2 CPU spikes to 95%.</p>
        </button>

        <button
          className="glass-card"
          onClick={runServerFailureSimulation}
          style={{
            textAlign: 'left', cursor: 'pointer',
            border: activeSimulation === 'SERVER_FAIL' ? '2px solid #7c3aed' : '1px solid #e2e8f0',
            background: activeSimulation === 'SERVER_FAIL' ? '#faf5ff' : '#ffffff'
          }}
        >
          <div className="badge badge-purple" style={{ marginBottom: '8px' }}>
            <ShieldAlert size={12} /> Cloud Infrastructure
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Simulate Server Failure</h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Server 4 node crashes offline.</p>
        </button>
      </div>

      {/* Log Terminal & Result Display */}
      {logs.length > 0 && (
        <div className="grid-2">
          {/* Terminal */}
          <div className="glass-card" style={{ background: '#0f172a', fontFamily: 'monospace', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '0.88rem', color: '#34d399', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={14} /> AI Real-time Event Execution Stream
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              {logs.map((line, idx) => (
                <div key={idx} style={{
                  color: idx === logs.length - 1 ? '#34d399' : '#e2e8f0',
                  borderLeft: '2px solid #6366f1',
                  paddingLeft: '8px'
                }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Outcome Breakdown */}
          <div className="glass-card" style={{ borderLeft: '4px solid #059669', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 color="#059669" size={22} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>Dynamic Rescheduling Completed</h3>
            </div>

            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Triggered Problem:</span>
                  <strong style={{ color: '#be123c' }}>{result.problem}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>AI Action Taken:</span>
                  <strong style={{ color: '#0f172a' }}>{result.action}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>System Impact:</span>
                  <strong style={{ color: '#047857' }}>{result.impact}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
