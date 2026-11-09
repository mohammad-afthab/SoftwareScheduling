import React from 'react';
import { Server, Cpu, HardDrive, Activity, Zap, RefreshCw, Layers } from 'lucide-react';

export default function InfrastructureTab({ servers, allocations, onTriggerReallocation }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Computing Resource Allocation & Infrastructure Telemetry</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Real-time CPU, Memory, Server Load, Request Count, and Application Latency metrics collected via Prometheus format.
          </p>
        </div>
        <button className="btn-primary" onClick={onTriggerReallocation}>
          <Zap size={16} /> Auto-Balance Server Load
        </button>
      </div>

      {/* Server Node Cards */}
      <div className="grid-4">
        {servers.map((server) => {
          const isOverloaded = server.currentCpuUsage > 85.0 || server.currentMemoryUsage > 88.0;
          return (
            <div key={server.id} className="glass-card" style={{
              borderTop: isOverloaded ? '4px solid var(--accent-rose)' : '4px solid var(--accent-emerald)',
              display: 'flex', flexDirection: 'column', gap: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{server.serverName}</h3>
                <span className={`badge ${isOverloaded ? 'badge-rose' : 'badge-emerald'}`}>
                  {server.status}
                </span>
              </div>

              {/* Gauges */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Cpu size={12} /> CPU Usage</span>
                  <strong style={{ color: server.currentCpuUsage > 80 ? 'var(--accent-rose)' : 'var(--text-main)' }}>{server.currentCpuUsage}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${server.currentCpuUsage}%`, height: '100%',
                    background: server.currentCpuUsage > 80 ? 'var(--accent-rose)' : 'var(--accent-indigo)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HardDrive size={12} /> Memory Usage</span>
                  <strong>{server.currentMemoryUsage}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${server.currentMemoryUsage}%`, height: '100%',
                    background: 'var(--accent-purple)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px' }}>
                <span>Requests: <strong>{server.activeRequests} req/s</strong></span>
                <span>Latency: <strong>{server.latencyMs} ms</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Allocation Mapping Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers color="var(--accent-indigo)" /> Deployed Application Module Resource Allocation Matrix
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 16px' }}>Application Module</th>
              <th style={{ padding: '12px 16px' }}>Assigned Server Node</th>
              <th style={{ padding: '12px 16px' }}>Allocated Cores</th>
              <th style={{ padding: '12px 16px' }}>Allocated RAM</th>
              <th style={{ padding: '12px 16px' }}>Expected Latency</th>
              <th style={{ padding: '12px 16px' }}>Optimizer Model</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((alloc) => (
              <tr key={alloc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>{alloc.applicationModule}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className="badge badge-purple">{alloc.assignedServer?.serverName || 'Server-1'}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>{alloc.allocatedCpuCores} Cores</td>
                <td style={{ padding: '12px 16px' }}>{alloc.allocatedMemoryGb} GB</td>
                <td style={{ padding: '12px 16px', color: 'var(--accent-emerald)', fontWeight: '600' }}>{alloc.expectedLatencyMs} ms</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className="badge badge-blue">{alloc.optimizationAlgorithm}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
