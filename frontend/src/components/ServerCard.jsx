import React from 'react';
import { Cpu, HardDrive, Activity, Server } from 'lucide-react';

export default function ServerCard({ server }) {
  const isHighLoad = server.cpu > 80 || server.memory > 85;

  return (
    <div className="glass-card" style={{
      borderTop: isHighLoad ? '4px solid #e11d48' : '4px solid #059669',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      background: '#ffffff',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>{server.serverName}</h3>
        <span className={`badge ${isHighLoad ? 'badge-rose' : 'badge-emerald'}`}>
          {server.status}
        </span>
      </div>

      {/* CPU */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
          <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}><Cpu size={12} /> CPU Usage</span>
          <strong style={{ color: server.cpu > 80 ? '#e11d48' : '#0f172a' }}>{server.cpu}%</strong>
        </div>
        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            width: `${server.cpu}%`, height: '100%',
            background: server.cpu > 80 ? '#e11d48' : '#4f46e5',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Memory */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
          <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}><HardDrive size={12} /> Memory Usage</span>
          <strong style={{ color: '#0f172a' }}>{server.memory}%</strong>
        </div>
        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            width: `${server.memory}%`, height: '100%',
            background: '#7c3aed',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b',
        background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 10px', borderRadius: '6px'
      }}>
        <span>Requests: <strong style={{ color: '#0f172a' }}>{server.activeRequests} req/s</strong></span>
        <span>Latency: <strong style={{ color: isHighLoad ? '#e11d48' : '#047857' }}>{server.latency} ms</strong></span>
      </div>
    </div>
  );
}
