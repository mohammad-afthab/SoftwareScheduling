import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Settings as SettingsIcon, Key, FileText, CheckCircle2, Lock, Cpu, Database } from 'lucide-react';

export default function Settings({ user }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => location.state?.tab || 'config'); // 'config' | 'roles' | 'audit'

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const auditLogs = [
    { id: 'log-101', timestamp: '2026-10-09 20:45:12', user: 'Rahul Kumar (PM)', action: 'Reassigned task "Payment Gateway API" to Priyanshu Sharma', ip: '192.168.1.45', status: 'SUCCESS' },
    { id: 'log-102', timestamp: '2026-10-09 20:30:04', user: 'System AI Engine', action: 'Executed Two-Level Resource Optimization for E-Commerce Squad', ip: '127.0.0.1', status: 'SUCCESS' },
    { id: 'log-103', timestamp: '2026-10-09 19:15:22', user: 'Vikram Singh (PM)', action: 'Created new project "Cloud Native Migration Project"', ip: '192.168.1.52', status: 'SUCCESS' },
    { id: 'log-104', timestamp: '2026-10-09 18:02:10', user: 'Developer A', action: 'Requested workload review for Payment API Subsystem', ip: '192.168.1.88', status: 'AUDITED' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
          System Settings & Audit Logs
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>
          Manage AI optimization thresholds, user role permissions matrix, and system security audit logs.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('config')}
          style={{
            padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700', borderRadius: '8px', border: 'none',
            background: activeTab === 'config' ? '#4f46e5' : '#f1f5f9',
            color: activeTab === 'config' ? '#ffffff' : '#64748b', cursor: 'pointer'
          }}
        >
          ⚙️ Optimization Config
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          style={{
            padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700', borderRadius: '8px', border: 'none',
            background: activeTab === 'roles' ? '#4f46e5' : '#f1f5f9',
            color: activeTab === 'roles' ? '#ffffff' : '#64748b', cursor: 'pointer'
          }}
        >
          🔐 Role Access Control
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          style={{
            padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700', borderRadius: '8px', border: 'none',
            background: activeTab === 'audit' ? '#4f46e5' : '#f1f5f9',
            color: activeTab === 'audit' ? '#ffffff' : '#64748b', cursor: 'pointer'
          }}
        >
          📜 Security Audit Logs
        </button>
      </div>

      {/* Tab 1: Config */}
      {activeTab === 'config' && (
        <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu color="#4f46e5" size={18} /> AI Engine Optimization Parameters
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                High Capacity Risk Threshold (%)
              </label>
              <input type="number" defaultValue={75} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '4px' }}>Triggers squad capacity risk alert when exceeded.</span>
            </div>

            <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                Developer Overload Limit (%)
              </label>
              <input type="number" defaultValue={80} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '4px' }}>Triggers individual developer overload alerts.</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Roles */}
      {activeTab === 'roles' && (
        <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock color="#059669" size={18} /> Role Access & Authorization Matrix
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Role</th>
                <th style={{ padding: '10px 14px' }}>Projects & Schedule</th>
                <th style={{ padding: '10px 14px' }}>AI Task Assignment</th>
                <th style={{ padding: '10px 14px' }}>Resource Telemetry</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: '700', color: '#4f46e5' }}>ADMIN / PMO</td>
                <td style={{ padding: '10px 14px', color: '#059669', fontWeight: '600' }}>Full Control (Create/Edit/Delete)</td>
                <td style={{ padding: '10px 14px', color: '#059669', fontWeight: '600' }}>Full Control</td>
                <td style={{ padding: '10px 14px', color: '#059669', fontWeight: '600' }}>Full Control</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: '700', color: '#2563eb' }}>PROJECT_MANAGER</td>
                <td style={{ padding: '10px 14px', color: '#059669', fontWeight: '600' }}>Manage Projects & Milestones</td>
                <td style={{ padding: '10px 14px', color: '#059669', fontWeight: '600' }}>Execute AI Assignments</td>
                <td style={{ padding: '10px 14px', color: '#059669', fontWeight: '600' }}>Full Control</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: '700', color: '#64748b' }}>DEVELOPER</td>
                <td style={{ padding: '10px 14px', color: '#64748b' }}>Read-only Access</td>
                <td style={{ padding: '10px 14px', color: '#64748b' }}>Restricted</td>
                <td style={{ padding: '10px 14px', color: '#64748b' }}>Restricted</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Audit */}
      {activeTab === 'audit' && (
        <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText color="#d97706" size={18} /> System Audit Logs
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Timestamp</th>
                <th style={{ padding: '10px 14px' }}>User / Identity</th>
                <th style={{ padding: '10px 14px' }}>Action Executed</th>
                <th style={{ padding: '10px 14px' }}>IP Address</th>
                <th style={{ padding: '10px 14px' }}>Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{log.timestamp}</td>
                  <td style={{ padding: '10px 14px', fontWeight: '600', color: '#0f172a' }}>{log.user}</td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{log.action}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{log.ip}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className="badge badge-emerald">{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
